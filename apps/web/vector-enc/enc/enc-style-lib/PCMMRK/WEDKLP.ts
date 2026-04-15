import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_WEDKLP_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_WEDKLP_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 158],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'WEDKLP03',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_WEDKLP_SYMBOL]

export default {
	symbols,
}
