import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

/*
<style type="case.int" field="2" style="key:28"> 
    <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:BORDER01" />
    <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:CUSTOM01" />
    <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:POSGEN04" />
</style>
*/

const PCMMRK_CHKPNT_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_CHKPNT_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 28], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'BORDER01',
			['==', ['get', 'CATEGORY'], 2],
			'CUSTOM01',
			['==', ['get', 'CATEGORY'], 3],
			'POSGEN04',
			'BORDER01', // nothing matched use a default
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_CHKPNT_SYMBOL]

export default {
	symbols,
}
