import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createPONTONLines(colors: ColorTableType) {
	const LCMLIN_PONTON_LINE: LineLayerSpecification = {
		id: 'LCMLIN_PONTON_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 95],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 2 },
	}
	return { lines: [LCMLIN_PONTON_LINE] as LineLayerSpecification[] }
}

export default createPONTONLines(ColorTable)
