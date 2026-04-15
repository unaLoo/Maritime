# hydro field 集成方式

```ts
import {
  Runtime,
  TemporalScalarFieldLayer,
  TemporalVectorFieldLayer,
} from './hydroField';

const runtime = new Runtime(map);

function mountTemporalScalarFieldLayerTest(runtime: Runtime,sourceBaseUrl: string):void{
  const sourceId = 'runtime-temporal-scalar-source';
  runtime.tileManager.addSource({
    id: sourceId,
    type: 'temporal_scalar',
    url: `${sourceBaseUrl}/{z}/{x}/{y}.bin`,
    minzoom: 1,
    maxzoom: 7,
  });

  const layer = new TemporalScalarFieldLayer({
    id: 'runtime-temporal-scalar-layer',
    sourceId,
    globalMin: -25,
    globalMax: 1,
  });
  runtime.addLayer(layer);

  const loop = () => {
    layer.setTime(layer.currentTime + 0.008);
    requestAnimationFrame(loop);
  };
  loop();
}

function mountTemporalVectorFieldLayer(runtime: Runtime, sourceBaseUrl: string): {
  const sourceId = 'runtime-temporal-vector-source'
  runtime.tileManager.addSource({
    id: sourceId,
    type: 'temporal_vector',
    url: `${sourceBaseUrl}/{z}/{x}/{y}.bin`,
    minzoom: 0,
    maxzoom: 14
  })

  const layer = new TemporalVectorFieldLayer({
    id: 'runtime-temporal-vector-layer',
    sourceId,
    globalMinU: 0,
    globalMaxU: 8,
    globalMinV: 0,
    globalMaxV: 8,
    speedFactor: 0.0002
  })
  runtime.addLayer(layer)
  
//   const loop = () => {
//     layer.setTime(layer.currentTime + 0.008);
//     requestAnimationFrame(loop);
//   };
//   loop();
}

```
