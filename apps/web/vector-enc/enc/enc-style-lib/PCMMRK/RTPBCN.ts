import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_RTPBCN_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RTPBCN_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 103],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'RTPBCN02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RTPBCN_SYMBOL]

export default {
	symbols,
}
