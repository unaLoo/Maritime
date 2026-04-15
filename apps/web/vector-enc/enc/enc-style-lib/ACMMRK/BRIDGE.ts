import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_BRIDGE_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_BRIDGE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 11], ['==', ['get', 'MarkerName1'], 'BRIDGE01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'BRIDGE01',
	},
	paint: {},
}

// Text layer for BRIDGE
const ACMMRK_BRIDGE_TEXT: SymbolLayerSpecification = {
	id: 'ACMMRK_BRIDGE_TEXT',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 11],
	minzoom: 11,
	layout: {
		'text-field': ['get', 'OBJNAM'],
		'text-allow-overlap': false,
		'text-font': ['Roboto Medium'],
		'text-size': 14,
	},
	paint: {
		'text-color': '#000000',
	},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_BRIDGE_SYMBOL]

export default {
	symbols,
	texts: [ACMMRK_BRIDGE_TEXT],
}
