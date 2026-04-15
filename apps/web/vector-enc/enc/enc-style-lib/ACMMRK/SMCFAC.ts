import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_SMCFAC_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_SMCFAC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 128],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SMCFAC02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_SMCFAC_SYMBOL]

export default {
	symbols,
}
