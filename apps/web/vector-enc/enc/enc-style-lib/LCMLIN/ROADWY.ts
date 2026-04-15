import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createROADWYLines(colors: ColorTableType) {
	const LCMLIN_ROADWY_LINE: LineLayerSpecification = {
		id: 'LCMLIN_ROADWY_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 116],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 2 },
	}
	return { lines: [LCMLIN_ROADWY_LINE] as LineLayerSpecification[] }
}

export default createROADWYLines(ColorTable)
