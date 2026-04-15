import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// TS_PRH Tidal stream - harmonic prediction (key:136)
const ACMMRK_TS_PRH_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_PRH_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 136],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDSTR01',
	},
	paint: {},
}

// TS_PNH Tidal stream - non-harmonic prediction (key:137)
const ACMMRK_TS_PNH_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_PNH_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 137],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDSTR01',
	},
	paint: {},
}

// TS_PAD Tidal stream panel data (key:138)
const ACMMRK_TS_PAD_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_PAD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 138],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDSTR01',
	},
	paint: {},
}

// TS_TIS Tidal stream - time series (key:139)
const ACMMRK_TS_TIS_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_TS_TIS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 139],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDSTR01',
	},
	paint: {},
}

// T_HMON Tide - harmonic prediction (key:140)
const ACMMRK_T_HMON_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_T_HMON_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 140],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDEHT01',
	},
	paint: {},
}

// T_NHMN Tide - non-harmonic prediction (key:141)
const ACMMRK_T_NHMN_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_T_NHMN_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 141],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDEHT01',
	},
	paint: {},
}

// T_TIMS Tidal stream - time series (key:142)
const ACMMRK_T_TIMS_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_T_TIMS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 142],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TIDEHT01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	ACMMRK_TS_PRH_SYMBOL,
	ACMMRK_TS_PNH_SYMBOL,
	ACMMRK_TS_PAD_SYMBOL,
	ACMMRK_TS_TIS_SYMBOL,
	ACMMRK_T_HMON_SYMBOL,
	ACMMRK_T_NHMN_SYMBOL,
	ACMMRK_T_TIMS_SYMBOL,
]

export default {
	symbols,
}
