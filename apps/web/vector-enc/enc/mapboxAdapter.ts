import type { CustomLayerInterface, Map as MapboxMap } from 'mapbox-gl'
import { buildEncOverlay, type EncOverlayBuildOptions } from './buildEncOverlay'
import type { EncOverlayBundle } from './types'
import type { ThemeName } from './enc-style-lib/ColorTable'

function loadIcon(map: MapboxMap, url: string): Promise<ImageBitmap | HTMLImageElement | ImageData> {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => {
      if (error || !image) {
        reject(error ?? new Error(`Failed to load icon: ${url}`))
        return
      }
      resolve(image)
    })
  })
}

function createTransparentPlaceholder(): ImageData {
  return new ImageData(1, 1)
}

export class EncOverlayCustomLayer implements CustomLayerInterface {
  readonly id: string
  readonly type = 'custom' as const
  readonly renderingMode = '2d' as const

  private options: EncOverlayBuildOptions
  private bundle: EncOverlayBundle | null = null
  private bundlePromise: Promise<EncOverlayBundle> | null = null
  private iconUrlById: globalThis.Map<string, string> | null = null
  private readonly loadingIconIds = new Set<string>()
  private readonly resolvedIconIds = new Set<string>()
  private map: MapboxMap | null = null

  constructor(options: EncOverlayBuildOptions & { id?: string } = {}) {
    this.id = options.id ?? 'enc-overlay-custom-layer'
    this.options = options
  }

  async setTheme(theme: ThemeName): Promise<void> {
    if (this.options.theme === theme) {
      return
    }

    const map = this.map
    this.options = {
      ...this.options,
      theme
    }
    if (!map) {
      return
    }

    this.removeOverlayContent(map)
    this.bundle = null
    this.bundlePromise = null
    this.iconUrlById = null
    this.loadingIconIds.clear()
    this.resolvedIconIds.clear()

    await this.addOverlayContent(map)
  }

  private async getBundle(): Promise<EncOverlayBundle> {
    if (this.bundle) {
      return this.bundle
    }
    if (this.bundlePromise) {
      return this.bundlePromise
    }
    this.bundlePromise = this.createBundle()
    this.bundle = await this.bundlePromise
    this.bundlePromise = null
    return this.bundle
  }

  private async createBundle(): Promise<EncOverlayBundle> {
    const sourceBaseUrl = this.options.sourceBaseUrl ?? 'https://localhost:3000/mbtiles'
    const overrides = await this.fetchSourceMaxZoomOverrides(sourceBaseUrl)
    return buildEncOverlay({
      ...this.options,
      sourceMaxZoomOverrides: overrides ?? this.options.sourceMaxZoomOverrides
    })
  }

  private async fetchSourceMaxZoomOverrides(sourceBaseUrl: string): Promise<EncOverlayBuildOptions['sourceMaxZoomOverrides'] | null> {
    try {
      const response = await fetch(`${sourceBaseUrl}/merged.mbtiles/tilejson.json`)
      if (!response.ok) {
        return null
      }
      const data = (await response.json()) as {
        vector_layers?: Array<{ id?: string; maxzoom?: number }>
      }
      if (!Array.isArray(data.vector_layers)) {
        return null
      }
      const maxZoomByVectorLayerId = new Map<string, number>()
      for (const layer of data.vector_layers) {
        if (typeof layer.id === 'string' && typeof layer.maxzoom === 'number') {
          maxZoomByVectorLayerId.set(layer.id, layer.maxzoom)
        }
      }
      const mapping: Array<[keyof NonNullable<EncOverlayBuildOptions['sourceMaxZoomOverrides']>, string]> = [
        ['DEPARE', 'area_depare'],
        ['DRGARE', 'area_drgare'],
        ['OBSTRN', 'area_obstrn'],
        ['LNDARE', 'area_lndare'],
        ['SOUNDG', 'point_soundg'],
        ['AREA_COMMON_AREA', 'area_common_polygon'],
        ['AREA_COMMON_LINE', 'area_common_line'],
        ['LINE_COMMON_LINE', 'line_common'],
        ['AREA_COMMON_POINT', 'area_common_point'],
        ['POINT_COMMON_POINT', 'point_common']
      ]
      const overrides: NonNullable<EncOverlayBuildOptions['sourceMaxZoomOverrides']> = {}
      for (const [sourceId, vectorLayerId] of mapping) {
        const value = maxZoomByVectorLayerId.get(vectorLayerId)
        if (typeof value === 'number') {
          overrides[sourceId] = value
        }
      }
      return overrides
    } catch {
      return null
    }
  }

  private async getIconUrlById(): Promise<globalThis.Map<string, string>> {
    if (!this.iconUrlById) {
      const bundle = await this.getBundle()
      this.iconUrlById = new globalThis.Map(bundle.iconsManifest.map((icon) => [icon.id, icon.url]))
    }
    return this.iconUrlById
  }

  private ensureEncImage = async (map: MapboxMap, imageId: string): Promise<void> => {
    const iconUrl = (await this.getIconUrlById()).get(imageId)
    if (!iconUrl) {
      return
    }
    if (this.resolvedIconIds.has(imageId) || this.loadingIconIds.has(imageId)) {
      return
    }

    this.loadingIconIds.add(imageId)
    try {
      const image = await loadIcon(map, iconUrl)
      if (map.hasImage(imageId)) {
        map.removeImage(imageId)
      }
      map.addImage(imageId, image)
      this.resolvedIconIds.add(imageId)
    } catch {
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, createTransparentPlaceholder())
      }
    } finally {
      this.loadingIconIds.delete(imageId)
    }
  }

  private readonly handleStyleImageMissing = (event: { id: string }): void => {
    if (!this.map) {
      return
    }
    void this.ensureEncImage(this.map, event.id)
  }

  private async addOverlayContent(map: MapboxMap): Promise<void> {
    const bundle = await this.getBundle()
    for (const icon of bundle.iconsManifest) {
      if (!map.hasImage(icon.id)) {
        map.addImage(icon.id, createTransparentPlaceholder())
      }
    }
    // Pre-register placeholders to suppress missing-image warnings, then
    // proactively replace them in background so icons still appear.
    void Promise.allSettled(bundle.iconsManifest.map((icon) => this.ensureEncImage(map, icon.id)))

    for (const [sourceId, source] of Object.entries(bundle.sources)) {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, source)
      }
    }

    for (const layer of bundle.layers) {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer)
      }
    }

    for (const customLayer of bundle.customLayers) {
      if (!map.getLayer(customLayer.id)) {
        map.addLayer(customLayer)
      }
    }
  }

  private removeOverlayContent(map: MapboxMap): void {
    const bundle = this.bundle
    if (!bundle) {
      return
    }

    for (let idx = bundle.customLayers.length - 1; idx >= 0; idx -= 1) {
      const layerId = bundle.customLayers[idx].id
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
    }

    for (let idx = bundle.layers.length - 1; idx >= 0; idx -= 1) {
      const layerId = bundle.layers[idx].id
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
    }

    for (const sourceId of Object.keys(bundle.sources)) {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId)
      }
    }
  }

  onAdd(map: MapboxMap): void {
    this.map = map
    map.on('styleimagemissing', this.handleStyleImageMissing)
    void this.addOverlayContent(map).catch((error) => {
      console.error('Failed to mount ENC overlay content:', error)
    })
  }

  render(): void {
    // No WebGL drawing in this custom layer.
  }

  onRemove(map: MapboxMap): void {
    map.off('styleimagemissing', this.handleStyleImageMissing)
    this.loadingIconIds.clear()
    this.resolvedIconIds.clear()
    this.map = null
    this.removeOverlayContent(map)
  }
}

