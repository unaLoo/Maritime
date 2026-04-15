import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRIVERSLines(colors: ColorTableType) {
	const LCMLIN_RIVERS_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RIVERS_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 114],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_RIVERS_LINE] as LineLayerSpecification[] }
}

export default createRIVERSLines(ColorTable)
