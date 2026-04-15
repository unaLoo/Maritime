import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLNDARELines(colors: ColorTableType) {
	const LCMLIN_LNDARE_LINE: LineLayerSpecification = {
		id: 'LCMLIN_LNDARE_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 71],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CSTLN, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_LNDARE_LINE] as LineLayerSpecification[] }
}

export default createLNDARELines(ColorTable)
