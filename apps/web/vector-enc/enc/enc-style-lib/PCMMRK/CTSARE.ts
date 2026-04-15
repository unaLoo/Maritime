import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_CTSARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CTSARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 25],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO07',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CTSARE_SYMBOL]

export default {
	symbols,
}
