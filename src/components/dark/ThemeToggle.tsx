import type { Component } from 'solid-js'
import { Show, createEffect, createSignal, onMount } from 'solid-js'
import './ThemeToggleButton.css'
import { makePersisted } from '@solid-primitives/storage'

const icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <title>Light Mode</title>
    <path
      fill-rule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clip-rule="evenodd"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <title>Dark Mode</title>
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>,
]

const [theme, setTheme] = makePersisted(
  createSignal(
    (() => {
      if (import.meta.env.SSR) return undefined

      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark'

      return 'light'
    })(),
  ),
  { name: 'storage-theme' },
)

const ThemeToggle: Component = () => {
  onMount(() => {
    createEffect(() => {
      const root = document.documentElement
      if (theme() === 'light') {
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
      } else {
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
      }
    })

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (e.matches) setTheme('dark')
        else setTheme('light')
      })
  })

  return (
    <div class="theme-toggle">
      <label>
        <input
          type="checkbox"
          class="input-theme"
          checked={theme() === 'dark'}
          onChange={(v) => {
            if (v.target.checked) {
              setTheme('dark')
            } else {
              setTheme('light')
            }
          }}
        />
        <Show when={theme() === 'light'} fallback={icons[1]}>
          {icons[0]}
        </Show>
      </label>
    </div>
  )
}

export default ThemeToggle

export { theme as colorTheme }
