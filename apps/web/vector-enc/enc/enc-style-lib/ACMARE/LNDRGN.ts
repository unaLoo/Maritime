import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createLNDRGNLayers(colors: ColorTableType) {
	const LNDRGN_FILL_0: FillLayerSpecification = {
		id: 'COMARE_LNDRGN_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['all', ['==', ['get', 'OBJL'], 73], ['==', ['get', 'FillType'], 1]],
		paint: {
			'fill-pattern': 'MARSHES1P',
			'fill-opacity': 1,
		},
	}

	const LNDRGN_SYMBOL_0: SymbolLayerSpecification = {
		id: 'COMARE_LNDRGN_SYMBOL_0',
		type: 'symbol',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['all', ['==', ['get', 'OBJL'], 73], ['==', ['get', 'FillType'], 2]],
		minzoom: 11,
		layout: {
			'text-field': ['get', 'OBJNAM'],
			'text-allow-overlap': true,
			'text-font': ['Roboto Medium'],
			'text-size': 13,
		},
		paint: {
			'text-color': colors.CHBLK,
		},
	}

	return {
		fills: [LNDRGN_FILL_0] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
		texts: [LNDRGN_SYMBOL_0] as SymbolLayerSpecification[],
	}
}

export default createLNDRGNLayers(ColorTable)
