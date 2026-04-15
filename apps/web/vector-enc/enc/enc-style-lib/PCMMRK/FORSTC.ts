import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_FORSTC_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_FORSTC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 59],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'FORSTC11',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_FORSTC_SYMBOL]

export default {
	symbols,
}
