import { Sampler, SamplerOptions, Texture } from "four";

/**
 * 3D texture file borrowed from Shadertoy
 */
export async function load3DNoiseTexture(gl: WebGL2RenderingContext) {
   const response = await fetch("/realtime-planet-shader/3DNoise.bin");
   const binaryData = await response.arrayBuffer();
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

export async function loadImageTexture(
   url: string,
   width: number,
   height: number,
   samplerOptions?: Partial<SamplerOptions>
) {
   const imageData = await fetch(url);
   const imageBlob = await imageData.blob();
   const bitmap = await createImageBitmap(imageBlob, 0, 0, width, height, {
      imageOrientation: "flipY",
   });

   return new Texture(
      bitmap,
      new Sampler({
         wrapS: "repeat",
         wrapT: "repeat",
         ...samplerOptions,
      })
   );
}
