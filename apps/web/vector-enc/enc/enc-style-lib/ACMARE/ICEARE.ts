import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createICEARELayers(colors: ColorTableType) {
	const COMARE_ICEARE_FILL_0: FillLayerSpecification = {
		id: 'COMARE_ICEARE_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 66],
		paint: {
			'fill-color': colors.NODTA,
		},
	}
	const COMARE_ICEARE_FILL_1: FillLayerSpecification = {
		id: 'COMARE_ICEARE_FILL_1',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 66],
		paint: {
			'fill-pattern': 'ICEARE04',
			'fill-opacity': 1,
		},
	}

	return {
		fills: [COMARE_ICEARE_FILL_0, COMARE_ICEARE_FILL_1] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createICEARELayers(ColorTable)
