import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createDAMCONLines(colors: ColorTableType) {
	const LCMLIN_DAMCON_LINE: LineLayerSpecification = {
		id: 'LCMLIN_DAMCON_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 38],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 4 },
	}
	return { lines: [LCMLIN_DAMCON_LINE] as LineLayerSpecification[] }
}

export default createDAMCONLines(ColorTable)
