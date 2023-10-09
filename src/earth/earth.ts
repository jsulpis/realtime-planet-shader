import { Pane } from "tweakpane";

import { useGlslCanvas } from "../shared/renderer";
import vertexShader from "../shared/shaders/vertex.glsl";
import fragmentShader from "./earth.fragment.glsl";
import { addPlanetControls } from "../shared/controls/planet.controls";
import { addLightControls } from "../shared/controls/light.controls";
import { addMonitor } from "../shared/controls/monitor.controls";
import { loadImageTexture } from "../shared/loaders/texture.loaders";
import { addQualityControl } from "../shared/controls/quality.controls";
import { addPointerControls } from "../shared/controls/pointer.controls";
import { defaultQuality } from "../shared/settings/quality";

const earthColor = await loadImageTexture(
   "/realtime-planet-shader/2k_earth_color.jpeg",
   2048,
   1024
);
const earthNightColor = await loadImageTexture(
   "/realtime-planet-shader/2k_earth_night.jpeg",
   2048,
   1024
);
const earthClouds = await loadImageTexture(
   "/realtime-planet-shader/2k_earth_clouds.jpeg",
   2048,
   1024
);
const earthSpecular = await loadImageTexture(
   "/realtime-planet-shader/2k_earth_specular.jpeg",
   2048,
   1024
);
const earthBump = await loadImageTexture(
   "/realtime-planet-shader/2k_earth_bump.jpg",
   2048,
   1024
);
const noiseMap = await loadImageTexture(
   "/realtime-planet-shader/noise.jpg",
   512,
   512,
   { minFilter: "linear", magFilter: "linear" }
);
const fbmMap = await loadImageTexture(
   "/realtime-planet-shader/fbm.jpg",
   512,
   512,
   { minFilter: "linear", magFilter: "linear" }
);

const canvas = document.querySelector("canvas");
canvas.classList.add("loaded");

const defaultUniforms = {
   uTime: 0.0,
   uQuality: defaultQuality,
   uResolution: [window.innerWidth, window.innerHeight],
   uPlanetPosition: [0, 0, 0],
   uPlanetRadius: 2,
   uCloudsDensity: .5,
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
