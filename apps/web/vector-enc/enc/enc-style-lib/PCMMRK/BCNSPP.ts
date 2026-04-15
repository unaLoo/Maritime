import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<!-- BCNSPP Beacon, special purpose/general-->
<style type="case.int" field="2" style="key:9"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN05" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN60" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN61" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN79" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNGEN80" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNLTC01" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNSPR62" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK02" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK05" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK08" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK60" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK61" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:8;scale_y:16;rect:BCNSTK62" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNSTK78" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNSTK79" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNSTK80" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BCNSTK81" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW01" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW05" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW60" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW61" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW62" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW65" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW85" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW86" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW87" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW88" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW89" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW90" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:18;rect:BCNTOW91" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:17;rect:CAIRNS01" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:15;scale_y:15;rect:CAIRNS11" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:12;scale_y:18;rect:NOTBRD11" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:12;scale_y:18;rect:NOTBRD12" />
</style>
*/

// note: BCNSPP has many icons with scale_x/scale_y (not directly supported in Mapbox GL JS)

const PCMMRK_BCNSPP_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BCNSPP_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 9],
		[
			'match',
			['get', 'CATEGORY'],
			[
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31, 32, 33, 34, 35,
			],
			true,
			false,
		],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BCNGEN01',
			['==', ['get', 'CATEGORY'], 2],
			'BCNGEN05',
			['==', ['get', 'CATEGORY'], 3],
			'BCNGEN60',
			['==', ['get', 'CATEGORY'], 4],
			'BCNGEN61',
			['==', ['get', 'CATEGORY'], 5],
			'BCNGEN79',
			['==', ['get', 'CATEGORY'], 6],
			'BCNGEN80',
			['==', ['get', 'CATEGORY'], 7],
			'BCNLTC01',
			['==', ['get', 'CATEGORY'], 8],
			'BCNSPR62',
			['==', ['get', 'CATEGORY'], 9],
			'BCNSTK02',
			['==', ['get', 'CATEGORY'], 10],
			'BCNSTK05',
			['==', ['get', 'CATEGORY'], 11],
			'BCNSTK08',
			['==', ['get', 'CATEGORY'], 12],
			'BCNSTK60',
			['==', ['get', 'CATEGORY'], 13],
			'BCNSTK61',
			['==', ['get', 'CATEGORY'], 14],
			'BCNSTK62',
			['==', ['get', 'CATEGORY'], 15],
			'BCNSTK78',
			['==', ['get', 'CATEGORY'], 16],
			'BCNSTK79',
			['==', ['get', 'CATEGORY'], 17],
			'BCNSTK80',
			['==', ['get', 'CATEGORY'], 18],
			'BCNSTK81',
			['==', ['get', 'CATEGORY'], 19],
			'BCNTOW01',
			['==', ['get', 'CATEGORY'], 20],
			'BCNTOW05',
			['==', ['get', 'CATEGORY'], 21],
			'BCNTOW60',
			['==', ['get', 'CATEGORY'], 22],
			'BCNTOW61',
			['==', ['get', 'CATEGORY'], 23],
			'BCNTOW62',
			['==', ['get', 'CATEGORY'], 24],
			'BCNTOW65',
			['==', ['get', 'CATEGORY'], 25],
			'BCNTOW85',
			['==', ['get', 'CATEGORY'], 26],
			'BCNTOW86',
			['==', ['get', 'CATEGORY'], 27],
			'BCNTOW87',
			['==', ['get', 'CATEGORY'], 28],
			'BCNTOW88',
			['==', ['get', 'CATEGORY'], 29],
			'BCNTOW89',
			['==', ['get', 'CATEGORY'], 30],
			'BCNTOW90',
			['==', ['get', 'CATEGORY'], 31],
			'BCNTOW91',
			['==', ['get', 'CATEGORY'], 32],
			'CAIRNS01',
			['==', ['get', 'CATEGORY'], 33],
			'CAIRNS11',
			['==', ['get', 'CATEGORY'], 34],
			'NOTBRD11',
			['==', ['get', 'CATEGORY'], 35],
			'NOTBRD12',
			'BCNSTK05',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BCNSPP_SYMBOL]

export default {
	symbols,
}
