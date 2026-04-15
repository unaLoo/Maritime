import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_FERYRT_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_FERYRT_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 53], ['==', ['get', 'MarkerName1'], 'FRYARE52']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FRYARE52',
		'icon-offset': [19, -40],
	},
	paint: {},
}

const ACMMRK_FERYRT_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_FERYRT_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 53], ['==', ['get', 'MarkerName1'], 'FRYARE51']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FRYARE51',
		'icon-offset': [19, -44],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_FERYRT_SYMBOL_0, ACMMRK_FERYRT_SYMBOL_1]

export default {
	symbols,
}
