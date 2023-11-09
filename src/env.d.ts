/// <reference types="astro/client" />

declare module "*.glsl" {
   const shaderSource: string;
   export default shaderSource;
}
