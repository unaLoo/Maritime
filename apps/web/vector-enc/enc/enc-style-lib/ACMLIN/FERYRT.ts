import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFERYRTLines(colors: ColorTableType) {
	const ACMLIN_FERYRT_LINE: LineLayerSpecification = {
		id: 'ACMLIN_FERYRT_LINE',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 53],
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
				colors.CHMGD,
				colors.CHBLK,
			],
			'line-width': 2,
			'line-dasharray': [4, 4],
		},
	}

	return { lines: [ACMLIN_FERYRT_LINE] as LineLayerSpecification[] }
}

export default createFERYRTLines(ColorTable)
