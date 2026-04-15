import { SymbolLayerSpecification } from 'mapbox-gl'
import { SOURCE_DESC } from './_source'

const ACMMRK_RESARE_SYMBOL: SymbolLayerSpecification = {
	id: 'ACMMRK_RESARE_SYMBOL',
	type: 'symbol',
	...SOURCE_DESC,
	filter: [
		'all',
		['==', ['get', 'OBJL'], 112],
		[
			'match',
			['get', 'MarkerName2'],
			[
				'ESSARE01',
				'PSSARE01',
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
		'icon-ignore-placement': false,
		'icon-image': [
			'case',
			['==', ['get', 'MarkerName2'], 'ESSARE01'],
			'ESSARE01',
			['==', ['get', 'MarkerName2'], 'PSSARE01'],
			'PSSARE01',
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
			'ESSARE01',
		],
	},
	paint: {},
}

const symbols: SymbolLayerSpecification[] = [ACMMRK_RESARE_SYMBOL]

export default {
	symbols,
}
