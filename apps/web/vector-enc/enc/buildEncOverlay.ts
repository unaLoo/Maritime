import type { EncOverlayBundle, EncPlacement } from './types'
import { createDEPARELayers } from './enc-style-lib/DEPARE'
import { createDRGARELayers } from './enc-style-lib/DRGARE'
import { createLNDARELayers } from './enc-style-lib/LNDARE'
import { createOBSTRNLayers } from './enc-style-lib/OBSTRN'
import { createSOUNDGLayers } from './enc-style-lib/SOUNDG'
import { createACMARELayers } from './enc-style-lib/ACMARE'
import { createACMLINLayers } from './enc-style-lib/ACMLIN'
import { createLCMLINLayers } from './enc-style-lib/LCMLIN'
import ACMMRK from './enc-style-lib/ACMMRK'
import PCMMRK from './enc-style-lib/PCMMRK'
import { createPCMTEXLayers } from './enc-style-lib/PCMTEX'
import { ColorTables } from './enc-style-lib/ColorTable'
import type { ThemeName } from './enc-style-lib/ColorTable'
import type { AnySourceData, LayerSpecification } from 'mapbox-gl'
import type { IconManifestItem } from './types'
import LIGHTSLAYER from './enc-style-lib/CUSTOM_LIGHTS'

export interface EncOverlayBuildOptions {
  theme?: ThemeName
  showLand?: boolean
  showSoundings?: boolean
  sourceBaseUrl?: string
  iconBaseUrl?: string
  sourceMaxZoomOverrides?: Partial<Record<keyof typeof DEFAULT_SOURCE_MAXZOOMS, number>>
}

const DEFAULT_SOURCE_MAXZOOMS = {
  DEPARE: 13,
  DRGARE: 10,
  OBSTRN: 13,
  LNDARE: 13,
  SOUNDG: 9,
  AREA_COMMON_AREA: 13,
  AREA_COMMON_LINE: 13,
  LINE_COMMON_LINE: 11,
  AREA_COMMON_POINT: 7,
  POINT_COMMON_POINT: 10
} as const

function buildVectorSource(url: string, maxzoom?: number): AnySourceData {
  return maxzoom === undefined
    ? {
        type: 'vector',
        url
      }
    : {
        type: 'vector',
        url,
        maxzoom
      }
}

function withPlacement(layer: LayerSpecification, placement: EncPlacement): LayerSpecification {
  return {
    ...layer,
    slot: placement
  }
}

function collectStaticImageNames(layers: LayerSpecification[]): Map<string, Set<string>> {
  const refs = new Map<string, Set<string>>()
  const isCssColorLike = (value: string): boolean => {
    const text = value.trim().toLowerCase()
    return (
      text.startsWith('rgb(') ||
      text.startsWith('rgba(') ||
      text.startsWith('hsl(') ||
      text.startsWith('hsla(') ||
      text.startsWith('#') ||
      text === 'transparent'
    )
  }

  const add = (name: unknown, layerId: string) => {
    if (typeof name !== 'string' || name.length === 0) {
      return
    }
    if (isCssColorLike(name)) {
      return
    }
    if (!refs.has(name)) {
      refs.set(name, new Set<string>())
    }
    refs.get(name)!.add(layerId)
  }

  const addFromValue = (value: unknown, layerId: string) => {
    if (typeof value === 'string') {
      add(value, layerId)
      return
    }

    if (!Array.isArray(value) || value.length === 0) {
      return
    }

    const operator = value[0]
    if (typeof operator !== 'string') {
      for (const item of value) {
        addFromValue(item, layerId)
      }
      return
    }

    // Handle common Mapbox expression patterns where output values are in fixed positions.
    if (operator === 'case') {
      for (let i = 2; i < value.length - 1; i += 2) {
        addFromValue(value[i], layerId)
      }
      addFromValue(value[value.length - 1], layerId)
      return
    }

    if (operator === 'match') {
      for (let i = 3; i < value.length - 1; i += 2) {
        addFromValue(value[i], layerId)
      }
      addFromValue(value[value.length - 1], layerId)
      return
    }

    if (operator === 'step') {
      for (let i = 2; i < value.length; i += 2) {
        addFromValue(value[i], layerId)
      }
      return
    }

    if (operator === 'coalesce') {
      for (let i = 1; i < value.length; i++) {
        addFromValue(value[i], layerId)
      }
      return
    }

    for (let i = 1; i < value.length; i++) {
      addFromValue(value[i], layerId)
    }
  }

  for (const layer of layers) {
    const layerId = layer.id
    if (layer.type === 'symbol') {
      addFromValue(layer.layout?.['icon-image'], layerId)
    }
    if (layer.type === 'fill') {
      addFromValue(layer.paint?.['fill-pattern'], layerId)
    }
    if (layer.type === 'line') {
      addFromValue(layer.paint?.['line-pattern'], layerId)
    }
  }

  return refs
}

export function buildEncOverlay(options: EncOverlayBuildOptions = {}): EncOverlayBundle {
  const theme = options.theme ?? 'DAY_BRIGHT'
  const showLand = options.showLand ?? true
  const showSoundings = options.showSoundings ?? true
  const sourceBaseUrl = options.sourceBaseUrl ?? 'https://localhost:3000/mbtiles'
  const iconBaseUrl = options.iconBaseUrl ?? 'https://localhost:3000/static/all'
  const mergedTileJsonUrl = `${sourceBaseUrl}/merged.mbtiles/tilejson.json`
  const sourceMaxZooms = {
    ...DEFAULT_SOURCE_MAXZOOMS,
    ...(options.sourceMaxZoomOverrides ?? {})
  }
  const colors = ColorTables[theme]

  const depare = createDEPARELayers(colors)
  const drgare = createDRGARELayers(colors)
  const lndare = createLNDARELayers(colors)
  const obstrn = createOBSTRNLayers(colors)
  const soundg = createSOUNDGLayers(colors)
  const acmare = createACMARELayers(colors)
  const acmlin = createACMLINLayers(colors)
  const lcmlin = createLCMLINLayers(colors)
  const pcmtex = createPCMTEXLayers(colors)

  const sources: Record<string, AnySourceData> = {
    DEPARE: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.DEPARE),
    DRGARE: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.DRGARE),
    OBSTRN: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.OBSTRN),
    LNDARE: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.LNDARE),
    SOUNDG: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.SOUNDG),
    AREA_COMMON_AREA: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.AREA_COMMON_AREA),
    AREA_COMMON_LINE: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.AREA_COMMON_LINE),
    LINE_COMMON_LINE: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.LINE_COMMON_LINE),
    AREA_COMMON_POINT: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.AREA_COMMON_POINT),
    POINT_COMMON_POINT: buildVectorSource(mergedTileJsonUrl, sourceMaxZooms.POINT_COMMON_POINT)
  }

  const layers: LayerSpecification[] = [
    ...depare.fills.map((layer) => withPlacement(layer, 'bottom')),
    ...drgare.fills.map((layer) => withPlacement(layer, 'bottom')),
    ...acmlin.underAreaLines.map((layer) => withPlacement(layer, 'bottom')),
    ...(showLand ? lndare.fills.map((layer) => withPlacement(layer, 'bottom')) : []),
    ...obstrn.fills.map((layer) => withPlacement(layer, 'bottom')),
    ...acmare.fills.map((layer) => withPlacement(layer, 'bottom')),
    ...depare.lines.map((layer) => withPlacement(layer, 'middle')),
    ...drgare.lines.map((layer) => withPlacement(layer, 'middle')),
    ...obstrn.lines.map((layer) => withPlacement(layer, 'middle')),
    ...acmare.lines.map((layer) => withPlacement(layer, 'middle')),
    ...acmlin.lines.map((layer) => withPlacement(layer, 'middle')),
    ...lcmlin.lines.map((layer) => withPlacement(layer, 'middle')),
    ...acmare.symbols.map((layer) => withPlacement(layer, 'top')),
    ...ACMMRK.symbols.map((layer) => withPlacement(layer, 'top')),
    ...PCMMRK.symbols.map((layer) => withPlacement(layer, 'top')),
    ...acmare.texts.map((layer) => withPlacement(layer, 'top')),
    ...lcmlin.texts.map((layer) => withPlacement(layer, 'top')),
    ...ACMMRK.texts.map((layer) => withPlacement(layer, 'top')),
    ...pcmtex.texts.map((layer) => withPlacement(layer, 'top')),
    ...(showSoundings ? soundg.texts.map((layer) => withPlacement(layer, 'top')) : [])
  ]
  const staticImageRefs = collectStaticImageNames(layers)
  const iconsManifest: IconManifestItem[] = Array.from(staticImageRefs.entries()).map(([name, layerIds]) => ({
    id: name,
    url: `${iconBaseUrl}/${name}.png`,
    requiredByLayers: Array.from(layerIds)
  }))
  const customLayers = [new LIGHTSLAYER(colors)]

  return {
    sources,
    layers,
    customLayers,
    iconsManifest
  }
}

