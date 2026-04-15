import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<!-- BUISGL Building, single-->
<style type="case.int" field="2" style="key:12"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL04" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL05" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL13" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL14" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUIREL15" />
    <style type="pointx.icon" style="key:7;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUISGL01" />
    <style type="pointx.icon" style="key:8;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BUISGL11" />
    <style type="pointx.icon" style="key:9;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:POSGEN03" />
    <style type="pointx.icon" style="key:10;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TNKCON02" />
    <style type="pointx.icon" style="key:11;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:TNKCON12" />
</style>
*/

const PCMMRK_BUISGL_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_BUISGL_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 12],
		['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], true, false],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BUIREL01',
			['==', ['get', 'CATEGORY'], 2],
			'BUIREL04',
			['==', ['get', 'CATEGORY'], 3],
			'BUIREL05',
			['==', ['get', 'CATEGORY'], 4],
			'BUIREL13',
			['==', ['get', 'CATEGORY'], 5],
			'BUIREL14',
			['==', ['get', 'CATEGORY'], 6],
			'BUIREL15',
			['==', ['get', 'CATEGORY'], 7],
			'BUISGL01',
			['==', ['get', 'CATEGORY'], 8],
			'BUISGL11',
			['==', ['get', 'CATEGORY'], 9],
			'POSGEN03',
			['==', ['get', 'CATEGORY'], 10],
			'TNKCON02',
			['==', ['get', 'CATEGORY'], 11],
			'TNKCON12',
			'BUIREL01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_BUISGL_SYMBOL]

export default {
	symbols,
}
