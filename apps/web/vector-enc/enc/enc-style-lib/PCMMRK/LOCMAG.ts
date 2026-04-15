import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_LOCMAG_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LOCMAG_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 78],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'LOCMAG01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LOCMAG_SYMBOL]

export default {
	symbols,
}
