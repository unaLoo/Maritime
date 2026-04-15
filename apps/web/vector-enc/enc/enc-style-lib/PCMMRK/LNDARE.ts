import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_LNDARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LNDARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 71],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'LNDARE01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LNDARE_SYMBOL]

export default {
	symbols,
}
