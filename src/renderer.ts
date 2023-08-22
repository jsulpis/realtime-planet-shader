import {
   WebGLRenderer,
   PerspectiveCamera,
   Material,
   Geometry,
   Mesh,
} from "four";

function flatten<T>(array: T[][]): T[] {
   return array.reduce((acc, val) => acc.concat(val), []);
}

export function useGlslCanvas(...args: ConstructorParameters<typeof Material>) {
   const renderer = new WebGLRenderer({
      canvas: document.querySelector("canvas"),
   });
   renderer.setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
   );

   const camera = new PerspectiveCamera();

   const material = new Material(...args);

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

   function raf(callback: Function) {
      rafCallbacks.push(callback);
   }

   requestAnimationFrame(function animate() {
      requestAnimationFrame(animate);

      rafCallbacks.forEach((callback) => callback());

      mesh.material.uniforms.uTime = performance.now() / 1000;

      renderer.render(mesh, camera);
   });

   window.addEventListener("resize", () => {
      renderer.setSize(
         window.innerWidth * window.devicePixelRatio,
         window.innerHeight * window.devicePixelRatio
      );
      mesh.material.uniforms.uResolution = [
         window.innerWidth * window.devicePixelRatio,
         window.innerHeight * window.devicePixelRatio,
      ];
   });

   return { renderer, raf, uniforms: mesh.material.uniforms };
}
