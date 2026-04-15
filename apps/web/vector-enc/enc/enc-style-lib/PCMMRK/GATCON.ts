import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_GATCON_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_GATCON_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 61],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'GATCON04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_GATCON_SYMBOL]

export default {
	symbols,
}
