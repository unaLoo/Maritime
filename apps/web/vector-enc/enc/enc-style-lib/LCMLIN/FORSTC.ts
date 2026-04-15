import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFORSTCLines(colors: ColorTableType) {
	const LCMLIN_FORSTC_LINE: LineLayerSpecification = {
		id: 'LCMLIN_FORSTC_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 59],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 3 },
	}
	return { lines: [LCMLIN_FORSTC_LINE] as LineLayerSpecification[] }
}

export default createFORSTCLines(ColorTable)
