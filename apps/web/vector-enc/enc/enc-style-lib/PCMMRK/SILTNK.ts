import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:125"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:SILBUI01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:SILBUI11" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TNKCON02" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TNKCON12" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS01" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS02" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS03" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TOWERS12" />
</style>
*/

const PCMMRK_SILTNK_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SILTNK_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 125],
		['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8], true, false],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'SILBUI01',
			['==', ['get', 'CATEGORY'], 2],
			'SILBUI11',
			['==', ['get', 'CATEGORY'], 3],
			'TNKCON02',
			['==', ['get', 'CATEGORY'], 4],
			'TNKCON12',
			['==', ['get', 'CATEGORY'], 5],
			'TOWERS01',
			['==', ['get', 'CATEGORY'], 6],
			'TOWERS02',
			['==', ['get', 'CATEGORY'], 7],
			'TOWERS03',
			['==', ['get', 'CATEGORY'], 8],
			'TOWERS12',
			'SILBUI01',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_SILTNK_SYMBOL]

export default {
	symbols,
}
