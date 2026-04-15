import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_GATCON_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_GATCON_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 61], ['==', ['get', 'MarkerName1'], 'GATCON03']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'GATCON03',
	},
	paint: {},
}

const ACMMRK_GATCON_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_GATCON_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 61], ['==', ['get', 'MarkerName1'], 'GATCON04']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'GATCON04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_GATCON_SYMBOL_0, ACMMRK_GATCON_SYMBOL_1]

export default {
	symbols,
}
