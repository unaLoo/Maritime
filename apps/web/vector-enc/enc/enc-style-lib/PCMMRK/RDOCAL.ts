import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// <style type="case.int" field="2" style="key:104;">
//     <style type="pointx.icon" style="key:1;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RCLDEF01;rotate:[5]" />
//     <style type="pointx.icon" style="key:2;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RDOCAL02;rotate:[5]" />
//     <style type="pointx.icon" style="key:3;check_coll:0;img:(./fill_images/rastersymbols-day.png);rect:RDOCAL03;rotate:[5]" />
// </style>

const PCMMRK_RDOCAL_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_RDOCAL_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['all', ['==', ['get', 'OBJL'], 104], ['match', ['get', 'CATEGORY'], [1, 2, 3], true, false]],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			'RCLDEF01',
			['==', ['get', 'CATEGORY'], 2],
			'RDOCAL02',
			['==', ['get', 'CATEGORY'], 3],
			'RDOCAL03',
			'RCLDEF01',
		],
		'icon-rotate': [
			'case',
			['==', ['get', 'CATEGORY'], 1],
			['get', 'VAL1'],
			['==', ['get', 'CATEGORY'], 2],
			['get', 'VAL1'],
			['==', ['get', 'CATEGORY'], 3],
			['get', 'VAL1'],
			0,
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [PCMMRK_RDOCAL_SYMBOL]

export default {
	symbols,
}
