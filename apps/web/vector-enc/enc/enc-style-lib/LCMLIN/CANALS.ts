import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createCANALSLines(colors: ColorTableType) {
	const LCMLIN_CANALS_LINE: LineLayerSpecification = {
		id: 'LCMLIN_CANALS_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 23],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHBLK, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_CANALS_LINE] as LineLayerSpecification[] }
}

export default createCANALSLines(ColorTable)
