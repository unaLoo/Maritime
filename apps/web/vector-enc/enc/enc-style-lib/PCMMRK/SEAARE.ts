import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

// note:
// <style type="latex.point" style="key:119;text:3;type:-1;unicode:false;-1:rank(3),color(0xff1E1E1E),size(30),position(1)" />

const PCMMRK_SEAARE_SYMBOL: SymbolLayerSpecification = {
	id: 'PCMMRK_SEAARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 119],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'TOPSHQ25',
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [
	// PCMMRK_SEAARE_SYMBOL
]

export default {
	symbols,
}
