import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createDEPCNTLines(colors: ColorTableType) {
    const LCMLIN_DEPCNT_LINE: LineLayerSpecification = {
        id: 'LCMLIN_DEPCNT_LINE',
        type: 'line',
        source: 'LINE_COMMON_LINE',
        'source-layer': 'line_common',
        filter: ['==', ['get', 'OBJL'], 43],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': colors.DEPCN, 'line-width': 1 },
    }
    return { lines: [LCMLIN_DEPCNT_LINE] as LineLayerSpecification[] }
}

export default createDEPCNTLines(ColorTable)
