import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_FSHGRD_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_FSHGRD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 56],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FSHGRD01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_FSHGRD_SYMBOL]

export default {
	symbols,
}
