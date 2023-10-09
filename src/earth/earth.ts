import { Pane } from "tweakpane";

import { useGlslCanvas } from "../shared/renderer";
import vertexShader from "../shared/shaders/vertex.glsl";
import fragmentShader from "./earth.fragment.glsl";
import { addPlanetControls } from "../shared/controls/planet.controls";
import { addLightControls } from "../shared/controls/light.controls";
import { addMonitor } from "../shared/controls/monitor.controls";
import { addQualityControl } from "../shared/controls/quality.controls";
import { addPointerControls } from "../shared/controls/pointer.controls";
import { defaultQuality } from "../shared/settings/quality";
import { SamplerOptions } from "four";
import { loadTexture } from "./texture.loader";

const linearFilter: Partial<SamplerOptions> = {
   minFilter: "linear",
   magFilter: "linear",
};

const textures = [
   { path: "2k_earth_color.jpeg" },
   { path: "2k_earth_night.jpeg" },
   { path: "2k_earth_clouds.jpeg" },
   { path: "2k_earth_specular.jpeg" },
   { path: "2k_earth_bump.jpg" },
   {
      path: "noise.jpg",
      width: 512,
      height: 512,
      options: linearFilter,
   },
   {
      path: "fbm.jpg",
      width: 512,
      height: 512,
      options: linearFilter,
   },
];

const [
   earthColor,
   earthNightColor,
   earthClouds,
   earthSpecular,
   earthBump,
   noiseMap,
   fbmMap,
] = await Promise.all(
   textures.map(({ path, width = 2048, height = 1024, options }) =>
      loadTexture(`/realtime-planet-shader/${path}`, width, height, options)
   )
);

const canvas = document.querySelector("canvas");
canvas.classList.add("loaded");

const defaultUniforms = {
   uTime: 0.0,
   uQuality: defaultQuality,
   uResolution: [window.innerWidth, window.innerHeight],
   uPlanetPosition: [0, 0, 0],
   uPlanetRadius: 2,
   uCloudsDensity: 0.5,
   uCloudsScale: 1,
   uCloudsSpeed: 1,
   uAtmosphereColor: [0.05, 0.3, 0.9],
   uAtmosphereDensity: 0.2,
   uAmbientLight: 0.002,
   uSunIntensity: 3,
   sunDirectionXY: [1, 1],
   uEarthColor: earthColor,
   uEarthNight: earthNightColor,
   uEarthClouds: earthClouds,
   uEarthSpecular: earthSpecular,
   uEarthBump: earthBump,
   uNoiseTexture: noiseMap,
   uFbmTexture: fbmMap,
};

const { uniforms, renderer } = useGlslCanvas(canvas, {
   vertex: vertexShader,
   fragment: fragmentShader,
   uniforms: defaultUniforms,
});

addPointerControls(canvas, uniforms);

const pane = new Pane({ title: "Controls", expanded: true });

addQualityControl(pane, uniforms, renderer);
addPlanetControls(pane, uniforms);
addLightControls(pane, uniforms);
addMonitor(pane);
