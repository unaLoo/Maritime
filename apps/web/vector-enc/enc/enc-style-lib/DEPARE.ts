import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from './ColorTable'

export function createDEPARELayers(colors: ColorTableType) {
    const DEPARE_FILL_0: FillLayerSpecification = {
        id: 'DEPARE_FILL_0',
        type: 'fill',
        source: 'DEPARE',
        // 'source-layer': 'DEPARE',
        'source-layer': 'area_depare',
        paint: {
            'fill-color': [
                'case',
                ['<', ['get', 'DRVAL1'], 0], // land
                colors.DEPIT,
                ['<', ['get', 'DRVAL1'], 2], // < shallow contour
                colors.DEPVS,
                ['<', ['get', 'DRVAL1'], 5], // < safe contour
                colors.DEPMS,
                ['<', ['get', 'DRVAL1'], 10],// < deep contour
                colors.DEPMD,
                colors.DEPDW,
            ],
        },
    }

    const DEPCNT_Line: LineLayerSpecification = {
        id: 'DEPCNT_Line_0',
        type: 'line',
        source: 'DEPARE',
        // 'source-layer': 'DEPARE',
        'source-layer': 'area_depare',
        paint: {
            'line-color': [
                'case',
                ['all',
                    ['>', ['get', 'DRVAL1'], 4.5],
                    ['<', ['get', 'DRVAL1'], 5.5]
                ],
                // colors.DEPSC,
                colors.DEPCN,
                colors.DEPCN
            ],
            // 'line-width': 1.3
            'line-width': 1.5
        },
    }

    return {
        fills: [DEPARE_FILL_0] as FillLayerSpecification[],
        lines: [DEPCNT_Line] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
    }
}

// 保持向后兼容
export default createDEPARELayers(ColorTable)
