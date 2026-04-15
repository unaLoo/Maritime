import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCRANESLines(colors: ColorTableType) {
	const ACMLIN_CRANES_LINE: LineLayerSpecification = {
		id: 'ACMLIN_CRANES_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['match', ['get', 'OBJL'], [35, 74, 125], true, false],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'LineType'], 1],
				colors.CHBLK,
				['==', ['get', 'LineType'], 2],
				colors.LANDF,
				colors.LANDF,
			],
			'line-width': 1.2,
		},
	}

	return { lines: [ACMLIN_CRANES_LINE] as LineLayerSpecification[] }
}

export default createCRANESLines(ColorTable)
