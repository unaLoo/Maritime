import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_CTNARE_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_CTNARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 27],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CTNARE51',
		'icon-offset': [10, 0],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_CTNARE_SYMBOL]

export default {
	symbols,
}
