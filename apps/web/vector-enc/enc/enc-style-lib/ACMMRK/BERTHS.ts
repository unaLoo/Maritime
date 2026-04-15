import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_BERTHS_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_BERTHS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 10],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'BRTHNO01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_BERTHS_SYMBOL]

export default {
	symbols,
}
