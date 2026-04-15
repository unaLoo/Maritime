import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_FSHFAC_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_FSHFAC_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 55], ['==', ['get', 'MarkerName1'], 'FSHFAC02']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FSHFAC02',
	},
	paint: {},
}

const ACMMRK_FSHFAC_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_FSHFAC_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 55], ['==', ['get', 'MarkerName1'], 'FSHFAC03']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FSHFAC03',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_FSHFAC_SYMBOL_0, ACMMRK_FSHFAC_SYMBOL_1]

export default {
	symbols,
}
