import { Pane } from "tweakpane";

export function addPlanetControls(
   pane: Pane,
   uniforms: Record<string, unknown>
) {
   const planetFolder = pane.addFolder({
      title: "Planet",
      expanded: window.innerHeight > 800,
   });
   const geometry = planetFolder.addFolder({ title: "Geometry" });
   const terrain = planetFolder.addFolder({ title: "Terrain" });
   const clouds = planetFolder.addFolder({ title: "Clouds" });
   const atmosphere = planetFolder.addFolder({ title: "Atmosphere" });

   geometry
      .addBinding({ pos: { x: 0, y: 0 } }, "pos", {
         label: "Position",
         picker: "inline",
         y: { inverted: true, min: -2, max: 2 },
         x: { min: -2, max: 2 },
      })
      .on("change", ({ value: { x, y } }) => {
         uniforms.uPlanetPosition = [x, y, 0];
      });
   geometry.addBinding(uniforms, "uPlanetRadius", {
      label: "Radius",
      min: 0.5,
      max: 5,
   });

   terrain.addBinding(uniforms, "uNoiseStrength", {
      label: "Height",
      min: 0,
      max: 0.4,
   });
   terrain.addBinding(uniforms, "uTerrainScale", {
      label: "Scale",
      min: 0.2,
      max: 1.5,
   });

   clouds.addBinding(uniforms, "uCloudsDensity", {
      label: "Density",
      min: 0,
      max: 1,
   });
   clouds.addBinding(uniforms, "uCloudsScale", {
      label: "Scale",
      min: 0.3,
      max: 1.5,
   });
   clouds.addBinding(uniforms, "uCloudsSpeed", {
      label: "Speed",
      min: 0,
      max: 5,
   });

   atmosphere
      .addBinding({ col: { r: 0.05, g: 0.3, b: 0.9 } }, "col", {
         label: "Color",
         color: { type: "float" },
      })
      .on("change", ({ value: { r, g, b } }) => {
         uniforms.uAtmosphereColor = [r, g, b];
      });

   atmosphere.addBinding(uniforms, "uAtmosphereDensity", {
      label: "Density",
      min: 0,
      max: 1,
   });
}
