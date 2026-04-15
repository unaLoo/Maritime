import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCBLSUBLines(colors: ColorTableType) {
	const LCMLIN_CBLSUB_LINE: LineLayerSpecification = {
		id: 'LCMLIN_CBLSUB_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 22],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHMGD, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_CBLSUB_LINE] as LineLayerSpecification[] }
}

export default createCBLSUBLines(ColorTable)
