import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:160">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CURDEF01" />
//     <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CURENT01;rotate:[5]" />
//     <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:EBBSTR01;rotate:[5]" />
//     <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLDSTR01;rotate:[5]" />
// </style>

const PCMMRK_TS_FEB_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_TS_FEB_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 160], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'CURDEF01',
			['==', ['get', 'CATEGORY'], 2],
			'CURENT01',
			['==', ['get', 'CATEGORY'], 3],
			'EBBSTR01',
			['==', ['get', 'CATEGORY'], 4],
			'FLDSTR01',
			'CURDEF01',
		],
		'icon-rotate': [
			'case',
			['==', ['get', 'CATEGORY'], 2],
			['get', 'VAL1'],
			['==', ['get', 'CATEGORY'], 3],
			['get', 'VAL1'],
			['==', ['get', 'CATEGORY'], 4],
			['get', 'VAL1'],
			0,
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_TS_FEB_SYMBOL]

export default {
	symbols,
}
