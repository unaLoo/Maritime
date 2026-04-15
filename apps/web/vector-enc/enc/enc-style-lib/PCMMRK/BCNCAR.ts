import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:5"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN03" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN68" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN69" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN70" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNGEN71" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNLTC01" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNSTK02" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW01" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW68" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW69" />
    <style type="pointx.icon" style="key:12;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW70" />
    <style type="pointx.icon" style="key:13;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BCNTOW71" />
</style>
*/

const PCMMRK_BCNCAR_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BCNCAR_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 5],
		['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true, false],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BCNGEN01',
			['==', ['get', 'CATEGORY'], 2],
			'BCNGEN03',
			['==', ['get', 'CATEGORY'], 3],
			'BCNGEN68',
			['==', ['get', 'CATEGORY'], 4],
			'BCNGEN69',
			['==', ['get', 'CATEGORY'], 5],
			'BCNGEN70',
			['==', ['get', 'CATEGORY'], 6],
			'BCNGEN71',
			['==', ['get', 'CATEGORY'], 7],
			'BCNLTC01',
			['==', ['get', 'CATEGORY'], 8],
			'BCNSTK02',
			['==', ['get', 'CATEGORY'], 9],
			'BCNTOW01',
			['==', ['get', 'CATEGORY'], 10],
			'BCNTOW68',
			['==', ['get', 'CATEGORY'], 11],
			'BCNTOW69',
			['==', ['get', 'CATEGORY'], 12],
			'BCNTOW70',
			['==', ['get', 'CATEGORY'], 13],
			'BCNTOW71',
			'BCNGEN01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BCNCAR_SYMBOL]

export default {
	symbols,
}
