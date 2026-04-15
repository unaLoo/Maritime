import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:36"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CURENT01;rotate:[5]" />
</style>	
*/

const PCMMRK_CURENT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CURENT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 36], ['==', ['get', 'CATEGORY'], 1]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CURENT01',
		'icon-rotate': ['get', 'VAL1'],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CURENT_SYMBOL]

export default {
	symbols,
}
