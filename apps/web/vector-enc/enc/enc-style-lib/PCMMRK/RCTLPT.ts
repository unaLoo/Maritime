import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:110;">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RCTLPT52;rotate:[5]" />
//     <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RTLDEF51" />
// </style>

const PCMMRK_RCTLPT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RCTLPT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 110], ['match', ['get', 'CATEGORY'], [1, 2], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'RCTLPT52',
			['==', ['get', 'CATEGORY'], 2],
			'RTLDEF51',
			'RCTLPT52',
		],
		'icon-rotate': ['case', ['==', ['get', 'CATEGORY'], 1], ['get', 'VAL1'], ['==', ['get', 'CATEGORY'], 2], 0, 0],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RCTLPT_SYMBOL]

export default {
	symbols,
}
