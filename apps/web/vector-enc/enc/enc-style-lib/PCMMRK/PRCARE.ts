import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_PRCARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PRCARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 96],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'PRCARE12',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PRCARE_SYMBOL]

export default {
	symbols,
}
