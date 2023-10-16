import { useGlslCanvas } from "../shared/renderer";
import vertexShader from "../shared/shaders/vertex.glsl";
import fragmentShader from "./earth.fragment.glsl";
import { addPlanetControls } from "../shared/controls/planet.controls";
import { addLightControls } from "../shared/controls/light.controls";
import { addMonitor } from "../shared/controls/monitor.controls";
import { addPointerControls } from "../shared/controls/pointer.controls";
import { loadTexture } from "./texture.loader";
import { defaultUniforms } from "../shared/settings/uniforms";
import { SamplerOptions } from "four";

type TextureData = {
   path: string;
   width?: number;
   height?: number;
   options?: Partial<SamplerOptions>;
};

const textures: TextureData[] = [
   { path: "2k_earth_color.jpeg" },
   {
      path: "2k_earth_night.jpeg",
      options: { minFilter: "nearestMipmapLinear" },
   },
   { path: "2k_earth_clouds.jpeg" },
   { path: "2k_earth_specular.jpeg" },
   { path: "2k_earth_bump.jpg" },
   {
      path: "4k_stars.jpg",
      width: 4096,
      height: 2048,
      options: { minFilter: "linearMipmapLinear" },
   },
];

const [
   uEarthColor,
   uEarthNight,
   uEarthClouds,
   uEarthSpecular,
   uEarthBump,
   uStars,
] = await Promise.all(
   textures.map(({ path, width = 2048, height = 1024, options }) =>
      loadTexture(`/realtime-planet-shader/${path}`, width, height, options)
   )
);

const canvas = document.querySelector("canvas");

const { uniforms } = useGlslCanvas(canvas, {
   vertex: vertexShader,
   fragment: fragmentShader,
   uniforms: {
      ...defaultUniforms,
      uCloudsScale: -1,
      uCloudsSpeed: -1,
      uQuality: Math.min(window.devicePixelRatio, 2),
      uEarthColor,
      uEarthNight,
      uEarthClouds,
      uEarthSpecular,
      uEarthBump,
      uStars,
   },
});

canvas.classList.add("loaded");
addPointerControls(canvas, uniforms);

const { Pane } = await import("tweakpane");

const pane = new Pane({ title: "Controls", expanded: false });

addPlanetControls(pane, uniforms, { geometry: false, terrain: false });
addLightControls(pane, uniforms);
addMonitor(pane);
