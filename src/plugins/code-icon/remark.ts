import { visit } from 'unist-util-visit'
import type { BuildVisitor } from 'unist-util-visit'
import type { Root, InlineCode, BlockContent } from 'mdast'

import { makeComponentNode } from '../../components/utils/makeComponent'

function visitBlock(ast: Root) {
  const visitor: BuildVisitor<Root, 'inlineCode'> = (node, index, parent) => {
    if (!node) return
    if (parent === null || index === null) return
    const { value } = node
    if (!value.startsWith('/ico')) return
    const match = value.match(/^\/ico (.*?);(.+)$/)
    if (!match) return
    let [, iconName, fileName] = match
    if (!iconName || iconName.trim() === '')
      iconName = 'vscode-icons:default-file'
    const newNode = makeComponentNode(
      'span',
      { attributes: { className: 'code-icon' } },
      makeComponentNode('Icon', { attributes: { name: iconName } }),
      makeComponentNode(
        'span',
        { attributes: { className: 'code-icon-text' } },
        { type: 'text', value: fileName } as any,
      ),
    )
    parent?.children.splice(Number(index), 1, newNode)
  }
  return visit(ast, 'inlineCode', visitor)
}

export function remarkCodeIcon() {
  return function transformer(ast: Root, vFile: any, next: any) {
    visitBlock(ast)
    if (typeof next === 'function') return next(null, ast, vFile)
    return ast
  }
}
