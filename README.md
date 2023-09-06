# Realtime procedural planet shader in WebGL

<img src="https://github.com/jsulpis/shader-planet/assets/22420399/033dbfc3-aafa-4448-af63-c79b427659a8" alt="screenshot of the shader" />

<br/>
<br/>

<span align="center">
  
  [live demo](https://jsulpis.github.io/shader-planet/)

</span>

<br/>

This is a GLSL fragment shader I originally made on [Shadertoy](https://www.shadertoy.com/view/Ds3XRl) when learning raymarching. Later I switched to analytic raycasting for better performance. It's made by raycasting simple spheres with a bunch of fbm noises used for the normals and colors, and a complete hack for the atmosphere.

I wanted to display it on a web page so that I can make a nice GUI to tweak some uniforms. Here it is !

It runs at 60fps on my old low-end phone, so it should also be quite smooth on whatever device you have.

<br/>

> [!NOTE]
> If you want some guidance to render GLSL shaders on a canvas like this one, you can check out the [little study](https://github.com/jsulpis/webgl-libs-comparison) I made before this project.

<br/>

More samples:

<img width="250" alt="screenshot with different settings" src="https://github.com/jsulpis/shader-planet/assets/22420399/1b0343c1-727e-47e3-aa03-81fe84d6a6bc">
<img width="250" alt="screenshot with different settings" src="https://github.com/jsulpis/shader-planet/assets/22420399/31b4d3f9-30b4-458d-90bf-ea63c2d052b0">
<img width="250" alt="screenshot with different settings" src="https://github.com/jsulpis/shader-planet/assets/22420399/4a9aef98-61cf-4bd2-bdb4-fc9deea144a2">
