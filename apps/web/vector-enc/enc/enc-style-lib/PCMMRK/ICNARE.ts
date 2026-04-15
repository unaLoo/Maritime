import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_ICNARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_ICNARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 67],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'HULKES01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_ICNARE_SYMBOL]

export default {
	symbols,
}
