/**
 * 3D texture file borrowed from Shadertoy
 */
export async function load3DNoiseTexture(canvas: HTMLCanvasElement) {
   const response = await fetch("/shader-planet/3DNoise.bin");
   const binaryData = await response.arrayBuffer();

   const gl = canvas.getContext("webgl2");
   const volumeTexture = gl.createTexture();

   gl.bindTexture(gl.TEXTURE_3D, volumeTexture);
   gl.texImage3D(
      gl.TEXTURE_3D,
      0,
      gl.R8,
      32,
      32,
      32,
      0,
      gl.RED,
      gl.UNSIGNED_BYTE,
      new Uint8Array(binaryData)
   );
   gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
