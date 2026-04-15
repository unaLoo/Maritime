import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_OBSTRN_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_OBSTRN_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'MarkerName1'], 'FLTHAZ02']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'FLTHAZ02',
	},
	paint: {},
}

const ACMMRK_OBSTRN_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_OBSTRN_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'MarkerName1'], 'FOULAR01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'FOULAR01',
	},
	paint: {},
}

const ACMMRK_OBSTRN_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_OBSTRN_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'MarkerName1'], 'FOULGND1']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'FOULGND1',
	},
	paint: {},
}

const ACMMRK_OBSTRN_SYMBOL_3: SymbolLayerSpecification = {
	id: 'ACMMRK_OBSTRN_SYMBOL_3',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'MarkerName1'], 'ACHARE02']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'ACHARE02',
	},
	paint: {},
}

const ACMMRK_OBSTRN_SYMBOL_4: SymbolLayerSpecification = {
	id: 'ACMMRK_OBSTRN_SYMBOL_4',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 86], ['==', ['get', 'MarkerName1'], 'ISODGR51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'ISODGR51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	// ACMMRK_OBSTRN_SYMBOL_0, //'FLTHAZ02'
	// ACMMRK_OBSTRN_SYMBOL_1, // FOULAR01'
	ACMMRK_OBSTRN_SYMBOL_2,
	ACMMRK_OBSTRN_SYMBOL_3,
	ACMMRK_OBSTRN_SYMBOL_4,
]

export default {
	symbols,
}
