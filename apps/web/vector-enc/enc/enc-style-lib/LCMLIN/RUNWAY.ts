import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRUNWAYLines(colors: ColorTableType) {
	const LCMLIN_RUNWAY_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RUNWAY_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 117],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 3 },
	}
	return { lines: [LCMLIN_RUNWAY_LINE] as LineLayerSpecification[] }
}

export default createRUNWAYLines(ColorTable)
