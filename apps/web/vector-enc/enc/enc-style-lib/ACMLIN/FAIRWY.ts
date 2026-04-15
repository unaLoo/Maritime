import { LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createFAIRWYLines(colors: ColorTableType) {
	const ACMLIN_FAIRWY_LINE_0: LineLayerSpecification = {
		id: 'ACMLIN_FAIRWY_LINE_0',
		type: 'line',
		source: 'AREA_COMMON_LINE',
		'source-layer': 'area_common_line',
		filter: ['==', ['get', 'OBJL'], 51],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-pattern': 'NAVARE51',
			'line-width': 16,
		},
	}

	return { lines: [ACMLIN_FAIRWY_LINE_0] as LineLayerSpecification[] }
}

export default createFAIRWYLines(ColorTable)
