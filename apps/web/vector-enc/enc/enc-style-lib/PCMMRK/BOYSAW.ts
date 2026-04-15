import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:18"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYGEN03" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON78" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL01" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL73" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH01" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH65" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR01" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR01" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR65" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP01" />
</style>
*/

const PCMMRK_BOYSAW_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYSAW_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 18],
		['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true, false],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BOYGEN03',
			['==', ['get', 'CATEGORY'], 2],
			'BOYCON78',
			['==', ['get', 'CATEGORY'], 3],
			'BOYPIL01',
			['==', ['get', 'CATEGORY'], 4],
			'BOYPIL73',
			['==', ['get', 'CATEGORY'], 5],
			'BOYSPH01',
			['==', ['get', 'CATEGORY'], 6],
			'BOYSPH65',
			['==', ['get', 'CATEGORY'], 7],
			'BOYBAR01',
			['==', ['get', 'CATEGORY'], 8],
			'BOYSPR01',
			['==', ['get', 'CATEGORY'], 9],
			'BOYSPR65',
			['==', ['get', 'CATEGORY'], 10],
			'BOYSUP01',
			'BOYGEN03',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYSAW_SYMBOL]

export default {
	symbols,
}
