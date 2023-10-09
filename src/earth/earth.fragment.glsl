//=======================================================================================//
// Procedural Blue Planet by Julien Sulpis (https://twitter.com/jsulpis)                  
//
// https://www.shadertoy.com/view/Ds3XRl
//
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
//
//=======================================================================================//

#version 300 es

precision highp float;
precision mediump int;
precision mediump sampler3D;
precision mediump sampler2D;

in vec2 uv;
out vec4 fragColor;

//===================//
//  Global uniforms  //
//===================//

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D noiseTexture;
uniform sampler2D fbmTexture;
uniform sampler2D uEarthColor;
uniform sampler2D uEarthClouds;
uniform sampler2D uEarthNormal;
uniform sampler2D uEarthSpecular;
uniform sampler2D uEarthBump;
uniform sampler2D uEarthNight;

//==========================//
//  Controllable  uniforms  //
//==========================//

uniform float uQuality;
uniform vec3 uPlanetPosition;
uniform float uPlanetRadius;
uniform float uCloudsDensity;
uniform float uCloudsSpeed;
uniform vec3 uAtmosphereColor;
uniform float uAtmosphereDensity;
uniform float uSunIntensity;
uniform float uAmbientLight;
in vec3 uSunDirection;

//==========================================================//
//  Constants (could be turned into controllable uniforms)  //
//==========================================================//

// Planets geometry
#define ROTATION_SPEED -.1
#define PLANET_ROTATION rotateY(uTime * ROTATION_SPEED)

// Planet colors
#define CLOUD_COLOR vec3(1., 1., 1.)

// Lighting
#define SUN_COLOR vec3(1.0, 1.0, 0.9)
#define DEEP_SPACE vec3(0., 0., 0.002)

// Ray tracing
#define INFINITY 1e10
#define CAMERA_POSITION vec3(0., 0., 6.0)

#define PI acos(-1.)

//=========//
//  Types  //
//=========//

struct Material {
  vec3 color;
  float diffuse;
  float specular;
  vec3 emission;
};

struct Hit {
  float len;
  vec3 normal;
  Material material;
};

struct Sphere {
  vec3 position;
  float radius;
};

// Note: I had created a struct for Ray but then deleted it because it caused artifacts on some mobile devices
// because of a precision issue with struct (https://github.com/KhronosGroup/WebGL/issues/3351)
// I use ro and rd instead in this shader.

Hit miss = Hit(INFINITY, vec3(0.), Material(vec3(0.), -1., -1., vec3(-1.)));

Sphere getPlanet() {
  return Sphere(uPlanetPosition, uPlanetRadius);
}

//===============================================//
//  Generic utilities stolen from smarter people //
//===============================================//

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec2 sphereProjection(vec3 p, vec3 origin, float radius) {
  return vec2(
    atan(p.x, p.z) / PI,
    (p.y - (origin.y - radius)) / (2. * radius)
  );
}

float noise(vec2 p) {
  return texture(noiseTexture, p * .5).r;
}

float noise(vec3 p) {
  float radius = length(p);
  vec2 textureCoord = sphereProjection(p, vec3(0.), radius);

  return noise(radius * textureCoord);
}

// https://iquilezles.org/articles/intersectors/
float sphIntersect(in vec3 ro, in vec3 rd, in Sphere sphere) {
  vec3 oc = ro - sphere.position;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - sphere.radius * sphere.radius;
  float h = b * b - c;
  if(h < 0.0)
    return -1.; // no intersection
  return -b - sqrt(h);
}

float fbmNoise(vec3 p) {
  float radius = length(p);
  vec2 textureCoord = sphereProjection(p, vec3(0.), radius);

  return pow(texture(fbmTexture, radius * 3. * textureCoord).r, 10.) * 0.15;
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(//
  vec3(c, 0, s),//
  vec3(0, 1, 0),//
  vec3(-s, 0, c)//
  );
}

// nimitz - https://www.shadertoy.com/view/XsyGWV
// I reused the 3D noise texture instead of nimitz's hash function for better performance
vec3 stars(in vec3 p) {
  vec3 c = vec3(0.);
  float res = uResolution.x * uQuality * 0.8;

  for(float i = 0.; i < 3.; i++) {
    vec3 q = fract(p * (.15 * res)) - 0.5;
    vec3 id = floor(p * (.15 * res));
    vec2 rn = vec2(noise(id / 2.), noise(id.zyx * 2.)) * .05;
    float c2 = 1. - smoothstep(0., .6, length(q));
    c2 *= step(rn.x, .003 + i * 0.0005);
    c += c2 * (mix(vec3(1.0, 0.49, 0.1), vec3(0.75, 0.9, 1.), rn.y) * 0.25 + 1.2);
    p *= 1.8;
  }
  return c * c;
}

// Zavie - https://www.shadertoy.com/view/lslGzl
vec3 simpleReinhardToneMapping(vec3 color) {
  float exposure = 1.5;
  color *= exposure / (1. + color / exposure);
  color = pow(color, vec3(1. / 2.4));
  return color;
}

//========//
//  Misc  //
//========//

float planetNoise(vec3 p) {
  vec2 textureCoord = sphereProjection(p, uPlanetPosition, uPlanetRadius);
  float bump = texture(uEarthBump, textureCoord).r;
  float cloudsDensity = texture(uEarthClouds, textureCoord).r;

  return .01 * mix(bump, max(bump, smoothstep(-.5, 2., cloudsDensity)), uCloudsDensity);
  ;
}

float planetDist(in vec3 ro, in vec3 rd) {
  float smoothSphereDist = sphIntersect(ro, rd, getPlanet());

  vec3 intersection = ro + smoothSphereDist * rd;
  vec3 intersectionWithRotation = (intersection - uPlanetPosition) * PLANET_ROTATION + uPlanetPosition;

  return sphIntersect(ro, rd, Sphere(uPlanetPosition, uPlanetRadius + planetNoise(intersectionWithRotation)));
}

vec3 planetNormal(vec3 p) {
  vec3 rd = uPlanetPosition - p;
  float dist = planetDist(p, rd);
  // if e is too small it causes artifacts on mobile, so I interpolate 
  // between .01 (large screens) and .03 (small screens)
  vec2 e = vec2(max(.01, .03 * smoothstep(1300., 300., uResolution.x)), 0);

  vec3 normal = dist - vec3(planetDist(p - e.xyy, rd), planetDist(p - e.yxy, rd), planetDist(p + e.yyx, rd));
  return normalize(normal);
}

vec3 spaceColor(vec3 direction) {
  vec3 backgroundCoord = direction * rotateY(-uTime * ROTATION_SPEED / 4.);
  float spaceNoise = fbmNoise(backgroundCoord * .5);
  vec3 spaceDust = mix(DEEP_SPACE, uAtmosphereColor / 4., spaceNoise);

  return stars(backgroundCoord) + spaceDust;
}

vec3 atmosphereColor(vec3 ro, vec3 rd, float spaceMask) {
  float distCameraToPlanetOrigin = length(uPlanetPosition - CAMERA_POSITION);
  float distCameraToPlanetEdge = sqrt(distCameraToPlanetOrigin * distCameraToPlanetOrigin - uPlanetRadius * uPlanetRadius);

  float planetMask = 1.0 - spaceMask;

  vec3 coordFromCenter = (ro + rd * distCameraToPlanetEdge) - uPlanetPosition;
  float distFromEdge = abs(length(coordFromCenter) - uPlanetRadius);
  float planetEdge = max(1. - distFromEdge, 0.);
  float atmosphereMask = pow(remap(dot(uSunDirection, coordFromCenter), -uPlanetRadius, uPlanetRadius / 2., 0., 1.), 5.) * uAtmosphereDensity * uPlanetRadius * uSunIntensity;

  vec3 atmosphere = vec3(pow(planetEdge, 80.));
  atmosphere += pow(planetEdge, 30.) * (1.5 - planetMask);
  atmosphere += pow(planetEdge, 4.) * .02;
  atmosphere += pow(planetEdge, 2.) * .1 * planetMask;

  return atmosphere * uAtmosphereColor * atmosphereMask;
}

//===============//
//  Ray Tracing  //
//===============//

Hit intersectPlanet(vec3 ro, vec3 rd) {
  float len = sphIntersect(ro, rd, getPlanet());

  if(len < 0.) {
    return miss;
  }

  vec3 position = ro + len * rd;
  vec3 rotatedPosition = (position - uPlanetPosition) * PLANET_ROTATION + uPlanetPosition;
  vec3 localPosition = rotatedPosition - uPlanetPosition;

  vec2 textureCoord = sphereProjection(localPosition, uPlanetPosition, uPlanetRadius);
  vec3 color = texture(uEarthColor, textureCoord).rgb;

  vec3 normal = planetNormal(position);
  float specular = texture(uEarthSpecular, textureCoord).r;

  float nightLightIntensity = clamp(dot(-normal, uSunDirection) + .1, smoothstep(1., 0., pow((uSunIntensity + uAmbientLight), .3)), 1.);
  vec3 nightColor = pow(texture(uEarthNight, textureCoord).r, 5.) * vec3(1., .8, .6) * .8;
  nightColor *= nightLightIntensity;

  float cloudsDensity = texture(uEarthClouds, textureCoord).r;
  float cloudsThreshold = 1. - uCloudsDensity;
  cloudsDensity *= smoothstep(cloudsThreshold - .2, cloudsThreshold, cloudsDensity);
  color = mix(color, CLOUD_COLOR, cloudsDensity);

  return Hit(len, normal, Material(color, 1., specular, nightColor));
}

Hit intersectScene(vec3 ro, vec3 rd) {
  return intersectPlanet(ro, rd);
}

vec3 radiance(vec3 ro, vec3 rd) {
  vec3 color = vec3(0.);
  float spaceMask = 1.;
  Hit hit = intersectScene(ro, rd);

  if(hit.len < INFINITY) {
    spaceMask = 0.;

    // Diffuse
    float directLightIntensity = pow(clamp(dot(hit.normal, uSunDirection), 0.0, 1.0), 2.) * uSunIntensity; // the power softens the shadow. Not physically accurate but it looks better to me
    vec3 diffuseLight = directLightIntensity * SUN_COLOR;
    vec3 diffuseColor = hit.material.color.rgb * (uAmbientLight + diffuseLight);

    // Phong specular
    vec3 reflected = normalize(reflect(-uSunDirection, hit.normal));
    float phongValue = pow(max(0.0, dot(rd, reflected)), 10.) * .2 * uSunIntensity;
    vec3 specularColor = hit.material.specular * vec3(phongValue);

    color = diffuseColor + specularColor + hit.material.emission;
  } else {
    color = spaceColor(rd);
  }

  return color + atmosphereColor(ro, rd, spaceMask);
}

//========//
//  Main  //
//========//

void main() {
  vec3 ro = vec3(CAMERA_POSITION);
  vec3 rd = normalize(vec3(uv, -1.));

  vec3 color = radiance(ro, rd);

  // color grading
  color = simpleReinhardToneMapping(color);

  // vignette
  color *= 1. - 0.5 * pow(length(uv), 3.);

  fragColor = vec4(color, 1.0);
}