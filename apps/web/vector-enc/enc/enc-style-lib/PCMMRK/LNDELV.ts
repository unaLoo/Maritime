import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_LNDELV_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LNDELV_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 72],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'POSGEN04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LNDELV_SYMBOL]

export default {
	symbols,
}
