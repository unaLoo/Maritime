import { LineLayerSpecification, SymbolLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createPIPOHDLines(colors: ColorTableType) {
	const LCMLIN_PIPOHD_LINE: LineLayerSpecification = {
		id: 'LCMLIN_PIPOHD_LINE',
		type: 'line',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 93],
		layout: { 'line-cap': 'round', 'line-join': 'round' },
		paint: { 'line-color': colors.CHGRD, 'line-width': 3 },
	}
	const LCMLIN_PIPOHD_TEXT: SymbolLayerSpecification = {
		id: 'LCMLIN_PIPOHD_TEXT',
		type: 'symbol',
		source: 'LINE_COMMON_LINE',
		'source-layer': 'line_common',
		filter: ['==', ['get', 'OBJL'], 93],
		minzoom: 11,
		layout: {
			'symbol-placement': 'line',
			'text-field': ['get', 'OBJNAM'],
			'text-allow-overlap': false,
			'text-font': ['Roboto Medium'],
			'text-size': 14,
		},
		paint: { 'text-color': colors.CHBLK },
	}
	return {
		lines: [LCMLIN_PIPOHD_LINE] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
		texts: [LCMLIN_PIPOHD_TEXT] as SymbolLayerSpecification[],
	}
}

export default createPIPOHDLines(ColorTable)
