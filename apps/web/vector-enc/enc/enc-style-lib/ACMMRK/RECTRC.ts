import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_RECTRC_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_RECTRC_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'MarkerName1'], 'RECTRC58']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RECTRC58',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_RECTRC_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_RECTRC_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'MarkerName1'], 'RECTRC56']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RECTRC56',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_RECTRC_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_RECTRC_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'MarkerName1'], 'RECTRC57']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RECTRC57',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_RECTRC_SYMBOL_3: SymbolLayerSpecification = {
	id: 'ACMMRK_RECTRC_SYMBOL_3',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'MarkerName1'], 'RECTRC55']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RECTRC55',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_RECTRC_SYMBOL_4: SymbolLayerSpecification = {
	id: 'ACMMRK_RECTRC_SYMBOL_4',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 109], ['==', ['get', 'MarkerName1'], 'RECDEF51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RECDEF51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	ACMMRK_RECTRC_SYMBOL_0,
	ACMMRK_RECTRC_SYMBOL_1,
	ACMMRK_RECTRC_SYMBOL_2,
	ACMMRK_RECTRC_SYMBOL_3,
	ACMMRK_RECTRC_SYMBOL_4,
]

export default {
	symbols,
}
