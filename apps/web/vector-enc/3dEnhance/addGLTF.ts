import * as THREE from 'three'
import { ThreeMapLayer } from './ThreeMapLayer'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

const addGLTF = (
    threeLayer: ThreeMapLayer,
    id: string,
    url: string,
    lnglat: [number, number],
    altitude: number = 0,
): Promise<THREE.Object3D> => {
    return new Promise((resolve) => {
        const loader = new GLTFLoader()

        loader.load(url, (gltf: GLTF) => {
            const posRelativeToAnchor = threeLayer.projectToScene(lnglat, altitude)
            const model = gltf.scene
            // console.log(dumpObject(model).join('\n'))
            model.position.copy(posRelativeToAnchor)
            model.scale.set(50, 50, 50)

            threeLayer.addToScene(id, model)
            resolve(model)
        })
    })
}

export { addGLTF }
