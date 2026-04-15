import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SLOGRD_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SLOGRD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 127],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'HILTOP01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SLOGRD_SYMBOL]

export default {
	symbols,
}
