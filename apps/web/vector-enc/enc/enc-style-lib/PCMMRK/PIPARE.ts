import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_PIPARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PIPARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 92],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO07',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PIPARE_SYMBOL]

export default {
	symbols,
}
