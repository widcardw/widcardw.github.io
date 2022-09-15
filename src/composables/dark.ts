export const isDark = useDark({
  onChanged(dark: boolean) {
    const html = document.querySelector('html')
    const currentTheme = dark ? 'dark' : 'light'
    html?.setAttribute('data-darkmode', currentTheme)
    html?.setAttribute('class', currentTheme)
  },
})
export const toggleDark = useToggle(isDark)
export const preferredDark = usePreferredDark()
