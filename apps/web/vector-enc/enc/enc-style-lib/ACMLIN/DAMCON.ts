import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createDAMCONLines(colors: ColorTableType) {
	const ACMLIN_DAMCON_LINE: LineLayerSpecification = {
		id: 'ACMLIN_DAMCON_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 38],
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
				colors.LANDF,
				colors.LANDF,
			],
			'line-width': ['case', ['==', ['get', 'LineType'], 1], 2, ['==', ['get', 'LineType'], 2], 2, 1.2],
		},
	}

	return { lines: [ACMLIN_DAMCON_LINE] as LineLayerSpecification[] }
}

export default createDAMCONLines(ColorTable)
