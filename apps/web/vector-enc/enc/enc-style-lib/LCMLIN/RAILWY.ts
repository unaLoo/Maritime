import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRAILWYLines(colors: ColorTableType) {
	const LCMLIN_RAILWY_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RAILWY_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 106],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 2 },
	}
	return { lines: [LCMLIN_RAILWY_LINE] as LineLayerSpecification[] }
}

export default createRAILWYLines(ColorTable)
