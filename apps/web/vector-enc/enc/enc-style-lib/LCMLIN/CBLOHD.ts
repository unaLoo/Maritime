import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCBLOHDLines(colors: ColorTableType) {
	const LCMLIN_CBLOHD_LINE: LineLayerSpecification = {
		id: 'LCMLIN_CBLOHD_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 21],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 4, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_CBLOHD_LINE] as LineLayerSpecification[] }
}

export default createCBLOHDLines(ColorTable)
