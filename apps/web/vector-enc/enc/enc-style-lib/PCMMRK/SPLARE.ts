import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SPLARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SPLARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 120],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO06',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SPLARE_SYMBOL]

export default {
	symbols,
}
