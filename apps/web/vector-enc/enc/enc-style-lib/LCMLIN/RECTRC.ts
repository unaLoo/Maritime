import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRECTRCLines(colors: ColorTableType) {
	const LCMLIN_RECTRC_LINE_0: LineLayerSpecification = {
		id: 'LCMLIN_RECTRC_LINE_0',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'CATEGORY'], 1]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-pattern': 'RECTRC12', 'line-width': 10 },
	}
	const LCMLIN_RECTRC_LINE_1: LineLayerSpecification = {
		id: 'LCMLIN_RECTRC_LINE_1',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'CATEGORY'], 2]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-pattern': 'RECTRC10', 'line-width': 10 },
	}
	const LCMLIN_RECTRC_LINE_2: LineLayerSpecification = {
		id: 'LCMLIN_RECTRC_LINE_2',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'CATEGORY'], 3]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-pattern': 'RECTRC11', 'line-width': 10 },
	}
	const LCMLIN_RECTRC_LINE_3: LineLayerSpecification = {
		id: 'LCMLIN_RECTRC_LINE_3',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'CATEGORY'], 4]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-pattern': 'RECTRC09', 'line-width': 10 },
	}
	const LCMLIN_RECTRC_LINE_4: LineLayerSpecification = {
		id: 'LCMLIN_RECTRC_LINE_4',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'CATEGORY'], 5]],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-pattern': 'RECDEF02', 'line-width': 10 },
	}
	return {
		lines: [
			LCMLIN_RECTRC_LINE_0,
			LCMLIN_RECTRC_LINE_1,
			LCMLIN_RECTRC_LINE_2,
			LCMLIN_RECTRC_LINE_3,
			LCMLIN_RECTRC_LINE_4,
		] as LineLayerSpecification[],
	}
}

export default createRECTRCLines(ColorTable)
