import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

const SupAnchor: MarkdownIt.PluginWithOptions = (md, options: {
  prefix?: string
} = { prefix: '^' }) => {
  md.inline.ruler.after('escape', 'sup-to-anchor', (state, silent) => {
    if (state.pos + 1 >= state.posMax)
      return false

    const prefix = options.prefix || '^'
    if (state.src.slice(0, prefix.length) !== prefix)
      return false

    if (state.src.length === prefix.length)
      return false

    if (!silent) {
      const anchor = encodeURIComponent(state.src.slice(prefix.length))
      let token: Token = state.push('paragraph_open', 'div', 1)
      token.attrPush(['id', anchor])

      token = state.push('paragraph_close', 'div', -1)

      state.pos += state.src.length

      return true
    }
    return false
  })
}

export {
  SupAnchor,
}
