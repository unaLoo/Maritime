import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createTSELNELines(colors: ColorTableType) {
	const LCMLIN_TSELNE_LINE: LineLayerSpecification = {
		id: 'LCMLIN_TSELNE_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 145],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.TRFCF, 'line-width': 6 },
	}
	return { lines: [LCMLIN_TSELNE_LINE] as LineLayerSpecification[] }
}

export default createTSELNELines(ColorTable)
