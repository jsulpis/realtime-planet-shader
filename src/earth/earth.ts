import { useGlslCanvas } from "../shared/renderer";
import vertexShader from "../shared/shaders/vertex.glsl";
import fragmentShader from "./earth.fragment.glsl";
import { addPlanetControls } from "../shared/controls/planet.controls";
import { addLightControls } from "../shared/controls/light.controls";
import { addMonitor } from "../shared/controls/monitor.controls";
import { addQualityControl } from "../shared/controls/quality.controls";
import { addPointerControls } from "../shared/controls/pointer.controls";
import { SamplerOptions } from "four";
import { loadTexture } from "./texture.loader";
import { defaultUniforms } from "../shared/settings/uniforms";

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

const { uniforms, renderer } = useGlslCanvas(canvas, {
   vertex: vertexShader,
   fragment: fragmentShader,
   uniforms: {
      ...defaultUniforms,
      uEarthColor: earthColor,
      uEarthNight: earthNightColor,
      uEarthClouds: earthClouds,
      uEarthSpecular: earthSpecular,
      uEarthBump: earthBump,
      uNoiseTexture: noiseMap,
      uFbmTexture: fbmMap,
   },
});

canvas.classList.add("loaded");
addPointerControls(canvas, uniforms);

const { Pane } = await import("tweakpane");

const pane = new Pane({ title: "Controls" });

addQualityControl(pane, uniforms, renderer);
addPlanetControls(pane, uniforms);
addLightControls(pane, uniforms);
addMonitor(pane);
