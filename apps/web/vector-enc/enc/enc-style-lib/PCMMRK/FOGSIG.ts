import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_FOGSIG_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_FOGSIG_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 58],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FOGSIG01',
		'icon-offset': [-10, 13],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_FOGSIG_SYMBOL]

export default {
	symbols,
}
