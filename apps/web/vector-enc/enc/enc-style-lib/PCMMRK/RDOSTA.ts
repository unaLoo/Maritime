import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_RDOSTA_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RDOSTA_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 105],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RDOSTA02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RDOSTA_SYMBOL]

export default {
	symbols,
}
