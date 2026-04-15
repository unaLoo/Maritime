import mapboxgl from "mapbox-gl";
import * as THREE from "three";
import proj4 from "proj4";
import { TerrainVertexShader, TerrainFragmentShader } from "./shaders/TerrainShader.js";
import { WaterVertexShader, WaterFragmentShader } from "./shaders/WaterShader.js";

const DEFAULT_LAYER_ID = "water-custom-layer";
const DEFAULT_ALTITUDE = 0;
const DEFAULT_GRID_RESOLUTION = 1024;
const DEFAULT_RASTER_TEXTURE_SIZE = 2048;
const DEFAULT_STYLE = {
  lightColor: "#FFF4D6",
  terrainColor: "#FFFFFF",
  waterShallowColor: "#06D5FF",
  waterDeepColor: "#0D1AA8",
  waterOpacity: 0.8,
  waterDepthDensity: 0.3,
};
const DEFAULT_ANIMATION = {
  swapDuration: 2000,
  swapTimeStart: 0.75,
  swapTimeEnd: 1.0,
};
const DEFAULT_TEXTURES = {
  terrainMap: "dem/dem.png",
  huvPrefix: "huv/huv_",
  huvSuffix: ".png",
  foam: "./assets/Textures/Foam.png",
  normal: "./assets/Textures/NormalMap.png",
  displacement: "./assets/Textures/DisplacementMap.png",
  heightNoise: "./assets/Textures/HeightMap.png",
  heightNoiseNormal: "./assets/Textures/HeightNormalMap.png",
  ramp: "./assets/Textures/RampMap.png",
};

function mergeSceneOptions(options) {
  return {
    dataResource: options.dataResource,
    layer: {
      id: options.layer?.id ?? DEFAULT_LAYER_ID,
      altitude: options.layer?.altitude ?? DEFAULT_ALTITUDE,
    },
    geometry: {
      gridResolution: options.geometry?.gridResolution ?? DEFAULT_GRID_RESOLUTION,
      rasterTextureSize: options.geometry?.rasterTextureSize ?? DEFAULT_RASTER_TEXTURE_SIZE,
    },
    style: {
      ...DEFAULT_STYLE,
      ...options.style,
    },
    animation: {
      ...DEFAULT_ANIMATION,
      ...options.animation,
    },
    textures: {
      ...DEFAULT_TEXTURES,
      ...options.textures,
    },
  };
}

function buildAssetPath(...parts) {
  return parts.join("/").replace(/\/+/g, "/");
}

function createSceneState() {
  return {
    scene: null,
    camera: null,
    renderer: null,
    rootGroup: null,
    terrainMesh: null,
    waterMesh: null,
    terrainGeometry: null,
    waterGeometry: null,
    dataConfig: null,
    textureLoader: null,
    startTime: 0,
    modelTransform: null,
  };
}

export function createWaterSceneController(rawOptions) {
  const options = mergeSceneOptions(rawOptions);
  const state = createSceneState();

  function attachRootGroupToScene() {
    if (!state.scene || !state.rootGroup || state.scene.children.includes(state.rootGroup)) {
      return;
    }

    state.scene.add(state.rootGroup);
  }

  function loadTexture(imagePath) {
    const texture = state.textureLoader.load(imagePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createTerrainGeometry(config) {
    const { dem } = config;
    return new THREE.PlaneGeometry(
      dem.mapsize[0] * dem.cellsize,
      dem.mapsize[1] * dem.cellsize,
      options.geometry.gridResolution,
      options.geometry.gridResolution
    );
  }

  function createWaterGeometry(config) {
    const { huv } = config;
    return new THREE.PlaneGeometry(
      huv.mapsize[0] * huv.cellsize,
      huv.mapsize[1] * huv.cellsize,
      options.geometry.gridResolution,
      options.geometry.gridResolution
    );
  }

  function createTerrainMesh(config) {
    const lightColor = new THREE.Color(options.style.lightColor);
    const lightDirection = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler((50 * Math.PI) / 180, (-30 * Math.PI) / 180, 0)
    );
    const terrainMap = state.textureLoader.load(
      buildAssetPath(options.dataResource.path, options.textures.terrainMap)
    );
    terrainMap.minFilter = THREE.LinearFilter;
    terrainMap.magFilter = THREE.LinearFilter;
    terrainMap.generateMipmaps = false;

    const { dem } = config;
    const terrainUniforms = {
      lightColor: { value: lightColor },
      lightDirection: { value: lightDirection },
      terrainMap: { value: terrainMap },
      terrainMapSize: {
        value: new THREE.Vector2(
          options.geometry.rasterTextureSize,
          (dem.mapsize[1] * options.geometry.rasterTextureSize) / dem.mapsize[0]
        ),
      },
      terrainColor: { value: new THREE.Color(options.style.terrainColor) },
      terrainNormalY: { value: 0.2 },
      minTerrainHeight: { value: dem.min_height },
      maxTerrainHeight: { value: dem.max_height },
    };

    return new THREE.Mesh(
      state.terrainGeometry,
      new THREE.ShaderMaterial({
        uniforms: terrainUniforms,
        vertexShader: TerrainVertexShader,
        fragmentShader: TerrainFragmentShader,
        side: THREE.DoubleSide,
        depthWrite: true,
        transparent: false,
      })
    );
  }

  function createWaterMesh(config) {
    const lightColor = new THREE.Color(options.style.lightColor).convertLinearToSRGB();
    const lightDirection = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler((50 * Math.PI) / 180, (-30 * Math.PI) / 180, 0)
    );
    const terrainMap = state.textureLoader.load(
      buildAssetPath(options.dataResource.path, options.textures.terrainMap)
    );
    const foamTexture = loadTexture(options.textures.foam);
    const normalMap = loadTexture(options.textures.normal);
    const displacementMap = loadTexture(options.textures.displacement);
    const heightNoiseMap = loadTexture(options.textures.heightNoise);
    const heightNoiseNormalMap = loadTexture(options.textures.heightNoiseNormal);
    const rampMap = loadTexture(options.textures.ramp);
    foamTexture.repeat = new THREE.Vector2(500, 500);

    const { dem, huv } = config;
    const waterTextures = Array.from({ length: huv.timesteps }, (_, index) => {
      const texture = state.textureLoader.load(
        buildAssetPath(
          options.dataResource.path,
          `${options.textures.huvPrefix}${index}${options.textures.huvSuffix}`
        )
      );
      texture.premultiplyAlpha = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.name = `huv_${index}`;
      return texture;
    });

    const uniforms = {
      displacementMap: { value: displacementMap },
      normalMap: { value: normalMap },
      terrainMap: { value: terrainMap },
      huvMapBefore: { value: waterTextures[0] },
      huvMapAfter: { value: waterTextures[1] ?? waterTextures[0] },
      foamTexture: { value: foamTexture },
      heightNoiseMap: { value: heightNoiseMap },
      heightNoiseNormalMap: { value: heightNoiseNormalMap },
      rampMap: { value: rampMap },
      lightColor: { value: lightColor },
      lightDirection: { value: lightDirection },
      huvMapSize: {
        value: new THREE.Vector2(
          options.geometry.rasterTextureSize,
          (huv.mapsize[1] * options.geometry.rasterTextureSize) / huv.mapsize[0]
        ),
      },
      terrainMapSize: {
        value: new THREE.Vector2(
          options.geometry.rasterTextureSize,
          (dem.mapsize[1] * options.geometry.rasterTextureSize) / dem.mapsize[0]
        ),
      },
      normalStrength: { value: 2.0 },
      waterNormalY: { value: 20 },
      time: { value: 0.0 },
      timeStep: { value: 0.0 },
      waterAlpha: { value: options.style.waterOpacity },
      minWaterDepth: { value: 0.0 },
      maxWaterDepth: { value: 5.0 },
      minWaterDepthAlpha: { value: 0.1 },
      maxWaterDepthAlpha: { value: 1.0 },
      swapTimeMinRange: { value: options.animation.swapTimeStart },
      swapTimeMaxRange: { value: options.animation.swapTimeEnd },
      minTerrainHeight: { value: dem.min_height },
      maxTerrainHeight: { value: dem.max_height },
      minWaterDepthBefore: { value: 0.001 },
      maxWaterDepthBefore: { value: 0.01 },
      minWaterDepthAfter: { value: 0.001 },
      maxWaterDepthAfter: { value: 0.01 },
      minVelocityUBefore: { value: 0.0 },
      maxVelocityUBefore: { value: 0.0 },
      minVelocityUAfter: { value: 0.0 },
      maxVelocityUAfter: { value: 0.0 },
      minVelocityVBefore: { value: 0.0 },
      maxVelocityVBefore: { value: 0.0 },
      minVelocityVAfter: { value: 0.0 },
      maxVelocityVAfter: { value: 0.0 },
      waterShallowColor: { value: new THREE.Color(options.style.waterShallowColor) },
      waterDeepColor: { value: new THREE.Color(options.style.waterDeepColor) },
      waterShallowAlpha: { value: 166.0 / 255.0 },
      waterDeepAlpha: { value: 228.0 / 255.0 },
      depthDensity: { value: options.style.waterDepthDensity },
      gridResolutionA: { value: 52 },
      wavePeriodA: { value: 1.578 },
      flowVelocityStrengthA: { value: 0.562 },
      gridResolutionB: { value: 60 },
      wavePeriodB: { value: 1.36 },
      flowVelocityStrengthB: { value: 0.512 },
      gridResolutionC: { value: 58 },
      wavePeriodC: { value: 1.66 },
      flowVelocityStrengthC: { value: 0.678 },
      gridResolutionD: { value: 54 },
      wavePeriodD: { value: 2.54 },
      flowVelocityStrengthD: { value: 0.602 },
      foamMinEdge: { value: 0.25 },
      foamMaxEdge: { value: 0.5 },
      foamVelocityMaskMinEdge: { value: 0.05 },
      foamVelocityMaskMaxEdge: { value: 0.2 },
    };

    const mesh = new THREE.Mesh(
      state.waterGeometry,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: WaterVertexShader,
        fragmentShader: WaterFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        polygonOffset: true,
        polygonOffsetFactor: -2.0,
        polygonOffsetUnits: -2.0,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        blendEquation: THREE.AddEquation,
      })
    );

    mesh.onBeforeRender = (_renderer, _scene, _camera, _geometry, material) => {
      updateWaterUniforms(
        material.uniforms,
        huv.data,
        waterTextures,
        Date.now() - state.startTime,
        options.animation.swapDuration
      );
    };

    updateWaterUniforms(uniforms, huv.data, waterTextures, 0, options.animation.swapDuration);
    return mesh;
  }

  function updateWaterUniforms(uniforms, data, waterTextures, time, swapDuration) {
    const numRasters = waterTextures.length;
    const currIndex = Math.floor(time / swapDuration) % numRasters;
    const nextIndex = (currIndex + 1) % numRasters;

    uniforms.huvMapBefore.value = waterTextures[currIndex];
    uniforms.huvMapAfter.value = waterTextures[nextIndex];
    uniforms.time.value = time;
    uniforms.timeStep.value = (time % swapDuration) / swapDuration;

    if (data?.[currIndex]) {
      uniforms.minWaterDepthBefore.value = data[currIndex].min_depth;
      uniforms.maxWaterDepthBefore.value = data[currIndex].max_depth;
      uniforms.minVelocityUBefore.value = data[currIndex].min_u;
      uniforms.maxVelocityUBefore.value = data[currIndex].max_u;
      uniforms.minVelocityVBefore.value = data[currIndex].min_v;
      uniforms.maxVelocityVBefore.value = data[currIndex].max_v;
    }

    if (data?.[nextIndex]) {
      uniforms.minWaterDepthAfter.value = data[nextIndex].min_depth;
      uniforms.maxWaterDepthAfter.value = data[nextIndex].max_depth;
      uniforms.minVelocityUAfter.value = data[nextIndex].min_u;
      uniforms.maxVelocityUAfter.value = data[nextIndex].max_u;
      uniforms.minVelocityVAfter.value = data[nextIndex].min_v;
      uniforms.maxVelocityVAfter.value = data[nextIndex].max_v;
    }
  }

  function createModelTransform(center) {
    const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      center,
      options.layer.altitude
    );

    return {
      translateX: mercatorCoordinate.x,
      translateY: mercatorCoordinate.y,
      translateZ: mercatorCoordinate.z,
      scale: mercatorCoordinate.meterInMercatorCoordinateUnits(),
    };
  }

  function createCustomLayer(map) {
    return {
      id: options.layer.id,
      type: "custom",
      renderingMode: "3d",
      onAdd(mapInstance, gl) {
        state.camera = new THREE.Camera();
        state.scene = new THREE.Scene();
        state.renderer = new THREE.WebGLRenderer({
          canvas: mapInstance.getCanvas(),
          context: gl,
          antialias: true,
        });
        state.renderer.autoClear = false;

        attachRootGroupToScene();
      },
      render(_gl, matrix) {
        if (!state.camera || !state.scene || !state.renderer || !state.modelTransform) {
          return;
        }

        const projectionMatrix = new THREE.Matrix4().fromArray(matrix);
        const transformMatrix = new THREE.Matrix4()
          .makeTranslation(
            state.modelTransform.translateX,
            state.modelTransform.translateY,
            state.modelTransform.translateZ
          )
          .scale(
            new THREE.Vector3(
              state.modelTransform.scale,
              -state.modelTransform.scale,
              state.modelTransform.scale
            )
          );

        state.camera.projectionMatrix = projectionMatrix.multiply(transformMatrix);
        state.renderer.resetState();
        state.renderer.render(state.scene, state.camera);
        map.triggerRepaint();
      },
    };
  }

  async function initialize(map) {
    const filePath = buildAssetPath(options.dataResource.path, options.dataResource.config);
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: HTTP ${response.status}`);
    }

    state.dataConfig = await response.json();

    let center = [state.dataConfig.center.x, state.dataConfig.center.y];
    if (state.dataConfig.EPSG && state.dataConfig.EPSG !== 4326) {
      center = proj4(`EPSG:${state.dataConfig.EPSG}`, "EPSG:4326", center);
    }

    state.textureLoader = new THREE.TextureLoader();
    state.startTime = Date.now();
    state.modelTransform = createModelTransform(center);
    state.terrainGeometry = createTerrainGeometry(state.dataConfig);
    state.waterGeometry = createWaterGeometry(state.dataConfig);
    state.rootGroup = new THREE.Group();
    state.terrainMesh = createTerrainMesh(state.dataConfig);
    state.terrainMesh.renderOrder = 0;
    state.waterMesh = createWaterMesh(state.dataConfig);
    state.waterMesh.renderOrder = 1;

    state.rootGroup.add(state.terrainMesh);
    state.rootGroup.add(state.waterMesh);
    attachRootGroupToScene();

    return createCustomLayer(map);
  }

  function disposeMaterial(material) {
    const materials = Array.isArray(material) ? material : [material];
    for (const entry of materials) {
      if (!entry) {
        continue;
      }

      if (entry.uniforms) {
        for (const uniform of Object.values(entry.uniforms)) {
          const value = uniform?.value;
          if (value?.isTexture) {
            value.dispose();
          }
        }
      }

      entry.dispose?.();
    }
  }

  function destroy() {
    state.rootGroup?.removeFromParent();
    disposeMaterial(state.terrainMesh?.material);
    disposeMaterial(state.waterMesh?.material);
    state.terrainGeometry?.dispose?.();
    state.waterGeometry?.dispose?.();

    state.scene = null;
    state.camera = null;
    state.renderer = null;
    state.rootGroup = null;
    state.terrainMesh = null;
    state.waterMesh = null;
    state.terrainGeometry = null;
    state.waterGeometry = null;
    state.dataConfig = null;
    state.textureLoader = null;
    state.startTime = 0;
    state.modelTransform = null;
  }

  return {
    initialize,
    destroy,
  };
}
