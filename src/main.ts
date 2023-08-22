import "./style.css";

import { Pane } from "tweakpane";

import { useGlslCanvas } from "./renderer";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const { uniforms, raf } = useGlslCanvas({
   vertex: vertexShader,
   fragment: fragmentShader,
   uniforms: {
      uTime: 0.0,
      uResolution: [
         window.innerWidth * window.devicePixelRatio,
         window.innerHeight * window.devicePixelRatio,
      ],
      uPlanetPosition: [0, 0, 0],
      uPlanetRadius: 2,
      uNoiseStrength: 0.2,
      uAtmosphereColor: [0.05, 0.3, 0.9],
      sunDirectionXY: [1, 1],
   },
});

const pane = new Pane({ title: "Controls" });
const planetFolder = pane.addFolder({ title: "Planet" });
const planetGeometry = planetFolder.addFolder({ title: "Geometry" });
const planetAtmosphere = planetFolder.addFolder({ title: "Atmosphere" });

planetGeometry
   .addBinding({ pos: { x: 0, y: 0 } }, "pos", {
      label: "Position",
      picker: "inline",
      expanded: true,
      y: { inverted: true, min: -2, max: 2 },
      x: { min: -2, max: 2 },
   })
   .on("change", ({ value: { x, y } }) => {
      uniforms.uPlanetPosition = [x, y, 0];
   });

planetGeometry.addBinding(uniforms, "uPlanetRadius", {
   label: "Radius",
   min: 0.5,
   max: 5,
});
planetGeometry.addBinding(uniforms, "uNoiseStrength", {
   label: "Terrain",
   min: 0,
   max: 0.4,
});

planetAtmosphere
   .addBinding({ col: { r: 0.05, g: 0.3, b: 0.9 } }, "col", {
      label: "Color",
      color: { type: "float" },
   })
   .on("change", ({ value: { r, g, b } }) => {
      uniforms.uAtmosphereColor = [r, g, b];
   });

pane
   .addFolder({ title: "Sun" })
   .addBinding({ pos: { x: 0, y: 0 } }, "pos", {
      label: "Position",
      picker: "inline",
      expanded: true,
      y: { inverted: true, min: -1, max: 1 },
      x: { min: -1, max: 1 },
   })
   .on("change", ({ value: { x, y } }) => {
      uniforms.sunDirectionXY = [x, y];
   });

const monitorFolder = pane.addFolder({ title: "Monitor", expanded: false });

const fps = { value: 0 };

monitorFolder.addBinding(fps, "value", {
   label: "FPS",
   readonly: true,
});
monitorFolder.addBinding(fps, "value", {
   label: "",
   readonly: true,
   view: "graph",
   min: 0,
   max: 120,
});

let deltaMs = 0;
let frameIndex = 1;
let frameMeasure;
const frameWindowSize = 100;

performance.mark("previous-frame");

raf(() => {
   // Measure duration of frame window
   if (frameIndex++ !== frameWindowSize) {
      return;
   }

   frameIndex = 1;
   performance.mark("current-frame");
   frameMeasure = performance.measure(
      "duration",
      "previous-frame",
      "current-frame"
   );
   performance.mark("previous-frame");

   deltaMs = frameMeasure.duration / frameWindowSize;
   fps.value = Math.floor(1 / ((deltaMs || Infinity) / 1000));
});
