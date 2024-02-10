import { visit } from 'unist-util-visit'
import type { BuildVisitor } from 'unist-util-visit'
import type { BlockContent, Root, Parent } from 'mdast'
import type { AstroIntegration } from 'astro';
import { makeComponentNode } from '../../components/utils/makeComponent';

export const P5GlSketchTagname = 'AutoImportedP5GlSketch'
export const sketchAutoImport: Record<string, [string, string][]> = {
  '~/components/Sketch/index.astro': [['default', P5GlSketchTagname]],
};

function visitBlock(ast: Root) {
  const visitor: BuildVisitor<Root, 'code'> = (node, index, parent) => {
    if (!node) return
    if (parent === null || index === null) return
    const { lang, meta, value } = node
    if (lang !== 'glsl' || !meta?.startsWith('preview')) return
    let width = 0, height = 0
    meta.replace(/w=(\d+) h=(\d+)/, (_, w: string, h: string) => {
      width = Number(w)
      height = Number(h)
      if (Number.isNaN(width) || Number.isNaN(height)) {
        console.warn('canvas width or height is not number')
        width = 200
        height = 200
      }
      return ''
    })
    let ratio = -1
    meta.replace(/fixUV=(\d+(\.\d+)?)/, (_, r: string) => {
      ratio = Number(r)
      return ''
    })
    let enableMouse = false
    meta.replace(/mouse/, () => {
      enableMouse = true
      return ''
    })
    let showSourceCode = false
    meta.replace(/showSourceCode/, () => {
      showSourceCode = true
      return ''
    })
    const newNode = makeComponentNode(
      P5GlSketchTagname,
      {
        attributes: {
          frag: value,
          width, height,
          fixUVenabled: ratio !== -1,
          fixUVratio: ratio,
          enableMouse,
          showSourceCode,
        }
      },
      node
    )
    parent?.children.splice(Number(index), 1, newNode)
  }
  return visit(ast, 'code', visitor)
}

export function remarkTransformGlSketch() {
  return function transformer(ast: Root, vFile: any, next: any) {
    visitBlock(ast)
    if (typeof next === 'function')
      return next(null, ast, vFile)
    return ast
  }
}

export function astroGlSketch(): AstroIntegration {
  return {
    name: '@astrojs/asides',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkTransformGlSketch],
          },
        });
      },
    },
  };
}

