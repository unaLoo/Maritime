import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createDMPGRDLines(colors: ColorTableType) {
	const ACMLIN_DMPGRD_LINE_0: LineLayerSpecification = {
		id: 'ACMLIN_DMPGRD_LINE_0',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 48], ['==', ['get', 'LineType'], 1]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-pattern': 'NAVARE51',
			'line-width': 16,
		},
	}
	const ACMLIN_DMPGRD_LINE_1: LineLayerSpecification = {
		id: 'ACMLIN_DMPGRD_LINE_1',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['all', ['==', ['get', 'OBJL'], 48], ['==', ['get', 'LineType'], 2]],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-pattern': 'CTYARE51',
			'line-width': 16,
		},
	}

	return { lines: [ACMLIN_DMPGRD_LINE_0, ACMLIN_DMPGRD_LINE_1] as LineLayerSpecification[] }
}

export default createDMPGRDLines(ColorTable)
