import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createBRIDGELines(colors: ColorTableType) {
	const LCMLIN_BRIDGE_LINE: LineLayerSpecification = {
		id: 'LCMLIN_BRIDGE_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 11],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 4 },
	}
	return { lines: [LCMLIN_BRIDGE_LINE] as LineLayerSpecification[] }
}

export default createBRIDGELines(ColorTable)
