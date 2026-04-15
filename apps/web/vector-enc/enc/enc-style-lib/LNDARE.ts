import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from './ColorTable'

export function createLNDARELayers(colors: ColorTableType) {
    const LNDARE_FILL_0: FillLayerSpecification = {
        id: 'LNDARE_FILL_0',
        type: 'fill',
        source: 'LNDARE',
        'source-layer': 'area_lndare',
        paint: {
            'fill-color': colors.LANDA,
        },
    }

    return {
        fills: [LNDARE_FILL_0] as FillLayerSpecification[],
        lines: [] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
    }
}

// 保持向后兼容
export default createLNDARELayers(ColorTable)
