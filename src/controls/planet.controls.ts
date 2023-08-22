import { Pane } from "tweakpane";

export function addPlanetControls(
   pane: Pane,
   uniforms: Record<string, unknown>
) {
   const planetFolder = pane.addFolder({
      title: "Planet",
      expanded: window.innerHeight > 800,
   });
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
}
