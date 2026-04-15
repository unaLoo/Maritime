import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<!-- BOYCAR Buoy, cardinal-->
<style type="case.int" field="2" style="key:14"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN01" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN68" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN69" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN70" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN71" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON01" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON69" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON70" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON71" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON72" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYGEN03" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL01" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL68" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL69" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL70" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL71" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH01" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH68" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH69" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH70" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH71" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR01" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR68" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR69" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR70" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR71" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP01" />
</style>

*/

const PCMMRK_BOYCAR_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYCAR_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 14],
		[
			'match',
			['get', 'CATEGORY'],
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
			true,
			false,
		],
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
			'BOYCAN68',
			['==', ['get', 'CATEGORY'], 4],
			'BOYCAN69',
			['==', ['get', 'CATEGORY'], 5],
			'BOYCAN70',
			['==', ['get', 'CATEGORY'], 6],
			'BOYCAN71',
			['==', ['get', 'CATEGORY'], 7],
			'BOYCON01',
			['==', ['get', 'CATEGORY'], 8],
			'BOYCON69',
			['==', ['get', 'CATEGORY'], 9],
			'BOYCON70',
			['==', ['get', 'CATEGORY'], 10],
			'BOYCON71',
			['==', ['get', 'CATEGORY'], 11],
			'BOYCON72',
			['==', ['get', 'CATEGORY'], 12],
			'BOYGEN03',
			['==', ['get', 'CATEGORY'], 13],
			'BOYPIL01',
			['==', ['get', 'CATEGORY'], 14],
			'BOYPIL68',
			['==', ['get', 'CATEGORY'], 15],
			'BOYPIL69',
			['==', ['get', 'CATEGORY'], 16],
			'BOYPIL70',
			['==', ['get', 'CATEGORY'], 17],
			'BOYPIL71',
			['==', ['get', 'CATEGORY'], 18],
			'BOYSPH01',
			['==', ['get', 'CATEGORY'], 19],
			'BOYSPH68',
			['==', ['get', 'CATEGORY'], 20],
			'BOYSPH69',
			['==', ['get', 'CATEGORY'], 21],
			'BOYSPH70',
			['==', ['get', 'CATEGORY'], 22],
			'BOYSPH71',
			['==', ['get', 'CATEGORY'], 23],
			'BOYSPR01',
			['==', ['get', 'CATEGORY'], 24],
			'BOYSPR68',
			['==', ['get', 'CATEGORY'], 25],
			'BOYSPR69',
			['==', ['get', 'CATEGORY'], 26],
			'BOYSPR70',
			['==', ['get', 'CATEGORY'], 27],
			'BOYSPR71',
			['==', ['get', 'CATEGORY'], 28],
			'BOYSUP01',
			'BOYBAR01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYCAR_SYMBOL]

export default {
	symbols,
}
