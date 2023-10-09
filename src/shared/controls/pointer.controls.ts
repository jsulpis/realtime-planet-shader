import { CustomUniforms } from "../settings/uniforms";

export function addPointerControls(
   canvas: HTMLCanvasElement,
   uniforms: CustomUniforms
) {
   const decay = 0.95;
   const speedMultiplier = 4 / Math.max(window.innerWidth, window.innerHeight); // don't really know why this works, but it does

   let lastPointerPos = 0;
   let velocity = 0;
   let previousTime = 0;
   let deltaTime = 0;

   function updateRotationOffset(e: PointerEvent | TouchEvent) {
      const clientX = getClientX(e);

      const currentTime = Date.now();
      deltaTime = currentTime - previousTime;
      const deltaPos = clientX - lastPointerPos;
      velocity = deltaPos / deltaTime;

      uniforms.uRotationOffset += deltaPos * speedMultiplier;

      lastPointerPos = clientX;
      previousTime = currentTime;
   }

   function applyInertia() {
      if (Math.abs(velocity) < 0.01) {
         return;
      }

      velocity *= decay;
      const deltaPos = velocity * deltaTime;

      uniforms.uRotationOffset += deltaPos * speedMultiplier;
      window.requestAnimationFrame(applyInertia);
   }

   canvas.addEventListener("pointerdown", (e: PointerEvent | TouchEvent) => {
      canvas.classList.add("grabbing");
      lastPointerPos = getClientX(e);
      previousTime = Date.now();

      canvas.addEventListener("pointermove", updateRotationOffset);

      canvas.addEventListener(
         "pointerup",
         () => {
            canvas.classList.remove("grabbing");
            canvas.removeEventListener("pointermove", updateRotationOffset);
            applyInertia();
         },
         { once: true }
      );
   });
}

function getClientX(e: PointerEvent | TouchEvent) {
   return "touches" in e ? e.touches[0].clientX : e.clientX;
}
