import {
   WebGLRenderer,
   PerspectiveCamera,
   Material,
   Geometry,
   Mesh,
} from "four";
import type { CustomUniforms } from "./settings/uniforms";

function flatten<T>(array: T[][]): T[] {
   return array.reduce((acc, val) => acc.concat(val), []);
}

type MaterialOptions = ConstructorParameters<typeof Material>[0];
type Args = MaterialOptions & { canvas?: HTMLCanvasElement };

export function useGlslCanvas({ canvas: canvasArg, ...materialOptions }: Args) {
   let canvas = canvasArg ?? document.querySelector("canvas")!;

   const renderer = new WebGLRenderer({ canvas });
   renderer.setSize(
      window.innerWidth * (materialOptions?.uniforms?.uQuality as number),
      window.innerHeight * (materialOptions?.uniforms?.uQuality as number)
   );

   const camera = new PerspectiveCamera();

   const material = new Material(materialOptions);

   const geometry = new Geometry({
      position: {
         size: 3,
         data: new Float32Array(
            flatten([
               [0, 0, 0],
               [1, 0, 0],
               [0, 1, 0],
               [0, 1, 0],
               [1, 0, 0],
               [1, 1, 0],
            ])
         ),
      },
   });

   const mesh = new Mesh(geometry, material);

   const rafCallbacks: Function[] = [];

   /**
    * Usage:
    * ```javascript
    * raf(() => {
    *   // do something at each frame
    * })
    * ```
    * @param callback function to execute at each frame
    */
   function raf(callback: Function) {
      rafCallbacks.push(callback);
   }

   const uniforms = mesh.material.uniforms;

   requestAnimationFrame(function animate() {
      requestAnimationFrame(animate);

      rafCallbacks.forEach((callback) => callback());

      (uniforms.uTime as number) += (uniforms.uRotationSpeed as number) * 0.01;

      renderer.render(mesh, camera);
   });

   window.addEventListener("resize", () => {
      const quality = mesh.material.uniforms.uQuality as number;
      renderer.setSize(
         window.innerWidth * quality,
         window.innerHeight * quality
      );
      mesh.material.uniforms.uResolution = [
         window.innerWidth,
         window.innerHeight,
      ];
   });

   canvas.classList.add("loaded");

   return {
      renderer,
      raf,
      uniforms: mesh.material.uniforms as CustomUniforms,
      canvas,
   };
}
