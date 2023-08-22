import { Pane } from "tweakpane";

export function addLightControls(
   pane: Pane,
   uniforms: Record<string, unknown>
) {
   pane
      .addFolder({ title: "Sun", expanded: window.innerHeight > 800 })
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
}
