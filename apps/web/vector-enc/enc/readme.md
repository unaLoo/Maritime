# enc 集成方式

```ts
import { EncOverlayCustomLayer } from './enc';

const encOverlay = new EncOverlayCustomLayer({
  theme: 'DAY_BRIGHT',
  showLand: true,
  showSoundings: true,
  sourceBaseUrl: 'https://localhost:3000/mbtiles',
  iconBaseUrl: 'https://localhost:3000/static/all',
});

map.addLayer(encOverlay);
```