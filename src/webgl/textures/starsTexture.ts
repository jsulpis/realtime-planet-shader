import type { TextureData } from "../loaders/texture.types";
import { isPhone } from "../settings/device";

export const starsTexture: TextureData = isPhone
   ? {
        path: "4k_stars.jpg",
        width: 4096,
        height: 2048,
        options: { minFilter: "linearMipmapLinear" },
     }
   : {
        path: "8k_stars.jpg",
        width: 8192,
        height: 4096,
        options: { minFilter: "linearMipmapLinear" },
     };
