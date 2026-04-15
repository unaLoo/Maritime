import { FillLayerSpecification, SymbolLayerSpecification, LineLayerSpecification } from 'mapbox-gl'
import ColorTable, { ColorTableType } from '../ColorTable'
import { createBUISGLLayers } from './BUISGL'

export function createCOMARELayers(colors: ColorTableType) {
	const buisgl = createBUISGLLayers(colors)

	return {
		fills: [...buisgl.fills] as FillLayerSpecification[],
		lines: [...buisgl.lines] as LineLayerSpecification[],
		symbols: [...buisgl.symbols] as SymbolLayerSpecification[],
	}
}

export default createCOMARELayers(ColorTable)
