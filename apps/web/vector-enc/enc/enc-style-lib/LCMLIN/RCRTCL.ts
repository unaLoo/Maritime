import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRCRTCLLines(colors: ColorTableType) {
	const LCMLIN_RCRTCL_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RCRTCL_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 108],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_RCRTCL_LINE] as LineLayerSpecification[] }
}

export default createRCRTCLLines(ColorTable)
