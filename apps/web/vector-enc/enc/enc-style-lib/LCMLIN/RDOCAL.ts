import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createRDOCALLines(colors: ColorTableType) {
	const LCMLIN_RDOCAL_LINE: LineLayerSpecification = {
		id: 'LCMLIN_RDOCAL_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 104],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.TRFCD, 'line-width': 1.2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_RDOCAL_LINE] as LineLayerSpecification[] }
}

export default createRDOCALLines(ColorTable)
