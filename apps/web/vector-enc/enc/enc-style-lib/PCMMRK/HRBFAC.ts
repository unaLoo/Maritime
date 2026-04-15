import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:64">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CHINFO07" />
//     <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:HRBFAC09" />
//     <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ROLROL01" />
//     <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:SMCFAC02" />
// </style>

const PCMMRK_HRBFAC_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_HRBFAC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 64], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'CHINFO07',
			['==', ['get', 'CATEGORY'], 2],
			'HRBFAC09',
			['==', ['get', 'CATEGORY'], 3],
			'ROLROL01',
			['==', ['get', 'CATEGORY'], 4],
			'SMCFAC02',
			'CHINFO07', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_HRBFAC_SYMBOL]

export default {
	symbols,
}
