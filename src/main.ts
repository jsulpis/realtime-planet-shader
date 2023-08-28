import "./style.css";

import { Pane } from "tweakpane";

import { useGlslCanvas } from "./renderer";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { addPlanetControls } from "./controls/planet.controls";
import { addLightControls } from "./controls/light.controls";
import { addMonitor } from "./controls/monitor.controls";
import { load3DNoiseTexture } from "./noiseTexture";
import { Quality, addQualityControl } from "./controls/quality.controls";

const { uniforms, renderer } = useGlslCanvas({
   vertex: vertexShader,
   fragment: fragmentShader,
   uniforms: {
      uTime: 0.0,
      uQuality: window.innerWidth < 800 ? Quality.MEDIUM : Quality.OPTIMAL,
      uResolution: [window.innerWidth, window.innerHeight],
      uPlanetPosition: [0, 0, 0],
      uPlanetRadius: 2,
      uNoiseStrength: 0.2,
      uAtmosphereColor: [0.05, 0.3, 0.9],
      sunDirectionXY: [1, 1],
   },
});

load3DNoiseTexture(renderer.gl);

const pane = new Pane({ title: "Controls" });

addQualityControl(pane, uniforms, renderer);
addPlanetControls(pane, uniforms);
addLightControls(pane, uniforms);
addMonitor(pane);
