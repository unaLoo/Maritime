import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:55">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FSHFAC02" />
//     <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FSHFAC03" />
//     <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FSHHAV01" />
// </style>

const PCMMRK_FSHFAC_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_FSHFAC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 55], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'FSHFAC02',
			['==', ['get', 'CATEGORY'], 2],
			'FSHFAC03',
			['==', ['get', 'CATEGORY'], 3],
			'FSHHAV01',
			'FSHFAC02', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_FSHFAC_SYMBOL]

export default {
	symbols,
}
