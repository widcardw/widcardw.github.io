// from slidevjs/slidev

import { clearUndefined } from '@antfu/utils'
import mermaid from 'mermaid'
import { customAlphabet } from 'nanoid'

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

  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234', 10)

  const code_ = decodeURIComponent(code)
  const id = nanoid()
  const svg = mermaid.render(id, code_)
  cache.set(key, svg)
  return svg
}

export {
  renderMermaid,
}
