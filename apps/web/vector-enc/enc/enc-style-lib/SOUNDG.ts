import { SymbolLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from './ColorTable'

export function createSOUNDGLayers(colors: ColorTableType) {
    const valueExpr = ['to-number', ['coalesce', ['get', 'z'], 0]]
    const valStr = ['to-string', valueExpr]
    const dotIdx = ['index-of', '.', valStr]

    const intPartExpr = ['to-string', ['floor', valueExpr]]
    const decPartExpr = [
        'case',
        ['!=', dotIdx, -1],
        ['slice', valStr, ['+', dotIdx, 1]],
        '',
    ]
    const textColorExpr = ['case', ['<', valueExpr, 5], colors.CHBLK, colors.CHGRD]

    const SOUNDG_INT: SymbolLayerSpecification = {
        id: 'SOUNDG_INT',
        type: 'symbol',
        source: 'SOUNDG',
        // 'source-layer': 'soundg3d',
        'source-layer': 'point_soundg',
        minzoom: 11,
        layout: {
            'text-field': intPartExpr as any,
            'text-size': 16,
            'text-pitch-alignment': 'map',
            'text-allow-overlap': true,
            'text-ignore-placement': true,
        },
        paint: {
            'text-color': textColorExpr as any,
        },
    }

    const SOUNDG_DEC: SymbolLayerSpecification = {
        id: 'SOUNDG_DEC',
        type: 'symbol',
        source: 'SOUNDG',
        // 'source-layer': 'soundg3d',
        'source-layer': 'point_soundg',
        minzoom: 11,
        filter: ['all', ['<', valueExpr, 31], ['!=', decPartExpr, '']],
        layout: {
            'text-field': decPartExpr as any,
            'text-size': 16,
            'text-pitch-alignment': 'map',
            'text-anchor': 'top-left',
            'text-offset': [
                'case',
                ['>=', ['floor', valueExpr], 10],
                ['literal', [0.5, -0.15]],
                ['literal', [0.3, -0.15]],
            ],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
        },
        paint: {
            'text-color': textColorExpr as any,
        },
    }

    return {
        texts: [
            SOUNDG_INT,
            SOUNDG_DEC,
        ] as SymbolLayerSpecification[],
    }
}

export default createSOUNDGLayers(ColorTable)
