import type { Component } from 'solid-js'
import {
  For,
  Match,
  Switch,
  createEffect,
  createSignal,
  onMount,
} from 'solid-js'
import './ThemeToggleButton.css'

const icons = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 32 32"
  >
    <title>Auto</title>
    <path
      fill="currentColor"
      d="M26 24.005H6a2.002 2.002 0 0 1-2-2v-14a2.002 2.002 0 0 1 2-2h20a2.002 2.002 0 0 1 2 2v14a2.003 2.003 0 0 1-2 2Zm-20-16v14h20v-14Zm-4 18h28v2H2z"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 32 32"
  >
    <title>Light Mode</title>
    <path
      fill="currentColor"
      d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6ZM5.394 6.813L6.81 5.399l3.505 3.506L8.9 10.319zM2 15.005h5v2H2zm3.394 10.193L8.9 21.692l1.414 1.414l-3.505 3.506zM15 25.005h2v5h-2zm6.687-1.9l1.414-1.414l3.506 3.506l-1.414 1.414zm3.313-8.1h5v2h-5zm-3.313-6.101l3.506-3.506l1.414 1.414l-3.506 3.506zM15 2.005h2v5h-2z"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 32 32"
  >
    <title>Dark Mode</title>
    <path
      fill="currentColor"
      d="M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3Z"
    />
  </svg>,
]

type Theme = 'auto' | 'light' | 'dark'

const STATES: Theme[] = ['auto', 'light', 'dark']

function parseTheme(theme: unknown): Theme {
  if (theme === 'auto' || theme === 'light' || theme === 'dark') return theme
  return 'auto'
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'auto'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const [theme, setTheme] = createSignal<Theme>(
  (() => {
    if (import.meta.env.SSR) return 'auto'

    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme'))
      return parseTheme(localStorage.getItem('theme'))

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'

    return 'auto'
  })(),
)

function nextTheme(): Theme {
  const index = STATES.indexOf(theme())
  return STATES[(index + 1) % STATES.length]
}

const ThemeToggle: Component = () => {
  onMount(() => {
    createEffect(() => {
      const root = document.documentElement
      switch (theme()) {
        case 'auto': {
          const preferredTheme = getPreferredTheme()
          root.setAttribute('data-theme', preferredTheme)
          preferredTheme === 'dark'
            ? root.classList.add('dark')
            : root.classList.remove('dark')
          break
        }
        case 'light': {
          root.setAttribute('data-theme', 'light')
          root.classList.remove('dark')
          break
        }
        case 'dark': {
          root.setAttribute('data-theme', 'dark')
          root.classList.add('dark')
        }
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
          type="button"
          class="input-theme"
          onClick={() => {
            const t = nextTheme()
            setTheme(t)
            localStorage.setItem('theme', t)
          }}
        />
        <Switch>
          <For each={STATES}>
            {(s, i) => <Match when={s === theme()}>{icons[i()]}</Match>}
          </For>
        </Switch>
      </label>
    </div>
  )
}

export default ThemeToggle

export { theme as colorTheme }
