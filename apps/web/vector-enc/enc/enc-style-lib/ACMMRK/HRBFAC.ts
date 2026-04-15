import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_HRBFAC_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_HRBFAC_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 64], ['==', ['get', 'MarkerName1'], 'ROLROL01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'ROLROL01',
	},
	paint: {},
}

const ACMMRK_HRBFAC_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_HRBFAC_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 64], ['==', ['get', 'MarkerName1'], 'HRBFAC09']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'HRBFAC09',
	},
	paint: {},
}

const ACMMRK_HRBFAC_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_HRBFAC_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 64], ['==', ['get', 'MarkerName1'], 'SMCFAC02']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SMCFAC02',
	},
	paint: {},
}

const ACMMRK_HRBFAC_SYMBOL_3: SymbolLayerSpecification = {
	id: 'ACMMRK_HRBFAC_SYMBOL_3',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 64], ['==', ['get', 'MarkerName1'], 'CHINFO07']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO07',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	ACMMRK_HRBFAC_SYMBOL_0,
	ACMMRK_HRBFAC_SYMBOL_1,
	ACMMRK_HRBFAC_SYMBOL_2,
	ACMMRK_HRBFAC_SYMBOL_3,
]

export default {
	symbols,
}
