import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_CRANES_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CRANES_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 35],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CRANES01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CRANES_SYMBOL]

export default {
	symbols,
}
