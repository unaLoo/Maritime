import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
    <style type="case.int" field="2" style="key:44"> 
        <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:HECMTR01" />
        <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:HECMTR02" />
    </style>
*/

const PCMMRK_DISMAR_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_DISMAR_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 44], ['match', ['get', 'CATEGORY'], [1, 2], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'HECMTR01',
			['==', ['get', 'CATEGORY'], 2],
			'HECMTR02',
			'HECMTR01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_DISMAR_SYMBOL]

export default {
	symbols,
}
