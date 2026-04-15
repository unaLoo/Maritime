import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from './ColorTable'

export function createDRGARELayers(colors: ColorTableType) {
    const DRGARE_FILL_0: FillLayerSpecification = {
        id: 'DRGARE_FILL_0',
        type: 'fill',
        source: 'DRGARE',
        'source-layer': 'area_drgare',
        paint: {
            'fill-color': [
                'case',
                ['all', ['<', ['get', 'DRVAL1'], 0], ['<=', ['get', 'DRVAL2'], 0]],
                colors.DEPIT,
                ['<=', ['get', 'DRVAL1'], 2],
                colors.DEPVS,
                ['<=', ['get', 'DRVAL1'], 5],
                colors.DEPMS,
                ['<=', ['get', 'DRVAL1'], 10],
                colors.DEPMD,
                colors.DEPMD,
            ],
        },
    }

    const DEPCNT_Line2: LineLayerSpecification = {
        id: 'DEPCNT_Line_1',
        type: 'line',
        source: 'DRGARE',
        'source-layer': 'area_drgare',
        paint: {
            'line-color': [
                'case',
                ['all',
                    ['>', ['get', 'DRVAL1'], 4.5],
                    ['<', ['get', 'DRVAL1'], 5.5]
                ],
                colors.DEPSC,
                colors.DEPCN
            ],
            'line-width': 1.5
        },
    }

    return {
        fills: [DRGARE_FILL_0] as FillLayerSpecification[],
        lines: [DEPCNT_Line2] as LineLayerSpecification[],
        symbols: [] as SymbolLayerSpecification[],
    }
}

// 保持向后兼容
export default createDRGARELayers(ColorTable)
