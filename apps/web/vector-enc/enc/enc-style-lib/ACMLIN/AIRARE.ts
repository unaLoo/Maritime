import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createAIRARELines(colors: ColorTableType) {
    const ACMLIN_AIRARE_LINE: LineLayerSpecification = {
        id: 'ACMLIN_AIRARE_LINE',
        type: 'line',
        source: 'AREA_COMMON_LINE',
        'source-layer': 'area_common_line',
        filter: ['==', ['get', 'OBJL'], 2],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': [
                'case',
                ['==', ['get', 'LineType'], 1],
                colors.CHBLK,
                ['==', ['get', 'LineType'], 2],
                colors.LANDF,
                colors.LANDF,
            ],
        },
    }

    return { lines: [ACMLIN_AIRARE_LINE] as LineLayerSpecification[] }
}

export default createAIRARELines(ColorTable)
