import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_RCTLPT_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_RCTLPT_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 110], ['==', ['get', 'MarkerName1'], 'RCTLPT52']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RCTLPT52',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_RCTLPT_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_RCTLPT_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 110], ['==', ['get', 'MarkerName1'], 'RTLDEF51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'RTLDEF51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_RCTLPT_SYMBOL_0, ACMMRK_RCTLPT_SYMBOL_1]

export default {
	symbols,
}
