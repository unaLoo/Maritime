import { mat4 } from 'gl-matrix'
import RunTime from '../Runtime'

export type TransformInfoType = {
	viewProjectionMatrix: mat4
	worldSize: number
	tileLogicExtent: number
	tileLogicPixels: number
	zoom: number
}

export default interface CustomLayerInterface {
	id: string
	onAdd: (rt: RunTime, gl: WebGL2RenderingContext) => void
	onRemove: () => void
	render: (viewProjectionMatrix: mat4, transformInfo: TransformInfoType) => void
}

