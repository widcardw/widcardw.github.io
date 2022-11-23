import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

const FileIconPlugin: MarkdownIt.PluginWithOptions = (md, options: {
  prefix?: string
} = { prefix: '' }) => {
  md.inline.ruler.after('escape', 'file_icon', (state, silent) => {
    if (state.pos + 1 >= state.posMax)
      return false
    const prefix = options.prefix || ''

    if (state.src.slice(state.pos, state.pos + 1 + prefix.length) !== `\`${prefix}`)
      return false

    const start = state.pos + 1 + prefix.length

    let match = start
    let pos: number
    let token: Token

    // borrowed from markdown-it-katex
    // eslint-disable-next-line no-cond-assign
    while ((match = state.src.indexOf('`', match)) !== -1) {
      pos = match - 1
      while (state.src[pos] === '\\') pos -= 1

      // Even number of escapes, potential closing delimiter found
      if ((match - pos) % 2 === 1)
        break

      match += 1
    }

    // does not match
    if (match === -1) {
      if (!silent)
        state.pending += '`'

      state.pos = start

      return false
    }

    // render inline
    if (!silent) {
      const content = state.src.slice(start, match).trim()

      const [icon, name] = content.split(';').map(s => s.trim())

      if (!name)
        throw new Error('No name!')

      // push token `am_inline` into token stream
      // which is schedule to be processed by the rule `am_inline`
      token = state.push('file_icon_func', 'file-icon', 0)
      token.attrPush(['icon', icon])
      token.attrPush(['name', name])
      token.markup = '`'
    }

    // process offset
    state.pos = match + 1

    return true
  })

  md.renderer.rules.file_icon_func = (tokens, idx) => {
    const icon = tokens[idx].attrGet('icon') as string
    const name = tokens[idx].attrGet('name') as string
    let res = `<FileName name="${name}" `
    if (icon.trim())
      res += `icon="${icon}" `

    res += '/>'

    return res
  }
}

export default FileIconPlugin
