import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_LNDRGN_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LNDRGN_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 73],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'POSGEN04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LNDRGN_SYMBOL]

export default {
	symbols,
}
