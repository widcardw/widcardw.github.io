function mermaidPlugin(md: markdownit) {
  const temp = md.renderer.rules.fence?.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index]

    if (token.info.trim() === 'mermaid') {
      try {
        const content = token.content.trim()
        return `<Mermaid code="${encodeURIComponent(
              content,
            )}"></Mermaid>`
      }
      catch (err) {
        return `<pre>${err}</pre>`
      }
    }
    return temp?.(tokens, index, options, env, slf) || ''
  }
}

export {
  mermaidPlugin,
}
