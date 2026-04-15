import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:15"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR62" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYINB01" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP62" />
</style>
*/

const PCMMRK_BOYINB_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYINB_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 15], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BOYBAR62',
			['==', ['get', 'CATEGORY'], 2],
			'BOYINB01',
			['==', ['get', 'CATEGORY'], 3],
			'BOYSUP62',
			'BOYBAR62', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYINB_SYMBOL]

export default {
	symbols,
}
