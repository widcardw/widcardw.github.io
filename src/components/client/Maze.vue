<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlStore } from '~/stores/gl'

const { seeds } = storeToRefs(useGlStore())
// code from https://www.bilibili.com/video/BV1ce411g7B2
const shaderCode = computed(() => `
  const float C = 0.707107;

  float noise(vec2 x) {
      return abs(fract(${seeds.value[0]} * sin(dot(x, vec2(${seeds.value[1]}, ${seeds.value[2]})))));
  }

  float line(vec2 p, float dir) {
      float d = dot(p, dir > 0.5 ? vec2(C, C) : vec2(-C, C));
      return smoothstep(0.02, 0., abs(d));
  }

  void main() {
      vec2 uv = 20. * (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
      uv += iTime / 5. * vec2(${parseFloat(seeds.value[0]) > 500 ? '1.' : '-1.'}, ${parseFloat(seeds.value[1]) > 497 ? '-1.' : '1.'});
      vec3 color = vec3(line(fract(uv) - .5, noise(floor(uv))));
      ${isDark.value ? 'vec3 c = mix(vec3(0.1), vec3(0.145), color)' : 'vec3 c = mix(vec3(1.0), vec3(0.94), color)'};
      gl_FragColor = vec4(c, 1.);
  }`)
</script>

<template>
  <div
    fixed left-0 right-0 top-0 bottom-0
    of-hidden w-1920px h-1080px
    z--999
  >
    <gl-canvas>
      <gl-program name="main" :code="shaderCode" />
    </gl-canvas>
  </div>
</template>
