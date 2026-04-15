import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createMARCULLines(colors: ColorTableType) {
	const LCMLIN_MARCUL_LINE: LineLayerSpecification = {
		id: 'LCMLIN_MARCUL_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 82],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRF, 'line-width': 2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_MARCUL_LINE] as LineLayerSpecification[] }
}

export default createMARCULLines(ColorTable)
