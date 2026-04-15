import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCAUSWYLines(colors: ColorTableType) {
	const LCMLIN_CAUSWY_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_CAUSWY_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 26], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 3, 'line-dasharray': [4, 4] },
	}
	const LCMLIN_CAUSWY_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_CAUSWY_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 26], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 3 },
	}
	return { lines: [LCMLIN_CAUSWY_LINE_0, LCMLIN_CAUSWY_LINE_1] as LineLayerSpecification[] }
}

export default createCAUSWYLines(ColorTable)
