import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createOBSTRNLines(colors: ColorTableType) {
	const LCMLIN_OBSTRN_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_OBSTRN_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 86], ['match', ['get', 'LineType'], [1, 2, 4], true, false]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'LineType'], 1],
				colors.CSTLN,
				['==', ['get', 'LineType'], 2],
				colors.CHMGD,
				colors.CHBLK,
			],
			'line-width': ['case', ['==', ['get', 'LineType'], 4], 2, 1.2],
			'line-dasharray': [4, 4],
		},
	}
	const LCMLIN_OBSTRN_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_OBSTRN_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'LineType'], 3]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-width': 2, 'line-color': colors.CHBLK, 'line-dasharray': [0, 2, 2, 2] },
	}
	return { lines: [LCMLIN_OBSTRN_LINE_0, LCMLIN_OBSTRN_LINE_1] as LineLayerSpecification[] }
}

export default createOBSTRNLines(ColorTable)
