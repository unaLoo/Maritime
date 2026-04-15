import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_MIPARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_MIPARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 83],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO06',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_MIPARE_SYMBOL]

export default {
	symbols,
}
