import topLevelAwait from "vite-plugin-top-level-await";
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
   base: "/realtime-planet-shader",
   root: "src",
   plugins: [glsl(), topLevelAwait()], // top-level await present in the "four" library
   build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
         input: {
            earth: resolve(__dirname, "src/earth/index.html"),
            procedural: resolve(__dirname, "src/procedural/index.html"),
         },
      },
   },
});
