interface DoubleBracketMedia {
  /**
   * Remove the prefix of the url in double brackets
   */
  removePrefix?: string
  /**
   * After removing the provided prefix, param `addPrefix` will be added to the front of url
   */
  addPrefix?: string
}

export default function (md: markdownit, options: DoubleBracketMedia = {}) {
  md.block.ruler.before('paragraph', 'dbm', (state, startLine: number) => {
    let token
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    const ch = state.src.charCodeAt(pos)

    if (ch !== 0x21 || pos >= max)
      return false

    const text = state.src.substring(pos, max)

    const regex = new RegExp(`^!\\[\\[${options.removePrefix || ''}(.*?)\\]\\]`)

    const match = text.match(regex)

    if (match && match.length) {
      let media = match[1]

      if (options.addPrefix)
        media = options.addPrefix + media

      if (!media.match(/(.+?)\.([A-Za-z0-9]{1,4})/))
        return false

      let result = ''

      if (media.endsWith('.mp4') || media.endsWith('.webm'))
        result = `<video controls="controls" src="/${media}" style="width: 100%; height: 100%;"></video>`

      else if (media.endsWith('.mp3'))
        result = `<audio controls="controls" src="/${media}"></audio>`

      else
        result = `![${media}](/${media})`

      // markdown it 的处理操作
      token = state.push('paragraph_open', 'p', 1)
      token.markup = '@'
      token.map = [startLine, state.line]

      token = state.push('inline', '', 0)
      token.content = result
      token.map = [startLine, state.line]
      token.children = []

      token = state.push('paragraph_close', 'p', -1)
      token.markup = '@'

      state.line = startLine + 1
      return true
    }

    return false
  })
}
