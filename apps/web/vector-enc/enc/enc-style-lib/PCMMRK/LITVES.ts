import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:77;">  
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITVES01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITVES60" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITVES61" />
</style>
*/

const PCMMRK_LITVES_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LITVES_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 77], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'LITVES01',
			['==', ['get', 'CATEGORY'], 2],
			'LITVES60',
			['==', ['get', 'CATEGORY'], 3],
			'LITVES61',
			'LITVES01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LITVES_SYMBOL]

export default {
	symbols,
}
