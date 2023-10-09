import { CustomUniforms } from "../settings/uniforms";

export function addPointerControls(
   canvas: HTMLCanvasElement,
   uniforms: CustomUniforms
) {
   let lastPointerPos = 0;

   function updateRotationOffset(e: PointerEvent | TouchEvent) {
      const clientX = getClientX(e);
      const multiplier = 10 / Math.max(window.innerWidth, window.innerHeight); // don't really know why this works, but it does

      uniforms.uRotationOffset += (clientX - lastPointerPos) * multiplier;;

      lastPointerPos = clientX;
   }

   canvas.addEventListener("pointerdown", (e: PointerEvent | TouchEvent) => {
      canvas.classList.add("grabbing");
      lastPointerPos = getClientX(e);

      canvas.addEventListener("pointermove", updateRotationOffset);

      canvas.addEventListener("pointerup", () => {
         canvas.classList.remove("grabbing");
         canvas.removeEventListener("pointermove", updateRotationOffset);
      });
   });
}

function getClientX(e: PointerEvent | TouchEvent) {
   return "touches" in e ? e.touches[0].clientX : e.clientX;
}
