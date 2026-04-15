import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_SNDWAV_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SNDWAV_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 118],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'SNDWAV02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SNDWAV_SYMBOL]

export default {
	symbols,
}
