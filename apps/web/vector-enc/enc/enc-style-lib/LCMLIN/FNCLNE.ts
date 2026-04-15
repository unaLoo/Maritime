import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFNCLNELines(colors: ColorTableType) {
	const LCMLIN_FNCLNE_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_FNCLNE_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 52], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 1.2 },
	}
	const LCMLIN_FNCLNE_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_FNCLNE_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 52], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_FNCLNE_LINE_0, LCMLIN_FNCLNE_LINE_1] as LineLayerSpecification[] }
}

export default createFNCLNELines(ColorTable)
