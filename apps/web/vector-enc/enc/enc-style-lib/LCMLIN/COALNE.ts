import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCOALNELines(colors: ColorTableType) {
	const LCMLIN_COALNE_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_COALNE_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 30], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	const LCMLIN_COALNE_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_COALNE_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 30], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_COALNE_LINE_0, LCMLIN_COALNE_LINE_1] as LineLayerSpecification[] }
}

export default createCOALNELines(ColorTable)
