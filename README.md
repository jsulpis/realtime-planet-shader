# Realtime planet shader in WebGL

## Procedural

<div align="center">
  <img src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/procedural-ui.jpg" alt="screenshot of the procedural shader" />

  <br/>
  <br/>
  
  <a href="https://jsulpis.github.io/realtime-planet-shader/procedural">live demo</a>
</div>

<br/>

This is a GLSL fragment shader I originally made on [Shadertoy](https://www.shadertoy.com/view/Ds3XRl) when learning raymarching. Later I switched to analytic raycasting for better performance. It's made by raycasting simple spheres with a bunch of fbm noises used for the normals and colors, and a complete hack for the atmosphere.

I wanted to display it on a web page so that I can make a nice GUI to tweak some uniforms. Here it is !

It runs at 60fps on my old low-end phone, so it should also be quite smooth on whatever device you have.

<br/>

## Textures

<div align="center">
  <img src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/earth-ui.jpg" alt="screenshot of the earth shader" />

  <br/>
  <br/>
  
  <a href="https://jsulpis.github.io/realtime-planet-shader/earth">live demo</a>
</div>

<br/>

This one uses textures (colors, specular, bump) borrowed and adapted from NASA [Visible Earth](https://visibleearth.nasa.gov/collection/1484/blue-marble) collection in order to render a realistic view of our home planet. Still with a few controls, and no quality setting because it should already run at full fps on most devices.

## Note

If you want a minimalist setup to render GLSL shaders on a canvas like this one, you can check out the [little study](https://github.com/jsulpis/webgl-libs-comparison) I made before this project.

## More samples

<div>
  <img height="200" alt="screenshot with different settings" src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/earth-1.jpg">
  <img height="200" alt="screenshot with different settings" src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/procedural-1.jpg">
  <img height="200" alt="screenshot with different settings" src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/procedural-2.jpg">
  <img height="200" alt="screenshot with different settings" src="https://raw.githubusercontent.com/jsulpis/realtime-planet-shader/main/screenshots/procedural-3.jpg">
</div>
