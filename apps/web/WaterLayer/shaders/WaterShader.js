import { HeightShader } from "./HeightShader.js";
import { FlowShader } from "./FlowShader.js";
import { ColorShader } from "./ColorShader.js";

const WaterVertexShader =
HeightShader +
`
// 顶点着色器代码

uniform float timeStep;
uniform float minWaterDepthBefore;
uniform float maxWaterDepthBefore;
uniform float minWaterDepthAfter;
uniform float maxWaterDepthAfter;
uniform float minTerrainHeight;
uniform float maxTerrainHeight;
uniform sampler2D huvMapBefore;
uniform sampler2D huvMapAfter;
uniform sampler2D terrainMap;
uniform vec2 huvMapSize;
uniform vec2 terrainMapSize;

varying float waterDepth;
varying float WaterDepth;
varying vec2 vUv;

void main() {
    vUv = uv;
    float terrainHeight = getHeight(uv, terrainMap, terrainMapSize, minTerrainHeight, maxTerrainHeight);

    float WaterDepth0 = getHeight(uv, huvMapBefore, huvMapSize, minWaterDepthBefore, maxWaterDepthBefore);
    if(WaterDepth0 < 0.001)  WaterDepth0 = 0.0;

    float WaterDepth1 = getHeight(uv, huvMapAfter, huvMapSize, minWaterDepthAfter, maxWaterDepthAfter);
    if(WaterDepth1 < 0.001)  WaterDepth1 = 0.0;
    
    
    WaterDepth = mix(WaterDepth0, WaterDepth1, timeStep);
    waterDepth = WaterDepth - terrainHeight;

    vec3 position = position.xyz + vec3(0, 0, WaterDepth);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    gl_Position.z -= 0.002;
}
`;

const WaterFragmentShader =
ColorShader +
HeightShader +
FlowShader +
`
// 片段着色器代码
uniform vec3 lightDirection;
uniform vec2 huvMapSize;
uniform vec2 terrainMapSize;

uniform float minWaterDepthBefore;
uniform float maxWaterDepthBefore;
uniform float minWaterDepthAfter;
uniform float maxWaterDepthAfter;
uniform vec3 lightColor;
uniform float waterAlpha;

uniform vec3 waterShallowColor;
uniform vec3 waterDeepColor;
uniform float waterShallowAlpha;
uniform float waterDeepAlpha;
uniform float depthDensity;
uniform float minWaterDepth;
uniform float maxWaterDepth;
uniform float minWaterDepthAlpha;
uniform float maxWaterDepthAlpha;
uniform float time;
uniform float timeStep;
uniform float swapTimeMinRange;
uniform float swapTimeMaxRange;
uniform float normalStrength;
uniform float waterNormalY;
uniform sampler2D normalMap;
uniform sampler2D displacementMap;
uniform sampler2D heightNoiseMap;
uniform sampler2D heightNoiseNormalMap;
uniform sampler2D huvMapBefore;
uniform sampler2D huvMapAfter;
uniform sampler2D rampMap;              
uniform float minVelocityUBefore;
uniform float maxVelocityUBefore;
uniform float minVelocityVBefore;
uniform float maxVelocityVBefore;
uniform float minVelocityUAfter;
uniform float maxVelocityUAfter;
uniform float minVelocityVAfter;
uniform float maxVelocityVAfter;
uniform float gridResolutionA;
uniform float wavePeriodA;
uniform float flowVelocityStrengthA;
uniform float gridResolutionB;
uniform float wavePeriodB;
uniform float flowVelocityStrengthB;
uniform float gridResolutionC;
uniform float wavePeriodC;
uniform float flowVelocityStrengthC;
uniform float gridResolutionD;
uniform float wavePeriodD;
uniform float flowVelocityStrengthD;
uniform float foamMinEdge;
uniform float foamMaxEdge;
uniform float foamVelocityMaskMinEdge;
uniform float foamVelocityMaskMaxEdge;
uniform sampler2D foamTexture;

varying float waterDepth;
varying float WaterDepth;
varying vec2 vUv;

float remap(float value, vec2 fromRange, vec2 toRange) 
{
    return ((value - fromRange.x) / (fromRange.y - fromRange.x)) * (toRange.y - toRange.x) + toRange.x;
}

void FlowStrength()
{
    float waterRemap = remap(waterDepth, vec2(minWaterDepth, maxWaterDepth), vec2(0.0, 1.0));
    vec2 rampUV = vec2(clamp(waterRemap, 0.0, 1.0), 0.5);
    vec3 waterDepthStrength = texture2D(rampMap, rampUV).rgb;

    float alpha = waterAlpha;

    gl_FragColor = vec4(waterDepthStrength, alpha);
}

void DirectionalFlow() 
{
    // SwapTime用于两个时间段的水面的平滑切换
    float lerpValue = smoothstep(swapTimeMinRange, swapTimeMaxRange, timeStep);

    vec3 currNormal, nextNormal;
    float currDisplacement, nextDisplacement;
    vec2 currVelocity, nextVelocity;
    GetDirectionalFlow(vUv, huvMapBefore, minVelocityUBefore, maxVelocityUBefore, minVelocityVBefore, maxVelocityVBefore, 
                        normalMap, displacementMap, heightNoiseMap, heightNoiseNormalMap,
                        gridResolutionA, flowVelocityStrengthA, wavePeriodA,
                        gridResolutionB, flowVelocityStrengthB, wavePeriodB,
                        gridResolutionC, flowVelocityStrengthC, wavePeriodC,
                        gridResolutionD, flowVelocityStrengthD, wavePeriodD,
                        time, normalStrength,
                        currNormal, currDisplacement, currVelocity);

    GetDirectionalFlow(vUv, huvMapAfter, minVelocityUAfter, maxVelocityUAfter, minVelocityVAfter, maxVelocityVAfter, 
                        normalMap, displacementMap, heightNoiseMap, heightNoiseNormalMap,
                        gridResolutionA, flowVelocityStrengthA, wavePeriodA,
                        gridResolutionB, flowVelocityStrengthB, wavePeriodB,
                        gridResolutionC, flowVelocityStrengthC, wavePeriodC,
                        gridResolutionD, flowVelocityStrengthD, wavePeriodD,
                        time, normalStrength,
                        nextNormal, nextDisplacement, nextVelocity);


    vec3 finalNormal = mix(currNormal, nextNormal, lerpValue);
    finalNormal = NormalStrength(finalNormal, normalStrength);
    
    // 获取速度场显示的遮罩
    float currVelocityMask = smoothstep(foamVelocityMaskMinEdge, foamVelocityMaskMaxEdge, length(currVelocity));
    float nextVelocityMask = smoothstep(foamVelocityMaskMinEdge, foamVelocityMaskMaxEdge, length(nextVelocity));

    // 计算法线
    vec3 normalBefore = getNormalHeight(vUv, huvMapBefore, huvMapSize, minWaterDepthBefore, maxWaterDepthBefore);
    vec3 normalAfter = getNormalHeight(vUv, huvMapAfter, huvMapSize, minWaterDepthAfter, maxWaterDepthAfter);
    vec3 normalHeight = mix(normalBefore, normalAfter, lerpValue);
    vec3 normal = normalize(vec3(normalHeight.x, waterNormalY, normalHeight.z));
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 bitangent = cross(normal, tangent);
    tangent = cross(bitangent, normal);
    // vec3 tangent = normalize(vec3(1.0, normalHeight.x, 0.0));
    // vec3 bitangent = normalize(vec3(0.0, normalHeight.z, 1.0));
    mat3 tbnMatrix = mat3(tangent, bitangent, normal);
    vec3 normalWS = normalize(tbnMatrix * finalNormal);

    // 深浅水颜色
    float WaterDepth = waterDepth;
    WaterDepth *= depthDensity;
    WaterDepth = clamp(WaterDepth, 0.0, 1.0);
    vec3 waterColor = mix(waterShallowColor, waterDeepColor, WaterDepth);
    float waterColorAlpha = mix(waterShallowAlpha, waterDeepAlpha, WaterDepth);
    // float alpha = waterColorAlpha * smoothstep(minWaterDepthAlpha, maxWaterDepthAlpha, waterDepth);
    float alpha = waterAlpha * mix(waterShallowAlpha, waterDeepAlpha, WaterDepth);

    // 法线光照
    float NdotL = dot(normalWS, lightDirection);
    float halfLambert = 0.5 * NdotL + 0.5;
    vec3 diffuseColor = waterColor * lightColor * halfLambert;

    // vec3 viewDir = normalize(vec3(0.3, 0.5, 0.5));
    // vec3 halfVector = normalize(viewDir + lightDirection);
    // float specularPower = 16.0;
    // float specularIntensity = 100.0;
    // float specular = pow(max(dot(normalWS, halfVector), 0.0), specularPower) * specularIntensity;
    // specular = smoothstep(0.2, 0.3, specular);
    // vec3 specularColor = lightColor * specular;

    vec3 finalColor = diffuseColor.rgb;

    // finalColor = LinearToSRGB(waterShallowColor);
    // gl_FragColor = vec4(WaterDepth,WaterDepth,WaterDepth, 1.0);
    // return;

    // 浪尖泡沫
    float foamValue = texture2D(foamTexture, vUv * 500.).r;
    foamValue = remap(foamValue, vec2(0.0,1.0), vec2(0.2, 1.0));
    float currFoamValue = foamValue * smoothstep(foamMinEdge, foamMaxEdge, currDisplacement);
    float nextFoamValue = foamValue * smoothstep(foamMinEdge, foamMaxEdge, nextDisplacement);
    vec3 currFoamColor = vec3(currFoamValue) * currVelocityMask;
    vec3 nextFoamColor = vec3(nextFoamValue) * nextVelocityMask;
    
    vec3 foamColor = mix(currFoamColor, nextFoamColor, lerpValue);

    // RampMap
    // float waterDepth01 = remap(waterDepth, vec2(minWaterDepth, maxWaterDepth), vec2(0.0, 1.0));
    // vec3 finalColorRamp = texture2D(rampMap, vec2(clamp(waterDepth01, 0.0, 1.0), 0.5)).rgb;
    // gl_FragColor = vec4(finalColorRamp, 0.9);
    // return;

    // FlowMap
    finalColor = finalColor + foamColor * 0.5;
    finalColor = LinearToSRGB(finalColor);
    gl_FragColor = vec4(finalColor, alpha);
}
    
void main() 
{
    if(waterDepth < -0.001)
        discard;
    DirectionalFlow();
    // FlowStrength();
}
`;


export { WaterVertexShader,  WaterFragmentShader}
