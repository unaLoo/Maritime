import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createDOCARELines(colors: ColorTableType) {
	const ACMLIN_DOCARE_LINE_0: LineLayerSpecification = {
		id: 'ACMLIN_DOCARE_LINE_0',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 45], ['==', ['get', 'LineType'], 1]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': colors.CHBLK,
			'line-width': 1.2,
			'line-dasharray': [4, 4],
		},
	}
	const ACMLIN_DOCARE_LINE_1: LineLayerSpecification = {
		id: 'ACMLIN_DOCARE_LINE_1',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 45], ['==', ['get', 'LineType'], 2]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': colors.CHBLK,
			'line-width': 1.2,
		},
	}

	return { lines: [ACMLIN_DOCARE_LINE_0, ACMLIN_DOCARE_LINE_1] as LineLayerSpecification[] }
}

export default createDOCARELines(ColorTable)
