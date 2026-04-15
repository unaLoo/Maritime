import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSLOTOPLines(colors: ColorTableType) {
	const LCMLIN_SLOTOP_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_SLOTOP_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 126], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 1.2 },
	}
	const LCMLIN_SLOTOP_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_SLOTOP_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 126], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 1.2 },
	}
	const LCMLIN_SLOTOP_LINE_2: LineLayerSpecification = {
		id: 'LCMLIN_SLOTOP_LINE_2',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 126], ['==', ['get', 'LineType'], 3]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_SLOTOP_LINE_0, LCMLIN_SLOTOP_LINE_1, LCMLIN_SLOTOP_LINE_2] as LineLayerSpecification[] }
}

export default createSLOTOPLines(ColorTable)
