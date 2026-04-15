import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_CTNARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CTNARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 27],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO06',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CTNARE_SYMBOL]

export default {
	symbols,
}
