import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_DMPGRD_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_DMPGRD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 48],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO07',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_DMPGRD_SYMBOL]

export default {
	symbols,
}
