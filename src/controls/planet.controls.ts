import type { Pane } from "tweakpane";
import type { CustomUniforms } from "../webgl/settings/uniforms";

interface Display {
   geometry?: boolean;
   terrain?: boolean;
   clouds?: boolean;
   atmosphere?: boolean;
}

export function addPlanetControls(
   pane: Pane,
   uniforms: CustomUniforms,
   display: Display = {}
) {
   const planetFolder = pane.addFolder({
      title: "Planet",
      expanded: window.innerHeight > 800,
   });

   if (display.geometry !== false) {
      const geometry = planetFolder.addFolder({ title: "Geometry" });

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
   }

   if (display.terrain !== false) {
      const terrain = planetFolder.addFolder({ title: "Terrain" });

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
   }

   if (display.clouds !== false) {
      const clouds = planetFolder.addFolder({ title: "Clouds" });

      clouds.addBinding(uniforms, "uCloudsDensity", {
         label: "Density",
         min: 0,
         max: 1,
      });
      if (uniforms.uCloudsScale !== -1) {
         clouds.addBinding(uniforms, "uCloudsScale", {
            label: "Scale",
            min: 0.3,
            max: 1.5,
         });
      }
      if (uniforms.uCloudsSpeed !== -1) {
         clouds.addBinding(uniforms, "uCloudsSpeed", {
            label: "Speed",
            min: 0,
            max: 5,
         });
      }
   }

   if (display.atmosphere !== false) {
      const atmosphere = planetFolder.addFolder({ title: "Atmosphere" });

      atmosphere
         .addBinding(
            {
               col: {
                  r: uniforms.uAtmosphereColor[0],
                  g: uniforms.uAtmosphereColor[1],
                  b: uniforms.uAtmosphereColor[2],
               },
            },
            "col",
            {
               label: "Color",
               color: { type: "float" },
            }
         )
         .on("change", ({ value: { r, g, b } }) => {
            uniforms.uAtmosphereColor = [r, g, b];
         });
      atmosphere.addBinding(uniforms, "uAtmosphereDensity", {
         label: "Density",
         min: 0,
         max: 1,
      });
   }
}
