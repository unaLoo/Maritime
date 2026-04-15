import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSLCONSLines(colors: ColorTableType) {
	const LCMLIN_SLCONS_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_SLCONS_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 122], ['match', ['get', 'LineType'], [1, 4], true, false]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: {
			'line-color': colors.CSTLN,
			'line-width': ['case', ['==', ['get', 'LineType'], 1], 1, 2],
			'line-dasharray': [4, 4],
		},
	}
	const LCMLIN_SLCONS_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_SLCONS_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 122], ['match', ['get', 'LineType'], [2, 3, 5], true, false]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: {
			'line-color': colors.CSTLN,
			'line-width': ['case', ['==', ['get', 'LineType'], 2], 4, ['==', ['get', 'LineType'], 3], 2, 2],
		},
	}
	return { lines: [LCMLIN_SLCONS_LINE_0, LCMLIN_SLCONS_LINE_1] as LineLayerSpecification[] }
}

export default createSLCONSLines(ColorTable)
