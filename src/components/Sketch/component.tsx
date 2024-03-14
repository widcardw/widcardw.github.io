import { mergeProps } from "solid-js";
import type { Component } from 'solid-js'
import p5 from "p5";

const vs = `
    //standard vertex shader
    attribute vec3 aPosition;
     
    void main() {
      // Copy the position data into a vec4, adding 1.0 as the w parameter
      vec4 positionVec4 = vec4(aPosition, 1.0);
     
      // Scale to make the output fit the canvas
      positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
     
      // Send the vertex information on to the fragment shader
      gl_Position = positionVec4;
    }`;

const GlSketch: Component<{
  frag: string
  width: number
  height: number
  fixUV?: {
    enabled: boolean
    ratio: number
    mouse: boolean
  }
}> = (props) => {
  const mp = mergeProps({ width: 200, height: 200 }, props)
  const deviceRatio = window.devicePixelRatio
  mp.frag = `#ifdef GL_ES
    precision mediump float;
    #endif
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    ${mp.fixUV?.enabled
      ? `float ratio = ${mp.fixUV.ratio.toFixed(3)};
         vec2 fixUV(in vec2 c) {
           return ratio * (c - ${(deviceRatio / 2).toFixed(2)} * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
         }`
      : ''}
    ${mp.fixUV?.enabled && mp.fixUV.mouse
      ? `vec2 fixMouse(in vec2 c) {
           return (vec2(ratio * 2. * c.x - u_resolution.x, - ratio * 2. * c.y + ${(2 * mp.fixUV.ratio - 1).toFixed(3)} * u_resolution.y)) / min(u_resolution.x, u_resolution.y);
         }`
      : ''}
    ${mp.frag}`
  const createSketch = (ref: HTMLElement) => {
    let sd: p5.Shader
    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(mp.width, mp.height, p.WEBGL)
        canvas.parent(ref)
        canvas.style('visibility:visible')
        p.background(0);
        p.noStroke();
        sd = p.createShader(vs, mp.frag)
      }
      p.draw = () => {
        sd.setUniform('u_resolution', [mp.width, mp.height]);
        sd.setUniform('u_time', p.frameCount * .01);
        if (p.mouseIsPressed) {
          sd.setUniform('u_mouse', [p.pmouseX, p.pmouseY])
        }
        p.shader(sd);
        p.rect(0, 0, 400, 400);
      }
    }
    new p5(sketch)
  }
  return <div ref={createSketch} />
}

export {
  GlSketch as Sketch
}