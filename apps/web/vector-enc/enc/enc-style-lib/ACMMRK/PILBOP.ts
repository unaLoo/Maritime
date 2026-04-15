import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_PILBOP_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_PILBOP_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 91],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'PILBOP02',
		'icon-offset': [-30, 0],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_PILBOP_SYMBOL]

export default {
	symbols,
}
