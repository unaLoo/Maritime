import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSLCONSLayers(colors: ColorTableType) {
    const SLCONS_FILL_0: FillLayerSpecification = {
        id: 'COMARE_SLCONS_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['all', ['==', ['get', 'OBJL'], 122], ['==', ['get', 'FillType'], 1]],
        paint: {
            'fill-color': colors.CHBRN,
        },
    }

    return {
        fills: [SLCONS_FILL_0] as FillLayerSpecification[],
        lines: [] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
    }
}

export default createSLCONSLayers(ColorTable)
