import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFLODOCLines(colors: ColorTableType) {
	const LCMLIN_FLODOC_LINE: LineLayerSpecification = {
		id: 'LCMLIN_FLODOC_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 57],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 3 },
	}
	return { lines: [LCMLIN_FLODOC_LINE] as LineLayerSpecification[] }
}

export default createFLODOCLines(ColorTable)
