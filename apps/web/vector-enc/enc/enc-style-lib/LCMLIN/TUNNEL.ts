import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createTUNNELLines(colors: ColorTableType) {
	const LCMLIN_TUNNEL_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_TUNNEL_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 151], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 2.0, 'line-dasharray': [4, 4] },
	}
	const LCMLIN_TUNNEL_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_TUNNEL_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 151], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_TUNNEL_LINE_0, LCMLIN_TUNNEL_LINE_1] as LineLayerSpecification[] }
}

export default createTUNNELLines(ColorTable)
