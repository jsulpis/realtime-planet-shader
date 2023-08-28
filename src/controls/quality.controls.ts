import { WebGLRenderer } from "four";
import { ListBladeApi, Pane } from "tweakpane";

export enum Quality {
   LOW = 0.5,
   MEDIUM = 1,
   OPTIMAL = window.devicePixelRatio,
}

export function addQualityControl(
   pane: Pane,
   uniforms: Record<string, unknown>,
   renderer: WebGLRenderer
) {
   (
      pane.addBlade({
         view: "list",
         label: "quality",
         options: [
            { text: "low", value: Quality.LOW },
            { text: "medium", value: Quality.MEDIUM },
            { text: "optimal", value: Quality.OPTIMAL },
         ],
         value: window.innerWidth < 800 ? Quality.MEDIUM : Quality.OPTIMAL,
      }) as ListBladeApi<Quality>
   ).on("change", ({ value }) => {
      uniforms.uQuality = value;
      renderer.setSize(window.innerWidth * value, window.innerHeight * value);
   });
}
