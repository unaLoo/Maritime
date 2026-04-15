import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_PILPNT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PILPNT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 90],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'PILPNT02',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PILPNT_SYMBOL]

export default {
	symbols,
}
