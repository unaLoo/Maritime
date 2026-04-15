import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_RETRFL_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RETRFL_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 113],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RETRFL01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RETRFL_SYMBOL]

export default {
	symbols,
}
