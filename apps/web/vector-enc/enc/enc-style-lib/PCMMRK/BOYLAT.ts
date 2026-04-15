import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:17"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:24;scale_y:15;rect:BOYBAR01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:17;scale_y:12;rect:BOYCAN01" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN60" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN61" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN63" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN72" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN73" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN74" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN75" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN82" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYCAN83" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON01" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON60" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON61" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON62" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON64" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON65" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON66" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON67" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON68" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:16;rect:BOYCON73" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:20;scale_y:17;rect:BOYGEN03" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL01" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL60" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL61" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL66" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL67" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:18;scale_y:18;rect:BOYPIL74" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYSPH01" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYSPH62" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYSPH74" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYSPH75" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:19;scale_y:15;rect:BOYSPH78" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BOYSPR01" />
    <style type="pointx.icon" style="key:35;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BOYSPR05" />
    <style type="pointx.icon" style="key:36;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BOYSPR60" />
    <style type="pointx.icon" style="key:37;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:10;scale_y:18;rect:BOYSPR61" />
    <style type="pointx.icon" style="key:38;check_coll:0;img:(./fill_images/rastersymbols-day.png);scale_x:25;scale_y:16;rect:BOYSUP01" />
</style>

*/

// note: BOYLAT has many icons with scale_x/scale_y (not directly supported in Mapbox GL JS)

const PCMMRK_BOYLAT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BOYLAT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 17],
		[
			'match',
			['get', 'CATEGORY'],
			[
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
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
			'BOYCAN01',
			['==', ['get', 'CATEGORY'], 3],
			'BOYCAN60',
			['==', ['get', 'CATEGORY'], 4],
			'BOYCAN61',
			['==', ['get', 'CATEGORY'], 5],
			'BOYCAN63',
			['==', ['get', 'CATEGORY'], 6],
			'BOYCAN72',
			['==', ['get', 'CATEGORY'], 7],
			'BOYCAN73',
			['==', ['get', 'CATEGORY'], 8],
			'BOYCAN74',
			['==', ['get', 'CATEGORY'], 9],
			'BOYCAN75',
			['==', ['get', 'CATEGORY'], 10],
			'BOYCAN82',
			['==', ['get', 'CATEGORY'], 11],
			'BOYCAN83',
			['==', ['get', 'CATEGORY'], 12],
			'BOYCON01',
			['==', ['get', 'CATEGORY'], 13],
			'BOYCON60',
			['==', ['get', 'CATEGORY'], 14],
			'BOYCON61',
			['==', ['get', 'CATEGORY'], 15],
			'BOYCON62',
			['==', ['get', 'CATEGORY'], 16],
			'BOYCON64',
			['==', ['get', 'CATEGORY'], 17],
			'BOYCON65',
			['==', ['get', 'CATEGORY'], 18],
			'BOYCON66',
			['==', ['get', 'CATEGORY'], 19],
			'BOYCON67',
			['==', ['get', 'CATEGORY'], 20],
			'BOYCON68',
			['==', ['get', 'CATEGORY'], 21],
			'BOYCON73',
			['==', ['get', 'CATEGORY'], 22],
			'BOYGEN03',
			['==', ['get', 'CATEGORY'], 23],
			'BOYPIL01',
			['==', ['get', 'CATEGORY'], 24],
			'BOYPIL60',
			['==', ['get', 'CATEGORY'], 25],
			'BOYPIL61',
			['==', ['get', 'CATEGORY'], 26],
			'BOYPIL66',
			['==', ['get', 'CATEGORY'], 27],
			'BOYPIL67',
			['==', ['get', 'CATEGORY'], 28],
			'BOYPIL74',
			['==', ['get', 'CATEGORY'], 29],
			'BOYSPH01',
			['==', ['get', 'CATEGORY'], 30],
			'BOYSPH62',
			['==', ['get', 'CATEGORY'], 31],
			'BOYSPH74',
			['==', ['get', 'CATEGORY'], 32],
			'BOYSPH75',
			['==', ['get', 'CATEGORY'], 33],
			'BOYSPH78',
			['==', ['get', 'CATEGORY'], 34],
			'BOYSPR01',
			['==', ['get', 'CATEGORY'], 35],
			'BOYSPR05',
			['==', ['get', 'CATEGORY'], 36],
			'BOYSPR60',
			['==', ['get', 'CATEGORY'], 37],
			'BOYSPR61',
			['==', ['get', 'CATEGORY'], 38],
			'BOYSUP01',
			'BOYBAR01',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BOYLAT_SYMBOL]

export default {
	symbols,
}
