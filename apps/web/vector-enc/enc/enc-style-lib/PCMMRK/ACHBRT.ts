import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_ACHBRT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_ACHBRT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 3],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'ACHBRT07',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_ACHBRT_SYMBOL]

export default {
	symbols,
}
