import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_AIRARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_AIRARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 2],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'AIRARE02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_AIRARE_SYMBOL]

export default {
	symbols,
}
