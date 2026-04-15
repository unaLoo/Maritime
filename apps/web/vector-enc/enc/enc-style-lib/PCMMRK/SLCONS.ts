import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:122;">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MORFAC03" />
//     <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:PIER0001" />
// </style>

const PCMMRK_SLCONS_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SLCONS_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 122], ['match', ['get', 'CATEGORY'], [1, 4], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'MORFAC03',
			['==', ['get', 'CATEGORY'], 4],
			'PIER0001',
			'MORFAC03',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SLCONS_SYMBOL]

export default {
	symbols,
}
