import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSNDWAVLines(colors: ColorTableType) {
	const LCMLIN_SNDWAV_LINE: LineLayerSpecification = {
		id: 'LCMLIN_SNDWAV_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 118],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 2, 'line-dasharray': [4, 4] },
	}
	return { lines: [LCMLIN_SNDWAV_LINE] as LineLayerSpecification[] }
}

export default createSNDWAVLines(ColorTable)
