import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_BUAARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BUAARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 13],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'BUAARE02',
	},
	paint: {},
}

// note: BUAARE has text labels, which are not implemented here

const symbols: SymbolLayerSpecification[] = [PCMMRK_BUAARE_SYMBOL]

export default {
	symbols,
}
