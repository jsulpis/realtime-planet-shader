import "./style.css";

import { Pane } from "tweakpane";

import { useGlslCanvas } from "./renderer";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const { uniforms } = useGlslCanvas({
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
const planetTabs = planetFolder.addTab({
   pages: [{ title: "Geometry" }, { title: "Atmosphere" }],
});

planetTabs.pages[0]
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

planetTabs.pages[0].addBinding(uniforms, "uPlanetRadius", {
   label: "Radius",
   min: 0.5,
   max: 5,
});
planetTabs.pages[0].addBinding(uniforms, "uNoiseStrength", {
   label: "Terrain",
   min: 0,
   max: 0.4,
});

planetTabs.pages[1]
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
