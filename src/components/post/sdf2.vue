<script setup lang="ts">
import { useGlStore } from '~/stores/gl'

const code = computed(() => `
vec2 fixUV(in vec2 c) {
    return 1.5 * (2. * c - iResolution.xy) / min(iResolution.x, iResolution.y);
}

float grid(vec2 uv) {
    return float(floor(mod(uv, 2.).x) == floor(mod(uv, 2.).y));
}

float sdfCircle(vec2 coord, vec2 pos, float radius) {
  return radius - length(coord - pos);
}

void main() {
    vec3 color = vec3(${isDark.value ? '0.' : '0.7'});
    vec2 uv = fixUV(gl_FragCoord.xy);
    color = mix(color, vec3(${isDark.value ? '0.1' : '0.4'}), grid(uv));
    float f = smoothstep(0., fwidth(uv.x), sdfCircle(uv, vec2(0.), 1.));
    color = mix(color, vec3(1.), f);

    gl_FragColor = vec4(color, 1.);
}
`)

const useGl = useGlStore()
</script>

<template>
  <ClientOnly v-if="useGl.isLoaded">
    <GlArea name="main" :width="400" :height="300" :code="code" />
  </ClientOnly>
</template>

