import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRADLNELines(colors: ColorTableType) {
	const LCMLIN_RADLNE_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RADLNE_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 99],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.TRFCD, 'line-width': 2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_RADLNE_LINE] as LineLayerSpecification[] }
}

export default createRADLNELines(ColorTable)
