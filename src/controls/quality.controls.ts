import { WebGLRenderer } from "four";
import { ListBladeApi, Pane } from "tweakpane";
import { Quality, defaultQuality } from "../webgl/settings/quality";
import type { CustomUniforms } from "../webgl/settings/uniforms";

export function addQualityControl(
   pane: Pane,
   uniforms: CustomUniforms,
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
         value: defaultQuality,
      }) as ListBladeApi<Quality>
   ).on("change", ({ value }) => {
      uniforms.uQuality = value;
      renderer.setSize(window.innerWidth * value, window.innerHeight * value);
   });
}
export { Quality };
