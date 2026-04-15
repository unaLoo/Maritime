import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCONVYRLines(colors: ColorTableType) {
	const LCMLIN_CONVYR_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_CONVYR_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 34], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 4, 'line-dasharray': [4, 4] },
	}
	const LCMLIN_CONVYR_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_CONVYR_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 34], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 3 },
	}
	return { lines: [LCMLIN_CONVYR_LINE_0, LCMLIN_CONVYR_LINE_1] as LineLayerSpecification[] }
}

export default createCONVYRLines(ColorTable)
