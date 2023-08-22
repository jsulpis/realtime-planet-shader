import "./style.css";

import {
   WebGLRenderer,
   PerspectiveCamera,
   Material,
   Geometry,
   Mesh,
} from "four";
import { Pane } from "tweakpane";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

function flatten<T>(array: T[][]): T[] {
   return array.reduce((acc, val) => acc.concat(val), []);
}

const renderer = new WebGLRenderer({
   canvas: document.querySelector("canvas"),
});
renderer.setSize(
   window.innerWidth * window.devicePixelRatio,
   window.innerHeight * window.devicePixelRatio
);

const camera = new PerspectiveCamera();

const material = new Material({
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

const geometry = new Geometry({
   position: {
      size: 3,
      data: new Float32Array(
         flatten([
            [0, 0, 0],
            [1, 0, 0],
            [0, 1, 0],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 0],
         ])
      ),
   },
});

const mesh = new Mesh(geometry, material);

requestAnimationFrame(function animate() {
   requestAnimationFrame(animate);

   mesh.material.uniforms.uTime = performance.now() / 1000;
   renderer.render(mesh, camera);
});

window.addEventListener("resize", () => {
   renderer.setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
   );
   mesh.material.uniforms.uResolution = [
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
   ];
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
      mesh.material.uniforms.uPlanetPosition = [x, y, 0];
   });

planetTabs.pages[0].addBinding(mesh.material.uniforms, "uPlanetRadius", {
   label: "Radius",
   min: 0.5,
   max: 5,
});
planetTabs.pages[0].addBinding(mesh.material.uniforms, "uNoiseStrength", {
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
      mesh.material.uniforms.uAtmosphereColor = [r, g, b];
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
      mesh.material.uniforms.sunDirectionXY = [x, y];
   });
