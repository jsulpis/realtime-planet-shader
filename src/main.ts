import { Pane } from "tweakpane";

import { useGlslCanvas } from "./renderer";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { addPlanetControls } from "./controls/planet.controls";
import { addLightControls } from "./controls/light.controls";
import { addMonitor } from "./controls/monitor.controls";
import { load3DNoiseTexture } from "./noiseTexture";
import { Quality, addQualityControl } from "./controls/quality.controls";
import { addPointerControls } from "./controls/pointer.controls";

const canvas = document.querySelector("canvas");

load3DNoiseTexture(canvas).then(() => {
   canvas.classList.add("loaded");

   const { uniforms, renderer } = useGlslCanvas(canvas, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
         uTime: 0.0,
         uQuality: window.innerWidth < 800 ? Quality.MEDIUM : Quality.OPTIMAL,
         uResolution: [window.innerWidth, window.innerHeight],
         uPlanetPosition: [0, 0, 0],
         uPlanetRadius: 2,
         uNoiseStrength: 0.2,
         uTerrainScale: 0.8,
         uCloudsDensity: 0.5,
         uCloudsScale: 1,
         uCloudsSpeed: 1,
         uAtmosphereColor: [0.05, 0.3, 0.9],
         uAtmosphereDensity: 0.2,
         uAmbientLight: 0.002,
         uSunIntensity: 3,
         sunDirectionXY: [1, 1],
      },
   });

   addPointerControls(canvas, uniforms);

   const pane = new Pane({ title: "Controls" });

   addQualityControl(pane, uniforms, renderer);
   addPlanetControls(pane, uniforms);
   addLightControls(pane, uniforms);
   addMonitor(pane);
});
