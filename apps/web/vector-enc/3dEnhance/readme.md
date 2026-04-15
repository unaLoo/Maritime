# 3d enhance 集成方式

## 地形

```ts
const terrainLayer = new TerrainLayer({
    maskURL: staticServer + '/mask/ciatoo.geojson',
    terrainTileURL: 'https://localhost:3000/terrain/1.mbtiles/{z}/{x}/{y}.png',
    exaggeration: 5,
    withContour: true,
    withLighting: true,
    interval: 5,
    elevationRange: [-300, 2],
    shallowColor: [34, 76, 80],
    deepColor: [255, 255, 255],
})

map.addLayer(terrainLayer);
```

## 模型、箭头、光墙
```ts
import { addGLTF } from './3d/addGLTF'
import { addWater } from './3d/addWater'
import { addBreathWall } from './3d/addBreathWall'
import { addDynamicDirection } from './3d/addDynamicDirection'
import { ThreeMapLayer } from './3d/ThreeMapLayer'

// 先加 three-scene-layer， 内部包含一个代理图层。
const threeLayer = new ThreeMapLayer()
map.addLayer(threeLayer)
const anchor = [-122.40740, 47.34618] as [number, number]
threeLayer.setAnchor(anchor) // 设置场景锚点，用于局部坐标防抖

// 加模型
addGLTF(threeLayer, 'id', url, [-122.45651, 47.32482], 0) // 以经纬度为输入，内部进行局部坐标转换

// 加箭头
// NLine 为 GeoJSON 对象，要求线要素输入
addDynamicDirection(threeLayer, {
    id: 'corridor-2',
    lineString: NLine.features[0],
    textureUrl: 'https://localhost:3000/static/arr.png',
    direction: 1, // 1 / -1 调节方向
    speed: 0.5,
    color: '#88e7ff',
    width: 300,      // 航道宽度（米）
    arrowSize: 0.5,
    repeat: 50.0,
    opacity: 1.0
})

// 加光墙
// PRCarea 为 GeoJSON 对象，要求面要素输入，线也行。
addBreathWall(threeLayer, {
    id: 'security-zone',
    geojson: PRCarea.features[0],
    height: 200,           // 光墙高度（米）
    color: '#ffd392',      // RGB 颜色 (红色)
    minAlpha: 0.2,         // 呼吸周期最小透明度
    maxAlpha: 0.8,         // 呼吸周期最大透明度
    breathingFreq: 0.4,    // 频率 (Hz)
})

```