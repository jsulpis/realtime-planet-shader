export const defaultUniforms = {
   uTime: 0.0,
   uQuality: Math.min(window.devicePixelRatio, 2),
   uRotationSpeed: 1,
   uResolution: [window.innerWidth, window.innerHeight],
   uPlanetPosition: [0, 0, -10],
   uRotationOffset: 1,
   uPlanetRadius: 2,
   uBumpStrength: 0.01,
   uNoiseStrength: 0.2,
   uTerrainScale: 0.8,
   uCloudsDensity: 0.5,
   uCloudsScale: 1,
   uCloudsSpeed: 1.5,
   uAtmosphereColor: [0.05, 0.3, 0.9],
   uAtmosphereDensity: 0.3,
   uAmbientLight: 0.01,
   uSunIntensity: 3,
   sunDirectionXY: [1, 1],
};

export type CustomUniforms = typeof defaultUniforms;
