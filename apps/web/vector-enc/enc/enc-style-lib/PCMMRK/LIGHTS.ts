import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_LIGHTS_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LIGHTS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 75], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'LITDEF11',
			['==', ['get', 'CATEGORY'], 2],
			'LIGHTS11',
			['==', ['get', 'CATEGORY'], 3],
			'LIGHTS12',
			['==', ['get', 'CATEGORY'], 4],
			'LIGHTS13',
			['==', ['get', 'CATEGORY'], 5],
			'LIGHTS81',
			['==', ['get', 'CATEGORY'], 6],
			'LIGHTS82',
			'LITDEF11',
		],
		'icon-offset': [10, 13],
		'icon-rotate': ['case', ['==', ['get', 'CATEGORY'], 1], 135, 0],
	},
	paint: {
		'icon-opacity': 0.5,
	},
}

const PCMMRK_LIGHTS_SYMBOL_2: SymbolLayerSpecification = {
	// as a placeholder for customlayer
	id: 'PCMMRK_LIGHTS_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 75],
		['match', ['get', 'CATEGORY'], [101, 102, 103, 104, 201, 202, 203, 204], true, false],
	],
	minzoom: 9,
	layout: {
		'text-field': ['get', 'CATEGORY'],
		'text-size': 50,
		'text-allow-overlap': false,
		'text-font': ['Roboto Medium'],
	},
	paint: {
		'text-opacity': 0.0,
	},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LIGHTS_SYMBOL, PCMMRK_LIGHTS_SYMBOL_2]

export default {
	symbols,
}
