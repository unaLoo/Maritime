import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:38">
//     <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CHINFO06" />
// </style>

const PCMMRK_DAMCON_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_DAMCON_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 38], ['==', ['get', 'CATEGORY'], 3]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CHINFO06',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_DAMCON_SYMBOL]

export default {
	symbols,
}
