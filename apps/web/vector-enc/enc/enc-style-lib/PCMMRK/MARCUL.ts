import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_MARCUL_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_MARCUL_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 82],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'MARCUL02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_MARCUL_SYMBOL]

export default {
	symbols,
}
