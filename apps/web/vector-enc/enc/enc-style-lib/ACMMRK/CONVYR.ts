import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_CONVYR_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_CONVYR_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 34], ['==', ['get', 'MarkerName1'], 'RACNSP01']],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RACNSP01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_CONVYR_SYMBOL]

export default {
	symbols,
}
