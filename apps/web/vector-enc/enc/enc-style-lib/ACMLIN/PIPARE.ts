import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createPIPARELines(colors: ColorTableType) {
	const ACMLIN_PIPARE_LINE: LineLayerSpecification = {
		id: 'ACMLIN_PIPARE_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 92],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-color': [
				'case',
				['==', ['get', 'LineType'], 1],
				colors.CHMGD,
				['==', ['get', 'LineType'], 2],
				colors.CHGRD,
				colors.CHMGD,
			],
			'line-width': 2,
			'line-dasharray': [4, 4],
		},
	}

	return { lines: [ACMLIN_PIPARE_LINE] as LineLayerSpecification[] }
}

export default createPIPARELines(ColorTable)
