import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createTIDEWYLines(colors: ColorTableType) {
	const LCMLIN_TIDEWY_LINE: LineLayerSpecification = {
		id: 'LCMLIN_TIDEWY_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 143],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRF, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_TIDEWY_LINE] as LineLayerSpecification[] }
}

export default createTIDEWYLines(ColorTable)
