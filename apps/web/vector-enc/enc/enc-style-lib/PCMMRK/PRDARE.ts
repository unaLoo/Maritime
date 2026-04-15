import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:97;">  
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:FLASTK11" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TNKCON12" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:WIMCON11" />
</style>
*/

const PCMMRK_PRDARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_PRDARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 97], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'FLASTK11',
			['==', ['get', 'CATEGORY'], 2],
			'TNKCON12',
			['==', ['get', 'CATEGORY'], 3],
			'WIMCON11',
			'FLASTK11', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_PRDARE_SYMBOL]

export default {
	symbols,
}
