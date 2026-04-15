import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'

export function createSNDWAVLayers(colors: ColorTableType) {
	const COMARE_SADWAV_FILL_0: FillLayerSpecification = {
		id: 'COMARE_SADWAV_FILL_0',
		type: 'fill',
		source: 'AREA_COMMON_AREA',
		'source-layer': 'area_common_polygon',
		filter: ['==', ['get', 'OBJL'], 118],
		paint: {
			'fill-pattern': 'SNDWAV01',
		},
	}

	return {
		fills: [COMARE_SADWAV_FILL_0] as FillLayerSpecification[],
		lines: [] as LineLayerSpecification[],
		symbols: [] as SymbolLayerSpecification[],
	}
}

export default createSNDWAVLayers(ColorTable)
