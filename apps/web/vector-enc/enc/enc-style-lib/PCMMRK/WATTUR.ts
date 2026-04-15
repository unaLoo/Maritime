import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_WATTUR_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_WATTUR_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 156],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'WATTUR02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_WATTUR_SYMBOL]

export default {
	symbols,
}
