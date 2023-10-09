import { CustomUniforms } from "../settings/uniforms";

export function addPointerControls(
   canvas: HTMLCanvasElement,
   uniforms: CustomUniforms
) {
   function updatePlanetPosition(e: PointerEvent | TouchEvent) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const multiplier = 10 / Math.max(window.innerWidth, window.innerHeight); // don't really know why this works, but it does

      const posX = (clientX - canvas.clientWidth / 2) * multiplier;
      const posY = -1 * (clientY - canvas.clientHeight / 2) * multiplier;

      uniforms.uPlanetPosition = [posX, posY, 0];
   }

   canvas.addEventListener("pointerdown", (e) => {
      canvas.classList.add("grabbing");
      updatePlanetPosition(e);

      canvas.addEventListener("pointermove", updatePlanetPosition);

      canvas.addEventListener("pointerup", () => {
         canvas.classList.remove("grabbing");
         canvas.removeEventListener("pointermove", updatePlanetPosition);
      });
   });
}
