import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_LOCMAG_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_LOCMAG_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 78],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'LOCMAG51',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_LOCMAG_SYMBOL]

export default {
	symbols,
}
