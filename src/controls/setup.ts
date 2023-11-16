import type { WebGLRenderer } from "four";
import type { CustomUniforms } from "../webgl/settings/uniforms";
import { addLightControls } from "./light.controls";
import { addMonitor } from "./monitor.controls";
import { addPlanetControls } from "./planet.controls";
import { addQualityControl } from "./quality.controls";
import { addRotationControls } from "./rotation.controls";
import type { Quality } from "../webgl/settings/quality";

export type ControlsOptions = {
   expanded?: boolean;
   quality?: boolean;
   planet?: {
      geometry?: boolean;
      terrain?: boolean;
      clouds?: boolean;
   };
};

export async function setupControls(
   {
      canvas,
      uniforms,
      renderer,
      defaultQuality,
   }: {
      canvas: HTMLCanvasElement;
      uniforms: CustomUniforms;
      renderer?: WebGLRenderer;
      defaultQuality?: Quality;
   },
   options?: ControlsOptions
) {
   const { Pane } = await import("tweakpane");

   const pane = new Pane({
      title: "Controls",
      expanded: options?.expanded === true,
   });

   if (options?.quality && renderer && defaultQuality) {
      addQualityControl(pane, uniforms, renderer, defaultQuality);
   }
   addRotationControls(pane, uniforms, canvas);
   addPlanetControls(pane, uniforms, options?.planet);
   addLightControls(pane, uniforms);
   addMonitor(pane);
}
