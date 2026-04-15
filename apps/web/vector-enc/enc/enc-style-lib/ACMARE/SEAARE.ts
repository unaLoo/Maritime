import { SymbolLayerSpecification, FillLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSEAARELayers(colors: ColorTableType) {
	const SEAARE_SYMBOL_0: SymbolLayerSpecification = {
		id: 'COMARE_SEAARE_SYMBOL_0',
		type: 'symbol',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 119],
		minzoom: 11,
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-allow-overlap': false,
			'text-font': ['Roboto Medium'],
			'text-size': 13,
		},
		paint: {
			'text-color': colors.CHBLK,
		},
	}

	return {
		fills: [] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
		texts: [SEAARE_SYMBOL_0] as SymbolLayerSpecification[],
	}
}

export default createSEAARELayers(ColorTable)
