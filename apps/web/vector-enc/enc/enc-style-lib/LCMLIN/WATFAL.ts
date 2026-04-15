import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createWATFALLines(colors: ColorTableType) {
	const LCMLIN_WATFAL_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_WATFAL_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 157], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHWHT, 'line-width': 3 },
	}
	const LCMLIN_WATFAL_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_WATFAL_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 157], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRF, 'line-width': 3 },
	}
	return { lines: [LCMLIN_WATFAL_LINE_0, LCMLIN_WATFAL_LINE_1] as LineLayerSpecification[] }
}

export default createWATFALLines(ColorTable)
