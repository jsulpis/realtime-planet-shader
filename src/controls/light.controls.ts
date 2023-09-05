import { Pane } from "tweakpane";

export function addLightControls(
   pane: Pane,
   uniforms: Record<string, unknown>
) {
   const light = pane.addFolder({
      title: "Light",
      expanded: window.innerHeight > 800,
   });

   light
      .addBinding({ pos: { x: 0, y: 0 } }, "pos", {
         label: "Sun position",
         picker: "inline",
         expanded: true,
         y: { inverted: true, min: -1, max: 1 },
         x: { min: -1, max: 1 },
      })
      .on("change", ({ value: { x, y } }) => {
         uniforms.sunDirectionXY = [x, y];
      });

   light.addBinding(uniforms, "uSunIntensity", {
      label: "Sun intensity",
      min: 0,
      max: 5,
   });
   light.addBinding(uniforms, "uAmbientLight", {
      label: "Ambient light",
      min: 0,
      max: 0.006,
   });
}
