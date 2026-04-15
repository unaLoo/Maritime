import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_CGUSTA_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CGUSTA_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 29],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CGUSTA02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CGUSTA_SYMBOL]

export default {
	symbols,
}
