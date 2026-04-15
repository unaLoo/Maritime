import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_BRIDGE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BRIDGE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 11],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'BRIDGE01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BRIDGE_SYMBOL]

export default {
	symbols,
}
