import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFERYRTLines(colors: ColorTableType) {
    const LCMLIN_FERYRT_LINE_0: LineLayerSpecification = {
        id: 'LCMLIN_FERYRT_LINE_0',
        type: 'line',
        source: 'LINE_COMMON_LINE',
        'source-layer': 'line_common',
        filter: ['all', ['==', ['get', 'OBJL'], 53], ['==', ['get', 'CATEGORY'], 1]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-pattern': 'FERYRT01', 'line-width': 12 },
        // paint: { 'line-color': '#f51010', 'line-width': 12 },
    }
    const LCMLIN_FERYRT_LINE_1: LineLayerSpecification = {
        id: 'LCMLIN_FERYRT_LINE_1',
        type: 'line',
        source: 'LINE_COMMON_LINE',
        'source-layer': 'line_common',
        filter: ['all', ['==', ['get', 'OBJL'], 53], ['==', ['get', 'CATEGORY'], 2]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-pattern': 'FERYRT02', 'line-width': 12 },
    }
    return { lines: [LCMLIN_FERYRT_LINE_0, LCMLIN_FERYRT_LINE_1] as LineLayerSpecification[] }
}

export default createFERYRTLines(ColorTable)
