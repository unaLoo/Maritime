import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createUNSARELayers(colors: ColorTableType) {
	const UNSARE_FILL_0: FillLayerSpecification = {
		id: 'COMARE_UNSARE_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 154],
		paint: {
			'fill-color': colors.RES01,
		},
	}
	const UNSARE_LINE_0: LineLayerSpecification = {
		id: 'COMARE_UNSARE_LINE_0',
		type: 'line',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 154],
		layout: {
			'line-cap': 'round',
			'line-join': 'round',
		},
		paint: {
			'line-width': 2,
			'line-color': colors.CHGRD,
		},
	}

	return {
		fills: [UNSARE_FILL_0] as FillLayerSpecification[],
		lines: [UNSARE_LINE_0] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createUNSARELayers(ColorTable)
