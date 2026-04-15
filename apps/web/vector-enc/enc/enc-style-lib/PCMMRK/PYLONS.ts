import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_PYLONS_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PYLONS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 98],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'POSGEN03',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PYLONS_SYMBOL]

export default {
	symbols,
}
