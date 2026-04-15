import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<!-- UWTROC Underwater rock / awash rock-->
<style type="case.int" field="2" style="key:153"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER51" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:DANGER52" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:LNDARE01" />
    <style type="pointx.icon" style="key:4;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:ISODGR51" />
    <style type="pointx.icon" style="key:5;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:UWTROC03" />
    <style type="pointx.icon" style="key:6;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:UWTROC04" />
</style>
*/

const PCMMRK_UWTROC_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_UWTROC_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 153], ['match', ['get', 'CATEGORY'], [1, 2, 3, 4, 5, 6], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'DANGER51',
			['==', ['get', 'CATEGORY'], 2],
			'DANGER52',
			['==', ['get', 'CATEGORY'], 3],
			'LNDARE01',
			['==', ['get', 'CATEGORY'], 4],
			'ISODGR51',
			['==', ['get', 'CATEGORY'], 5],
			'UWTROC03',
			['==', ['get', 'CATEGORY'], 6],
			'UWTROC04',
			'DANGER51',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_UWTROC_SYMBOL]

export default {
	symbols,
}
