import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createBUAARELayers(colors: ColorTableType) {
    const BUAARE_FILL_0: FillLayerSpecification = {
        id: 'COMARE_BUAARE_FILL_0',
        type: 'fill',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['==', ['get', 'OBJL'], 13],
        minzoom: 13,
        layout: {},
        paint: {
            'fill-color': colors.CHBRN,
        },
    }

    const BUAARE_SYMBOL_0: SymbolLayerSpecification = {
        id: 'COMARE_BUAARE_SYMBOL_0',
        type: 'symbol',
        source: 'AREA_COMMON_AREA',
        'source-layer': 'area_common_polygon',
        filter: ['==', ['get', 'OBJL'], 12],
        minzoom: 11,
        layout: {
            'text-field': ['get', 'OBJNAM'],
            'text-allow-overlap': false,
            'text-font': ['Roboto Medium'],
            'text-size': 13,
        },
        paint: {
            'text-color': colors.CHBLK,
        },
    }

    return {
        fills: [BUAARE_FILL_0] as FillLayerSpecification[],
        lines: [] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
        texts: [BUAARE_SYMBOL_0] as SymbolLayerSpecification[],
    }
}

export default createBUAARELayers(ColorTable)
