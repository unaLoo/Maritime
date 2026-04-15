import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:19"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR60" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR61" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYBAR62" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN60" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN61" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN62" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN63" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN64" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN65" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN75" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN77" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN78" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN79" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN80" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCAN81" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON01" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON60" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON62" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON65" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON73" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON77" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON80" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON81" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYGEN03" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYMOR03" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYMOR31" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL01" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL59" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL60" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL61" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL62" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL73" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL74" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL78" />
    <style type="pointx.icon" style="key:36;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYPIL81" />
    <style type="pointx.icon" style="key:37;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH01" />
    <style type="pointx.icon" style="key:38;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH05" />
    <style type="pointx.icon" style="key:39;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH60" />
    <style type="pointx.icon" style="key:40;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH62" />
    <style type="pointx.icon" style="key:41;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH66" />
    <style type="pointx.icon" style="key:42;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPH77" />
    <style type="pointx.icon" style="key:43;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR01" />
    <style type="pointx.icon" style="key:44;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSPR62" />
    <style type="pointx.icon" style="key:45;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP01" />
    <style type="pointx.icon" style="key:46;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP03" />
    <style type="pointx.icon" style="key:47;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP62" />
    <style type="pointx.icon" style="key:48;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP65" />
    <style type="pointx.icon" style="key:49;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYSUP66" />
</style>

*/

const PCMMRK_BOYSPP_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYSPP_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	// filter: ['==', ['get', 'OBJL'], 19],
	filter: [
		'all',
		['==', ['get', 'OBJL'], 19],
		[
			'match',
			['get', 'CATEGORY'],
			[
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
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
			'BOYBAR01',
			['==', ['get', 'CATEGORY'], 2],
			'BOYBAR60',
			['==', ['get', 'CATEGORY'], 3],
			'BOYBAR61',
			['==', ['get', 'CATEGORY'], 4],
			'BOYBAR62',
			['==', ['get', 'CATEGORY'], 5],
			'BOYCAN60',
			['==', ['get', 'CATEGORY'], 6],
			'BOYCAN61',
			['==', ['get', 'CATEGORY'], 7],
			'BOYCAN62',
			['==', ['get', 'CATEGORY'], 8],
			'BOYCAN63',
			['==', ['get', 'CATEGORY'], 9],
			'BOYCAN64',
			['==', ['get', 'CATEGORY'], 10],
			'BOYCAN65',
			['==', ['get', 'CATEGORY'], 11],
			'BOYCAN75',
			['==', ['get', 'CATEGORY'], 12],
			'BOYCAN77',
			['==', ['get', 'CATEGORY'], 13],
			'BOYCAN78',
			['==', ['get', 'CATEGORY'], 14],
			'BOYCAN79',
			['==', ['get', 'CATEGORY'], 15],
			'BOYCAN80',
			['==', ['get', 'CATEGORY'], 16],
			'BOYCAN81',
			['==', ['get', 'CATEGORY'], 17],
			'BOYCON01',
			['==', ['get', 'CATEGORY'], 18],
			'BOYCON60',
			['==', ['get', 'CATEGORY'], 19],
			'BOYCON62',
			['==', ['get', 'CATEGORY'], 20],
			'BOYCON65',
			['==', ['get', 'CATEGORY'], 21],
			'BOYCON73',
			['==', ['get', 'CATEGORY'], 22],
			'BOYCON77',
			['==', ['get', 'CATEGORY'], 23],
			'BOYCON80',
			['==', ['get', 'CATEGORY'], 24],
			'BOYCON81',
			['==', ['get', 'CATEGORY'], 25],
			'BOYGEN03',
			['==', ['get', 'CATEGORY'], 26],
			'BOYMOR03',
			['==', ['get', 'CATEGORY'], 27],
			'BOYMOR31',
			['==', ['get', 'CATEGORY'], 28],
			'BOYPIL01',
			['==', ['get', 'CATEGORY'], 29],
			'BOYPIL59',
			['==', ['get', 'CATEGORY'], 30],
			'BOYPIL60',
			['==', ['get', 'CATEGORY'], 31],
			'BOYPIL61',
			['==', ['get', 'CATEGORY'], 32],
			'BOYPIL62',
			['==', ['get', 'CATEGORY'], 33],
			'BOYPIL73',
			['==', ['get', 'CATEGORY'], 34],
			'BOYPIL74',
			['==', ['get', 'CATEGORY'], 35],
			'BOYPIL78',
			['==', ['get', 'CATEGORY'], 36],
			'BOYPIL81',
			['==', ['get', 'CATEGORY'], 37],
			'BOYSPH01',
			['==', ['get', 'CATEGORY'], 38],
			'BOYSPH05',
			['==', ['get', 'CATEGORY'], 39],
			'BOYSPH60',
			['==', ['get', 'CATEGORY'], 40],
			'BOYSPH62',
			['==', ['get', 'CATEGORY'], 41],
			'BOYSPH66',
			['==', ['get', 'CATEGORY'], 42],
			'BOYSPH77',
			['==', ['get', 'CATEGORY'], 43],
			'BOYSPR01',
			['==', ['get', 'CATEGORY'], 44],
			'BOYSPR62',
			['==', ['get', 'CATEGORY'], 45],
			'BOYSUP01',
			['==', ['get', 'CATEGORY'], 46],
			'BOYSUP03',
			['==', ['get', 'CATEGORY'], 47],
			'BOYSUP62',
			['==', ['get', 'CATEGORY'], 48],
			'BOYSUP65',
			['==', ['get', 'CATEGORY'], 49],
			'BOYSUP66',
			'BOYBAR01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYSPP_SYMBOL]

export default {
	symbols,
}
