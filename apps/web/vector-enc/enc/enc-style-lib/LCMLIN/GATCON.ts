import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createGATCONLines(colors: ColorTableType) {
	const LCMLIN_GATCON_LINE: LineLayerSpecification = {
		id: 'LCMLIN_GATCON_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 61],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 2 },
	}
	return { lines: [LCMLIN_GATCON_LINE] as LineLayerSpecification[] }
}

export default createGATCONLines(ColorTable)
