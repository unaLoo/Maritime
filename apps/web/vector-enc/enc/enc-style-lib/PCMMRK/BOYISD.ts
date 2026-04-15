import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:16"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN01" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN76" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON01" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON63" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON77" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYGEN03" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL01" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL72" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH01" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR01" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR72" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP01" />
</style>
*/
const PCMMRK_BOYISD_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYISD_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 16],
		['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true, false],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BOYBAR01',
			['==', ['get', 'CATEGORY'], 2],
			'BOYCAN01',
			['==', ['get', 'CATEGORY'], 3],
			'BOYCAN76',
			['==', ['get', 'CATEGORY'], 4],
			'BOYCON01',
			['==', ['get', 'CATEGORY'], 5],
			'BOYCON63',
			['==', ['get', 'CATEGORY'], 6],
			'BOYCON77',
			['==', ['get', 'CATEGORY'], 7],
			'BOYGEN03',
			['==', ['get', 'CATEGORY'], 8],
			'BOYPIL01',
			['==', ['get', 'CATEGORY'], 9],
			'BOYPIL72',
			['==', ['get', 'CATEGORY'], 10],
			'BOYSPH01',
			['==', ['get', 'CATEGORY'], 11],
			'BOYSPR01',
			['==', ['get', 'CATEGORY'], 12],
			'BOYSPR72',
			['==', ['get', 'CATEGORY'], 13],
			'BOYSUP01',
			'BOYBAR01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYISD_SYMBOL]

export default {
	symbols,
}
