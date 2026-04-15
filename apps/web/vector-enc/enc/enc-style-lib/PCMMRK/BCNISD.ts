import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<!-- BCNISD Beacon, isolated danger-->
<style type="case.int" field="2" style="key:6"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN03" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN76" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLTC01" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK02" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW76" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW01" />
</style>
*/

const PCMMRK_BCNISD_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BCNISD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 6], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BCNGEN01',
			['==', ['get', 'CATEGORY'], 2],
			'BCNGEN03',
			['==', ['get', 'CATEGORY'], 3],
			'BCNGEN76',
			['==', ['get', 'CATEGORY'], 4],
			'BCNLTC01',
			['==', ['get', 'CATEGORY'], 5],
			'BCNSTK02',
			['==', ['get', 'CATEGORY'], 6],
			'BCNTOW76',
			['==', ['get', 'CATEGORY'], 7],
			'BCNTOW01',
			'BCNGEN01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BCNISD_SYMBOL]

export default {
	symbols,
}
