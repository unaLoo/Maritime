import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_RSCSTA_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RSCSTA_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 111],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RSCSTA02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RSCSTA_SYMBOL]

export default {
	symbols,
}
