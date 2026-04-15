import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createOILBARLines(colors: ColorTableType) {
	const LCMLIN_OILBAR_LINE: LineLayerSpecification = {
		id: 'LCMLIN_OILBAR_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 89],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_OILBAR_LINE] as LineLayerSpecification[] }
}

export default createOILBARLines(ColorTable)
