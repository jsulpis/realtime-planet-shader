import type { SamplerOptions } from "four";

export type TextureData = {
   path: string;
   width?: number;
   height?: number;
   options?: Partial<SamplerOptions>;
};
