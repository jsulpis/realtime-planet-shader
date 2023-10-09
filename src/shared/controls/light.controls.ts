import { Pane } from "tweakpane";
import { CustomUniforms } from "../settings/uniforms";

export function addLightControls(
   pane: Pane,
   uniforms: CustomUniforms
) {
   const light = pane.addFolder({
      title: "Light",
      expanded: window.innerHeight > 800,
   });

   light
      .addBinding({ pos: { x: 1, y: 1 } }, "pos", {
         label: "Sun position",
         picker: "inline",
         expanded: true,
         y: { inverted: true, min: -1, max: 1 },
         x: { min: -1, max: 1 },
      })
      .on("change", ({ value: { x, y } }) => {
         uniforms.sunDirectionXY = [x, y];
      });

   light
      .addBinding(
         { value: round(Math.pow(uniforms.uSunIntensity / 5, 1 / 3)) },
         "value",
         {
            label: "Sun intensity",
            min: 0,
            max: 1,
         }
      )
      .on("change", ({ value }) => {
         uniforms.uSunIntensity = Math.pow(value, 3) * 5;
      });
   light
      .addBinding(
         { value: round(Math.pow(uniforms.uAmbientLight, 1 / 5)) },
         "value",
         {
            label: "Ambient light",
            min: 0,
            max: 1,
         }
      )
      .on("change", ({ value }) => {
         uniforms.uAmbientLight = Math.pow(value, 5);
      });
}

function round(n: number) {
   return Math.round(n * 100) / 100;
}
