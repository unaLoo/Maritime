import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:84"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYMOR01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYMOR03" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BOYMOR11" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MORFAC03" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:MORFAC04" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:PILPNT02" />
</style>
*/

const PCMMRK_MORFAC_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_MORFAC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	minzoom: 11,
	filter: ['all', ['==', ['get', 'OBJL'], 84], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BOYMOR01',
			['==', ['get', 'CATEGORY'], 2],
			'BOYMOR03',
			['==', ['get', 'CATEGORY'], 3],
			'BOYMOR11',
			['==', ['get', 'CATEGORY'], 4],
			'MORFAC03',
			['==', ['get', 'CATEGORY'], 5],
			'MORFAC04',
			['==', ['get', 'CATEGORY'], 6],
			'PILPNT02',
			'BOYMOR01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_MORFAC_SYMBOL]

export default {
	symbols,
}
