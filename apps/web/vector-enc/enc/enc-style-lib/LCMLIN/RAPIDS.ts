import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRAPIDSLines(colors: ColorTableType) {
	const LCMLIN_RAPIDS_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RAPIDS_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 107],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 3 },
	}
	return { lines: [LCMLIN_RAPIDS_LINE] as LineLayerSpecification[] }
}

export default createRAPIDSLines(ColorTable)
