import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SPRING_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SPRING_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 130],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SPRING02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SPRING_SYMBOL]

export default {
	symbols,
}
