import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_CTRPNT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CTRPNT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 33],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'POSGEN04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CTRPNT_SYMBOL]

export default {
	symbols,
}
