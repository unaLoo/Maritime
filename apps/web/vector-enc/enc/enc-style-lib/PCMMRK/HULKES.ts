import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_HULKES_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_HULKES_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 65],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'HULKES01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_HULKES_SYMBOL]

export default {
	symbols,
}
