import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:76;">  
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITFLT01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITFLT10" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LITFLT61" />
</style>
*/

const PCMMRK_LITFLT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_LITFLT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 76], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'LITFLT01',
			['==', ['get', 'CATEGORY'], 2],
			'LITFLT10',
			['==', ['get', 'CATEGORY'], 3],
			'LITFLT61',
			'LITFLT01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_LITFLT_SYMBOL]

export default {
	symbols,
}
