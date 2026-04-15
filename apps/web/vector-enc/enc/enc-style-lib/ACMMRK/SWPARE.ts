import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_SWPARE_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_SWPARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 134],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SWPARE51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_SWPARE_SYMBOL]

export default {
	symbols,
}
