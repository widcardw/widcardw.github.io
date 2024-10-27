import type { Component } from 'solid-js'
import { Match, Switch, createEffect, createSignal, on, onMount } from 'solid-js'
import './ThemeToggleButton.css'
import { makePersisted } from '@solid-primitives/storage'

const icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6ZM5.394 6.813L6.81 5.399l3.505 3.506L8.9 10.319zM2 15.005h5v2H2zm3.394 10.193L8.9 21.692l1.414 1.414l-3.505 3.506zM15 25.005h2v5h-2zm6.687-1.9l1.414-1.414l3.506 3.506l-1.414 1.414zm3.313-8.1h5v2h-5zm-3.313-6.101l3.506-3.506l1.414 1.414l-3.506 3.506zM15 2.005h2v5h-2z"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3Z"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <path
      fill="currentColor"
      d="M15 2h2v3h-2zm12 13h3v2h-3zM15 27h2v3h-2zM2 15h3v2H2zm3.45-8.117L6.864 5.47l2.122 2.12L7.57 9.004zM23 7.581l2.12-2.121l1.414 1.414l-2.121 2.122zm.002 16.835l1.414-1.414l2.122 2.122l-1.414 1.414zM5.47 25.13L7.59 23L9 24.42l-2.12 2.12l-1.41-1.41zM16 8a8 8 0 1 0 8 8a8 8 0 0 0-8-8zm0 14a6 6 0 0 1 0-12z"
    />
  </svg>,
]

/**
 * light
 * dark
 * auto
 */

const [theme, setTheme] = makePersisted(
  createSignal(
    (() => {
      if (import.meta.env.SSR) return undefined

      // if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      //   return 'dark'

      return 'auto'
    })(),
  ),
  { name: 'storage-theme' },
)

const [realTheme, setRealTheme] = createSignal('light')

const ThemeToggle: Component = () => {
  onMount(() => {
    const root = document.documentElement
    createEffect(on(theme, () => {
      if (theme() === 'dark') {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
        setRealTheme('dark')
      } else if (theme() === 'light') {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
        setRealTheme('light')
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
          root.setAttribute('data-theme', 'dark')
          setRealTheme('dark')
        } else {
          root.classList.remove('dark')
          root.setAttribute('data-theme', 'light')
          setRealTheme('light')
        }
      }
    }))

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (theme() === 'auto') {
          if (e.matches) {
            root.classList.add('dark')
            root.setAttribute('data-theme', 'dark')
            setRealTheme('dark')
          } else {
            root.classList.remove('dark')
            root.setAttribute('data-theme', 'light')
            setRealTheme('light')
          }
        }
      })
  })

  function toggleDark() {
    if (theme() === 'light') {
      setTheme('dark')
    } else if (theme() === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }

  function cycleTheme(event: MouseEvent) {
    // toggleDark()
    
    const x = event?.clientX ?? window.innerWidth
    const y = event?.clientY ?? 0

    const transition = document.startViewTransition(() => {
      toggleDark()
    })
  
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    void transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: realTheme() === 'dark' ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: realTheme() === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    })
  }

  return (
    <div class="theme-toggle" onClick={cycleTheme}>
      <Switch>
        <Match when={theme() === 'light'}>{icons[0]}</Match>
        <Match when={theme() === 'dark'}>{icons[1]}</Match>
        <Match when={theme() === 'auto'}>{icons[2]}</Match>
      </Switch>
    </div>
  )
}

export default ThemeToggle

export { theme as colorTheme }
export { realTheme }