import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_PILBOP_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PILBOP_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 91],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'PILBOP02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PILBOP_SYMBOL]

export default {
	symbols,
}
