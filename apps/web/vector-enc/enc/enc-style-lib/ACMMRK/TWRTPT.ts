import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_TWRTPT_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_TWRTPT_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 152], ['==', ['get', 'MarkerName1'], 'TWRTPT53']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TWRTPT53',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {
		'icon-opacity': 0.5,
	},
}

const ACMMRK_TWRTPT_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_TWRTPT_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 152], ['==', ['get', 'MarkerName1'], 'TWRTPT52']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TWRTPT52',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {
		'icon-opacity': 0.5,
	},
}

const ACMMRK_TWRTPT_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_TWRTPT_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 152], ['==', ['get', 'MarkerName1'], 'TWRDEF51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'TWRDEF51',
	},
	paint: {
		'icon-opacity': 0.5,
	},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_TWRTPT_SYMBOL_0, ACMMRK_TWRTPT_SYMBOL_1, ACMMRK_TWRTPT_SYMBOL_2]

export default {
	symbols,
}
