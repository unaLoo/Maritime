import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLNDELVLines(colors: ColorTableType) {
	const LCMLIN_LNDELV_LINE: LineLayerSpecification = {
		id: 'LCMLIN_LNDELV_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 72],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.LANDF, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_LNDELV_LINE] as LineLayerSpecification[] }
}

export default createLNDELVLines(ColorTable)
