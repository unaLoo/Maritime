import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createOBSTRNLines(colors: ColorTableType) {
	const ACMLIN_OBSTRN_LINE_0: LineLayerSpecification = {
		id: 'ACMLIN_OBSTRN_LINE_0',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 86], ['match', ['get', 'LineType'], [1, 2, 4, 6], true, false]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'LineType'], 1],
				colors.CSTLN,
				['==', ['get', 'LineType'], 2],
				colors.CHMGD,
				['==', ['get', 'LineType'], 4],
				colors.CHBLK,
				colors.CSTLN,
			],
			'line-width': ['case', ['==', ['get', 'LineType'], 4], 2, ['==', ['get', 'LineType'], 6], 2, 1.2],
			'line-dasharray': [4, 4],
		},
	}
	const ACMLIN_OBSTRN_LINE_1: LineLayerSpecification = {
		id: 'ACMLIN_OBSTRN_LINE_1',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 86], ['match', ['get', 'LineType'], [5], true, false]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-width': 16,
			'line-color': colors.CSTLN,
		},
	}
	const ACMLIN_OBSTRN_LINE_2: LineLayerSpecification = {
		id: 'ACMLIN_OBSTRN_LINE_2',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 86], ['match', ['get', 'LineType'], [3], true, false]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-width': 4,
			'line-color': colors.CHBLK,
			'line-dasharray': [0, 2, 2, 2],
		},
	}

	return { lines: [ACMLIN_OBSTRN_LINE_0, ACMLIN_OBSTRN_LINE_1, ACMLIN_OBSTRN_LINE_2] as LineLayerSpecification[] }
}

export default createOBSTRNLines(ColorTable)
