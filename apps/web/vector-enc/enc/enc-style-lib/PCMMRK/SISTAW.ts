import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SISTAW_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SISTAW_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 124],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SISTAT02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SISTAW_SYMBOL]

export default {
	symbols,
}
