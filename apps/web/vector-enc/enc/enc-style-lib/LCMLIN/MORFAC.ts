import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createMORFACLines(colors: ColorTableType) {
	const LCMLIN_MORFAC_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_MORFAC_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 84], ['==', ['get', 'LineType'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHMGF, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	const LCMLIN_MORFAC_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_MORFAC_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 84], ['==', ['get', 'LineType'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 2 },
	}
	return { lines: [LCMLIN_MORFAC_LINE_0, LCMLIN_MORFAC_LINE_1] as LineLayerSpecification[] }
}

export default createMORFACLines(ColorTable)
