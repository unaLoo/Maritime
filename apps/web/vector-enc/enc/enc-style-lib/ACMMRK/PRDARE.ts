import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_PRDARE_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'RFNERY11']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RFNERY11',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'TNKFRM11']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TNKFRM11',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'WNDFRM61']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'WNDFRM61',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_3: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_3',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'QUARRY01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'QUARRY01',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_4: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_4',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'RFNERY01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RFNERY01',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_5: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_5',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'TMBYRD01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TMBYRD01',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_6: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_6',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'TNKFRM01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TNKFRM01',
	},
	paint: {},
}

const ACMMRK_PRDARE_SYMBOL_7: SymbolLayerSpecification = {
	id: 'ACMMRK_PRDARE_SYMBOL_7',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['==', ['get', 'MarkerName1'], 'WNDFRM51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'WNDFRM51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	ACMMRK_PRDARE_SYMBOL_0,
	ACMMRK_PRDARE_SYMBOL_1,
	ACMMRK_PRDARE_SYMBOL_2,
	ACMMRK_PRDARE_SYMBOL_3,
	ACMMRK_PRDARE_SYMBOL_4,
	ACMMRK_PRDARE_SYMBOL_5,
	ACMMRK_PRDARE_SYMBOL_6,
	ACMMRK_PRDARE_SYMBOL_7,
]

export default {
	symbols,
}
