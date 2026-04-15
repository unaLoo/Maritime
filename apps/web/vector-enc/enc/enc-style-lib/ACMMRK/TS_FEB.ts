import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_TS_FEB_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_FEB_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 160], ['==', ['get', 'MarkerName1'], 'FLDSTR01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'FLDSTR01',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_TS_FEB_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_FEB_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 160], ['==', ['get', 'MarkerName1'], 'EBBSTR01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'EBBSTR01',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_TS_FEB_SYMBOL_2: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_FEB_SYMBOL_2',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 160], ['==', ['get', 'MarkerName1'], 'CURENT01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'CURENT01',
		'icon-rotate': ['get', 'ORIENT'],
	},
	paint: {},
}

const ACMMRK_TS_FEB_SYMBOL_3: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_FEB_SYMBOL_3',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 160], ['==', ['get', 'MarkerName1'], 'CURDEF01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-ignore-placement': false,
		'icon-image': 'CURDEF01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	ACMMRK_TS_FEB_SYMBOL_0,
	ACMMRK_TS_FEB_SYMBOL_1,
	ACMMRK_TS_FEB_SYMBOL_2,
	ACMMRK_TS_FEB_SYMBOL_3,
]

export default {
	symbols,
}
