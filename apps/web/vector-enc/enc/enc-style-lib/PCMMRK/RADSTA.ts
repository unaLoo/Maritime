import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:102;">  
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:POSGEN01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RDOSTA02" />
</style>
*/

const PCMMRK_RADSTA_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RADSTA_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 102], ['match', ['get', 'CATEGORY'], [1, 2], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'POSGEN01',
			['==', ['get', 'CATEGORY'], 2],
			'RDOSTA02',
			'POSGEN01',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RADSTA_SYMBOL]

export default {
	symbols,
}
