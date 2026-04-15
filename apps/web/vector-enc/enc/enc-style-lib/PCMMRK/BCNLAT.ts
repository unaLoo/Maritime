import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:7"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNDEF13" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLAT15" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLAT16" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLAT21" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLAT22" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLAT23" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSPP21" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK02" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CAIRNS01" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN01" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN60" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN61" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLTC01" />
    <style type="pointx.icon" style="key:14;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK60" />
    <style type="pointx.icon" style="key:15;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK61" />
    <style type="pointx.icon" style="key:16;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK77" />
    <style type="pointx.icon" style="key:17;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK78" />
    <style type="pointx.icon" style="key:18;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK81" />
    <style type="pointx.icon" style="key:19;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK82" />
    <style type="pointx.icon" style="key:20;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK83" />
    <style type="pointx.icon" style="key:21;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW01" />
    <style type="pointx.icon" style="key:22;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW05" />
    <style type="pointx.icon" style="key:23;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW60" />
    <style type="pointx.icon" style="key:24;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW61" />
    <style type="pointx.icon" style="key:25;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW63" />
    <style type="pointx.icon" style="key:26;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW64" />
    <style type="pointx.icon" style="key:27;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW65" />
    <style type="pointx.icon" style="key:28;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW66" />
    <style type="pointx.icon" style="key:29;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW74" />
    <style type="pointx.icon" style="key:30;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON68" />
    <style type="pointx.icon" style="key:31;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYCON79" />
    <style type="pointx.icon" style="key:32;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CAIRNS11" />
    <style type="pointx.icon" style="key:33;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:PRICKE03" />
    <style type="pointx.icon" style="key:34;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:PRICKE04" />
</style>
*/

const PCMMRK_BCNLAT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BCNLAT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 7],
		[
			'match',
			['get', 'CATEGORY'],
			[
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
				29, 30, 31, 32, 33, 34,
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
			'BCNDEF13',
			['==', ['get', 'CATEGORY'], 2],
			'BCNLAT15',
			['==', ['get', 'CATEGORY'], 3],
			'BCNLAT16',
			['==', ['get', 'CATEGORY'], 4],
			'BCNLAT21',
			['==', ['get', 'CATEGORY'], 5],
			'BCNLAT22',
			['==', ['get', 'CATEGORY'], 6],
			'BCNLAT23',
			['==', ['get', 'CATEGORY'], 7],
			'BCNSPP21',
			['==', ['get', 'CATEGORY'], 8],
			'BCNSTK02',
			['==', ['get', 'CATEGORY'], 9],
			'CAIRNS01',
			['==', ['get', 'CATEGORY'], 10],
			'BCNGEN01',
			['==', ['get', 'CATEGORY'], 11],
			'BCNGEN60',
			['==', ['get', 'CATEGORY'], 12],
			'BCNGEN61',
			['==', ['get', 'CATEGORY'], 13],
			'BCNLTC01',
			['==', ['get', 'CATEGORY'], 14],
			'BCNSTK60',
			['==', ['get', 'CATEGORY'], 15],
			'BCNSTK61',
			['==', ['get', 'CATEGORY'], 16],
			'BCNSTK77',
			['==', ['get', 'CATEGORY'], 17],
			'BCNSTK78',
			['==', ['get', 'CATEGORY'], 18],
			'BCNSTK81',
			['==', ['get', 'CATEGORY'], 19],
			'BCNSTK82',
			['==', ['get', 'CATEGORY'], 20],
			'BCNSTK83',
			['==', ['get', 'CATEGORY'], 21],
			'BCNTOW01',
			['==', ['get', 'CATEGORY'], 22],
			'BCNTOW05',
			['==', ['get', 'CATEGORY'], 23],
			'BCNTOW60',
			['==', ['get', 'CATEGORY'], 24],
			'BCNTOW61',
			['==', ['get', 'CATEGORY'], 25],
			'BCNTOW63',
			['==', ['get', 'CATEGORY'], 26],
			'BCNTOW64',
			['==', ['get', 'CATEGORY'], 27],
			'BCNTOW65',
			['==', ['get', 'CATEGORY'], 28],
			'BCNTOW66',
			['==', ['get', 'CATEGORY'], 29],
			'BCNTOW74',
			['==', ['get', 'CATEGORY'], 30],
			'BOYCON68',
			['==', ['get', 'CATEGORY'], 31],
			'BOYCON79',
			['==', ['get', 'CATEGORY'], 32],
			'CAIRNS11',
			['==', ['get', 'CATEGORY'], 33],
			'PRICKE03',
			['==', ['get', 'CATEGORY'], 34],
			'PRICKE04',
			'BCNDEF13',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BCNLAT_SYMBOL]

export default {
	symbols,
}
