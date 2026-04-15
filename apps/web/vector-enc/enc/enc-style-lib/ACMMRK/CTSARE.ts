import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_CTSARE_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_CTSARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 25],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'INFARE51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_CTSARE_SYMBOL]

export default {
	symbols,
}
