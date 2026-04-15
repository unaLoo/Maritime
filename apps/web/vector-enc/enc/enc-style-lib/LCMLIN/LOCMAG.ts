import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLOCMAGLines(colors: ColorTableType) {
	const LCMLIN_LOCMAG_LINE: LineLayerSpecification = {
		id: 'LCMLIN_LOCMAG_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 78],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHMGF, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_LOCMAG_LINE] as LineLayerSpecification[] }
}

export default createLOCMAGLines(ColorTable)
