import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLAKSHRLines(colors: ColorTableType) {
	const LCMLIN_LAKSHR_LINE: LineLayerSpecification = {
		id: 'LCMLIN_LAKSHR_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 70],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_LAKSHR_LINE] as LineLayerSpecification[] }
}

export default createLAKSHRLines(ColorTable)
