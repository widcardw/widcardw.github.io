import {
  createSignal,
  type Component,
  onMount,
  Show,
  createEffect,
  onCleanup,
} from 'solid-js'
import { realTheme } from '../dark/ThemeToggle'

interface GiscusProps {
  id: string
  term: string
  repo: string
  repoId: string
  category: string
  categoryId: string
  mapping: string
  reactionsEnabled: string
  emitMetadata: string
  inputPosition: 'top' | 'bottom'
  lang: string
  loading: string
}

const GiscusArea: Component<GiscusProps> = (props) => {
  const [mounted, setMounted] = createSignal(false)
  createEffect(() => {
    if (mounted()) return
    import('giscus')
    setMounted(true)
  })

  const [target, setTarget] = createSignal<HTMLDivElement>()
  const [visible, setVisible] = createSignal(false)

  const observerCb: IntersectionObserverCallback = (entries) => {
    if (visible()) return
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setVisible(true)
        break
      }
    }
  }

  const observer = new IntersectionObserver(observerCb)

  onMount(() => observer.observe(target()!))

  onCleanup(() => observer.disconnect())

  return (
    <>
      <div
        ref={(r) => setTarget(r)}
        style={{ margin: '4rem auto', 'max-width': '15rem' }}
      />
      <Show when={mounted() && visible()}>
        {/* @ts-expect-error giscus web component type error */}
        <giscus-widget
          id={props.id}
          term={props.term}
          repo={props.repo}
          repo-id={props.repoId}
          category={props.category}
          category-id={props.categoryId}
          mapping={props.mapping}
          reactions-enabled={props.reactionsEnabled}
          emit-metadata={props.emitMetadata}
          input-position={props.inputPosition}
          lang={props.lang}
          loading={props.loading}
          theme={realTheme()}
        />
      </Show>
    </>
  )
}

export { GiscusArea }

export type { GiscusProps }
