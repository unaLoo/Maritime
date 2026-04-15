import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSBDARELines(colors: ColorTableType) {
	const LCMLIN_SBDARE_LINE: LineLayerSpecification = {
		id: 'LCMLIN_SBDARE_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 121],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 1.2 },
	}
	return { lines: [LCMLIN_SBDARE_LINE] as LineLayerSpecification[] }
}

export default createSBDARELines(ColorTable)
