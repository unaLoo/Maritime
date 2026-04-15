import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_ACHARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_ACHARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 4],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'ACHARE02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_ACHARE_SYMBOL]

export default {
	symbols,
}
