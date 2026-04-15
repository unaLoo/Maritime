import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SISTAT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SISTAT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 123],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SISTAT02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SISTAT_SYMBOL]

export default {
	symbols,
}
