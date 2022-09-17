import { encode } from 'js-base64'
import type Renderer from 'markdown-it/lib/renderer'

const mermaidRenderer: Renderer.RenderRule = (tokens, index) => {
  const token = tokens[index]
  const { content } = token

  return `<Mermaid code="${encode(
    content,
  )}"></Mermaid>`
}

function mermaidPlugin(md: markdownit) {
  const fence = md.renderer.rules.fence?.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]

    if (token.info.trim() === 'mermaid') {
      try {
        return mermaidRenderer(tokens, index, options, env, slf)
      }
      catch (err) {
        return `<pre>${err}</pre>`
      }
    }
    return fence!(tokens, index, options, env, slf) || ''
  }

  md.renderer.rules.mermaid = mermaidRenderer
}

export {
  mermaidPlugin,
}
