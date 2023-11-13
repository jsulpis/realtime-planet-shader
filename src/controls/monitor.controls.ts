import type { Pane } from "tweakpane";

export function addMonitor(pane: Pane) {
   const monitorFolder = pane.addFolder({
      title: "Monitor",
      expanded: false,
   });

   const fps = { value: 0 };

   monitorFolder.addBinding(fps, "value", {
      label: "FPS",
      readonly: true,
   });
   monitorFolder.addBinding(fps, "value", {
      label: "",
      readonly: true,
      view: "graph",
      min: 0,
      max: 120,
   });

   let deltaMs = 0;
   let frameIndex = 1;
   let frameMeasure;
   const frameWindowSize = 100;

   performance.mark("previous-frame");

   requestAnimationFrame(function loop() {
      requestAnimationFrame(loop);

      // Measure duration of frame window
      if (frameIndex++ !== frameWindowSize) {
         return;
      }

      frameIndex = 1;
      performance.mark("current-frame");
      frameMeasure = performance.measure(
         "duration",
         "previous-frame",
         "current-frame"
      );
      performance.mark("previous-frame");

      deltaMs = frameMeasure.duration / frameWindowSize;
      fps.value = Math.floor(1 / ((deltaMs || Infinity) / 1000));
   });
}
