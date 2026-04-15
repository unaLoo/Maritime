import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_CBLARE_SYMBOL_0: SymbolLayerSpecification = {
	id: 'ACMMRK_CBLARE_SYMBOL_0',
	type: 'symbol',
	...SOURCE_DESC,
	filter: ['==', ['get', 'OBJL'], 20],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': 'CBLARE51',
		'icon-offset': [-100, -10],
	},
	paint: {},
}

const ACMMRK_CBLARE_SYMBOL_1: SymbolLayerSpecification = {
	id: 'ACMMRK_CBLARE_SYMBOL_1',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 20],
		[
			'match',
			['get', 'MarkerName2'],
			[
				'ENTRES61',
				'ENTRES71',
				'ENTRES51',
				'ACHRES61',
				'ACHRES71',
				'ACHRES51',
				'FSHRES71',
				'FSHRES51',
				'INFARE51',
				'RSRDEF51',
			],
			true,
			false,
		],
	],
	layout: {
		'icon-allow-overlap': true,
		'icon-image': [
			'case',
			['==', ['get', 'MarkerName2'], 'ENTRES61'],
			'ENTRES61',
			['==', ['get', 'MarkerName2'], 'ENTRES71'],
			'ENTRES71',
			['==', ['get', 'MarkerName2'], 'ENTRES51'],
			'ENTRES51',
			['==', ['get', 'MarkerName2'], 'ACHRES61'],
			'ACHRES61',
			['==', ['get', 'MarkerName2'], 'ACHRES71'],
			'ACHRES71',
			['==', ['get', 'MarkerName2'], 'ACHRES51'],
			'ACHRES51',
			['==', ['get', 'MarkerName2'], 'FSHRES71'],
			'FSHRES71',
			['==', ['get', 'MarkerName2'], 'FSHRES51'],
			'FSHRES51',
			['==', ['get', 'MarkerName2'], 'INFARE51'],
			'INFARE51',
			['==', ['get', 'MarkerName2'], 'RSRDEF51'],
			'RSRDEF51',
			'ENTRES61',
		],
		'icon-offset': [
			'case',
			['==', ['get', 'MarkerName2'], 'ENTRES61'],
			[-25, 10],
			['==', ['get', 'MarkerName2'], 'ENTRES71'],
			[-26, 19],
			['==', ['get', 'MarkerName2'], 'ENTRES51'],
			[-19, 19],
			['==', ['get', 'MarkerName2'], 'ACHRES61'],
			[-32, 28],
			['==', ['get', 'MarkerName2'], 'ACHRES71'],
			[-33, 28],
			['==', ['get', 'MarkerName2'], 'ACHRES51'],
			[-26, 28],
			['==', ['get', 'MarkerName2'], 'FSHRES71'],
			[-28, 9],
			['==', ['get', 'MarkerName2'], 'FSHRES51'],
			[-20, 9],
			['==', ['get', 'MarkerName2'], 'INFARE51'],
			[-14, 14],
			['==', ['get', 'MarkerName2'], 'RSRDEF51'],
			[-19, 19],
			[0, 0],
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_CBLARE_SYMBOL_0, ACMMRK_CBLARE_SYMBOL_1]

export default {
	symbols,
}
