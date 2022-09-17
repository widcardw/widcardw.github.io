// from slidevjs/slidev

import { clearUndefined } from '@antfu/utils'
import { decode } from 'js-base64'
// @ts-expect-error delaration
import mermaid from 'mermaid/dist/mermaid.js'
// import { nanoid } from 'nanoid'

mermaid.startOnLoad = false
mermaid.initialize({ startOnLoad: false })

const cache = new Map<string, string>()

function renderMermaid(code: string, options: any) {
  const key = code + JSON.stringify(options)
  const cache_ = cache.get(key)
  if (cache_)
    return cache_
  mermaid.initialize({
    startOnLoad: false,
    ...clearUndefined(options),
  })

  const rand = Math.sin(Math.random() * 114514 + new Date().getMilliseconds()).toString().slice(3)

  const code_ = decode(code)
  const id = `mermaid-${rand}`
  const svg = mermaid.render(id, code_)
  cache.set(key, svg)
  return svg
}

export {
  renderMermaid,
}
