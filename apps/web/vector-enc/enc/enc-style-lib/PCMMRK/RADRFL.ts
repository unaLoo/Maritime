import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_RADRFL_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RADRFL_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 101],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RADRFL03',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RADRFL_SYMBOL]

export default {
	symbols,
}
