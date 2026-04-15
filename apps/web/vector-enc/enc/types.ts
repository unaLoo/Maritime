import type { AnySourceData, CustomLayerInterface, LayerSpecification } from 'mapbox-gl'

export type EncPlacement = 'bottom' | 'middle' | 'top'

export interface IconManifestItem {
  id: string
  url: string
  requiredByLayers: string[]
}

export interface EncOverlayBundle {
  sources: Record<string, AnySourceData>
  layers: LayerSpecification[]
  customLayers: CustomLayerInterface[]
  iconsManifest: IconManifestItem[]
}

