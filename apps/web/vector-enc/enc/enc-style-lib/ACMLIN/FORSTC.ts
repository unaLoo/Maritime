import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFORSTCLines(colors: ColorTableType) {
	const ACMLIN_FORSTC_LINE: LineLayerSpecification = {
		id: 'ACMLIN_FORSTC_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 59],
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

	return { lines: [ACMLIN_FORSTC_LINE] as LineLayerSpecification[] }
}

export default createFORSTCLines(ColorTable)
