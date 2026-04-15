import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createWRECKSLines(colors: ColorTableType) {
    const ACMLIN_WRECKS_LINE_0: LineLayerSpecification = {
        id: 'ACMLIN_WRECKS_LINE_0',
        type: 'line',
        source: 'AREA_COMMON_LINE',
        'source-layer': 'area_common_line',
        filter: ['all', ['==', ['get', 'OBJL'], 159], ['match', ['get', 'LineType'], [1, 3, 6], true, false]],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-color': [
                'case',
                ['==', ['get', 'LineType'], 6],
                colors.CSTLN,
                colors.CHBLK
            ],
            'line-width': [
                'case',
                ['==', ['get', 'LineType'], 1],
                1,
                2
            ],
            'line-dasharray': [4, 4],
        },
    }
    const ACMLIN_WRECKS_LINE_1: LineLayerSpecification = {
        id: 'ACMLIN_WRECKS_LINE_1',
        type: 'line',
        source: 'AREA_COMMON_LINE',
        'source-layer': 'area_common_line',
        filter: ['all', ['==', ['get', 'OBJL'], 159], ['match', ['get', 'LineType'], [5], true, false]],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-width': 2,
            'line-color': colors.CSTLN,
        },
    }
    const ACMLIN_WRECKS_LINE_2: LineLayerSpecification = {
        id: 'ACMLIN_WRECKS_LINE_2',
        type: 'line',
        source: 'AREA_COMMON_LINE',
        'source-layer': 'area_common_line',
        filter: ['all', ['==', ['get', 'OBJL'], 86], ['match', ['get', 'LineType'], [2, 4], true, false]],
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-width': 2,
            'line-color': [
                'case',
                ['==', ['get', 'LineType'], 2],
                colors.CHBLK,
                colors.CSTLN],
            'line-dasharray': [0, 2, 2, 2],
        },
    }

    return { lines: [ACMLIN_WRECKS_LINE_0, ACMLIN_WRECKS_LINE_1, ACMLIN_WRECKS_LINE_2] as LineLayerSpecification[] }
}

export default createWRECKSLines(ColorTable)
