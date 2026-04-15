import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from './ColorTable'

export function createOBSTRNLayers(colors: ColorTableType) {
    const OBSTRN_FILL_0: FillLayerSpecification = {
        id: 'OBSTRN_FILL_0',
        type: 'fill',
        source: 'OBSTRN',
        'source-layer': 'area_obstrn',
        filter: ['==', ['get', 'FILLTYPE'], 1],
        paint: {
            'fill-pattern': 'FOULAR01',
        },
    }
    const OBSTRN_FILL_1: FillLayerSpecification = {
        id: 'OBSTRN_FILL_1',
        type: 'fill',
        source: 'OBSTRN',
        'source-layer': 'area_obstrn',
        filter: ['match', ['get', 'FILLTYPE'], [2, 3, 4], true, false],
        paint: {
            'fill-color': [
                'case',
                ['==', ['get', 'FILLTYPE'], 2],
                colors.DEPMD,
                ['==', ['get', 'FILLTYPE'], 3],
                colors.CHBRN,
                ['==', ['get', 'FILLTYPE'], 4],
                colors.DEPIT,
                'rgba(0,0,0,0)',
            ],
        },
    }
    const OBSTRN_FILL_OUTLINE: LineLayerSpecification = {
        id: 'OBSTRN_LINE_1',
        type: 'line',
        source: 'OBSTRN',
        'source-layer': 'area_obstrn',
        filter: ['match', ['get', 'FILLTYPE'], [2, 3, 4], true, false],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-dasharray': [1, 4],
            'line-color': colors.CHBLK,
            'line-width': 3,
        },
    }

    return {
        fills: [OBSTRN_FILL_0, OBSTRN_FILL_1] as FillLayerSpecification[],
        lines: [OBSTRN_FILL_OUTLINE] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
    }
}

// 保持向后兼容
export default createOBSTRNLayers(ColorTable)
