import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_CHKPNT_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_CHKPNT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 28],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'POSGEN04',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_CHKPNT_SYMBOL]

export default {
	symbols,
}
