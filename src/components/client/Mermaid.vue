<!-- from slidevjs/slidev -->

<script setup lang="ts">
import { renderMermaid } from '~/composables/modules/setupMermaid'

const props = defineProps<{
  code: string
  scale?: number
  theme?: string
}>()
const vm = getCurrentInstance()
const el = ref<ShadowRoot>()
const svg = ref('')
const inited = ref(false)

function mf() {
  svg.value = renderMermaid(props.code || '', {
    theme: props.theme || (isDark.value ? 'dark' : undefined),
    ...vm?.attrs,
  })
  return svg.value
}

onMounted(() => {
  mf()
  inited.value = true
})

const html = computed(() => inited.value ? mf() : '')

const actualHeight = ref<number>()

watch(html, () => {
  actualHeight.value = undefined
})

watchEffect(() => {
  const svgEl = el.value?.children?.[0] as SVGElement | undefined
  if (svgEl && svgEl.hasAttribute('viewBox') && actualHeight.value == null) {
    const v = parseFloat(svgEl.getAttribute('viewBox')?.split(' ')[3] || '')
    actualHeight.value = isNaN(v) ? undefined : v
  }
}, { flush: 'post' })

watchEffect(() => {
  const svgEl = el.value?.children?.[0] as SVGElement | undefined
  if (svgEl != null && props.scale != null && actualHeight.value != null) {
    svgEl.setAttribute('height', `${actualHeight.value * props.scale}`)
    svgEl.removeAttribute('width')
    svgEl.removeAttribute('style')
  }
}, { flush: 'post' })
</script>

<template>
  <div ref="el" v-html="html" />
</template>
