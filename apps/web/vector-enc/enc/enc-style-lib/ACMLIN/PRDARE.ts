import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createPRDARELines(colors: ColorTableType) {
	const ACMLIN_PRDARE_LINE: LineLayerSpecification = {
		id: 'ACMLIN_PRDARE_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 97],
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
			'line-dasharray': [4, 4],
		},
	}

	return { lines: [ACMLIN_PRDARE_LINE] as LineLayerSpecification[] }
}

export default createPRDARELines(ColorTable)
