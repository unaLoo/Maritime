import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const PCMMRK_OFSPLF_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_OFSPLF_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 87],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'OFSPLF01',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_OFSPLF_SYMBOL]

export default {
	symbols,
}
