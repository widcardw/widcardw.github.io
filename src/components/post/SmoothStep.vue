<script setup lang="ts">
import { useGlStore } from '~/stores/gl'

const code = computed(() => `
vec2 fixUV(in vec2 c) {
    return 1. * (2. * c - iResolution.xy) / min(iResolution.x, iResolution.y) + vec2(0., 0.5);
}

float grid(vec2 uv) {
    return float(floor(mod(uv, 2.).x) == floor(mod(uv, 2.).y));
}

float plot(vec2 uv) {
    return smoothstep(fwidth(uv.x) * 2., 0., abs(uv.y - smoothstep(0., 1., uv.x)));
}

void main() {
    vec3 color = vec3(${isDark.value ? '0.' : '1.'});
    vec2 uv = fixUV(gl_FragCoord.xy);
    color = mix(color, vec3(${isDark.value ? '0.1' : '0.9'}), grid(uv));
    color = mix(color, vec3(1., 0., 0.), plot(uv));

    gl_FragColor = vec4(color, 1.);
}
`)

const useGl = useGlStore()
</script>

<template>
  <ClientOnly v-if="useGl.isLoaded">
    <GlArea name="main" :width="500" :height="100" :code="code" />
  </ClientOnly>
</template>
