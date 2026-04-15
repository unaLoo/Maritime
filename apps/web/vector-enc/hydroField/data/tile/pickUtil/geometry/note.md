# 关于 MapboxGL 底层的坐标系统

## 🌐 Mapbox Web墨卡托坐标系
> 通常在customLayer里给那个matrix的就是wmc坐标系
- 原点左上，x 向右，y 向下，z 向上  → 左手系
- x, y 范围：`[0, 1]`
- z 也是一个（相对）的归一值
- wmc通常是下面俩坐标转换的中介

## 🌐 Mapbox地图世界坐标系
> 这里指的是最终乘以 VP 矩阵的坐标点所在的坐标系

- 原点左上，x 向右，y 向下，z 向上  → 左手系
- x, y 范围：`[0, 2 ^ mapZoom * 512]` 也就是 `[0, worldSize]`
- z 单位为：**米**
- `mapZoom` 为浮点数 —— 当前缩放级别
- `worldSize = 2 ^ mapZoom * 512`

## 🌐 WD 坐标系 
> 和世界坐标系有所区别, 相交检测通常是在该坐标系下进行的
- 原点左上，x 向右，y 向下，z 向上  → 左手系
- x, y 范围：`[0, 2 ^ maxTilezoom]`
- z 单位为：**米**
- `maxTilezoom` 为浮点数 —— 当前缩放级别
- 为什么在 WD 坐标系下做相交检测？
  WD 坐标系剥离了 MapZoom 和 TileSize 的概念，以瓦片为本，单纯考虑瓦片的 XYZ

## 🔀 从地图世界坐标系转换到WD坐标系
```javascript
  worldSize = 2 ^ mapZoom * 512
  WDSize = 2 ^ maxTilezoom
  scaledTileSize = worldSize / WDSize
  
  wd_x = mapWorldX / scaledTileSize
  wd_y = mapWorldY / scaledTileSize
  wd_z = mapWorldZ
```

## 🤔 有关mapboxgl中z值处理的理解
> meter?   mercatorZ?    pixels? 

- **meter**: 现实世界和模型空间中，z通常以米为单位
- **mercatorZ**: 在mapbox的归一化墨卡托坐标中，mercatorX和mercatorY的取值范围是[0, 1] , 故mercatorZ也可以是一个类似区间的值来表示相对worldSize的大小
- **pixels**: 什么是pixel空间呢， mapbox的地图世界坐标系就是所谓的pixel空间，worldSize = 2 ^ mapZoom * 512  --> 这个空间的基本单位是瓦片的一个像素

下面的代码就好理解了
```javascript
  function mercatorZfromAltitude(altitude: number, lat: number): number {
    // 因为web墨卡托投影最终是一个正方形，各个纬度的周长是一样的
    // 但是真实地球，纬度越高，周长越短， 所以这里的mercatorZ是相对于lat所在地球周长的归一化值
    return altitude / circumferenceAtLatitude(lat);
  }

  pixelsPerMeter(lat: number, worldSize: number): number {
    // 有了上面的理解，这个函数可以改个名，叫做 zAxisWorldSizePerMeter
    return mercatorZfromAltitude(1, lat) * worldSize;
  }
```

## 🤔 pixels-per-meter 和 meter-to-tile的关系？
这两者的关系，就是上文提及的 `地图世界坐标系` 和 `WD坐标系` 之间的关系
按照mapbox里变量命名和源码comment来说，这里说的地图世界坐标系就对应pixels-coord, WD坐标系就对应tile-coord
> pixels-per-meter <--> 每米的像素数 <--> meter-to-pixels
> meter-to-tile <--> 从米到瓦片单位 <--> tileunits-per-meter
结合代码瞅瞅
```javascript
  const pixelsPerMeter = mercatorZfromAltitude(1, lat) * worldSize;
  const meterToTile = mercatorZfromAltitude(1, lat) * numTiles; // numTiles <==> worldSize_wd
```
这个坐标系统是真乱，注意区分三个空间 // Lnglat-space | Webmercator-space | WD-space


## 🤔 几个矩阵
```javascript
// vp矩阵 适用于 xy in [0, worldSize], z in meters
// worldToCamera矩阵中，专门做了从meters到地图世界空间（pixels）的转换， 故z单位为米
  cameraToClip = mat4.perspective(matrix, fovy, aspectRatio, nearZ, farZ);
  worldToCamera = flipY * cam^-1 * zAxisPixelsPerMeter
  projMatrix = mat4.mul([], cameraToClip, worldToCamera);

// customLayer matrix
  mercatorMatrix = mat4.scale([], projMatrix, [this.worldSize, this.worldSize, this.worldSize / zUnit, 1.0]);
```
