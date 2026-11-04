/**
 * Light, dark or the visitor's system setting. The choice is kept in
 * localStorage (not a cookie) and applied as `data-theme` on <html>; without
 * a choice the CSS follows `prefers-color-scheme`.
 */
export const themeChoices = ['system', 'light', 'dark'] as const
export type ThemeChoice = (typeof themeChoices)[number]
export type Theme = Exclude<ThemeChoice, 'system'>

export const themeStorageKey = 'theme'

/** The page colour per theme, for the browser's own chrome (`theme-color`). */
export const themeColours: Record<Theme, string> = { light: '#ffffff', dark: '#0e1a24' }

export const asThemeChoice = (value: string | null | undefined): ThemeChoice =>
  themeChoices.includes(value as ThemeChoice) ? (value as ThemeChoice) : 'system'

export const resolveTheme = (choice: ThemeChoice, systemPrefersDark: boolean): Theme =>
  choice === 'system' ? (systemPrefersDark ? 'dark' : 'light') : choice

/**
 * Runs inline in <head>, before the page is drawn, so a chosen theme never
 * flashes the other one first. Kept tiny and free of imports on purpose.
 */
export const applyStoredThemeScript = `(function(){try{var c=localStorage.getItem('${themeStorageKey}');if(c==='light'||c==='dark'){var r=document.documentElement;r.dataset.theme=c;r.style.colorScheme=c;var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute('content',c==='dark'?'${themeColours.dark}':'${themeColours.light}')}}catch(e){}})()`

/** Applies a choice to the open page; the inline script does the same on the next load. */
export const applyTheme = (choice: ThemeChoice): void => {
  const root = document.documentElement
  if (choice === 'system') {
    delete root.dataset.theme
    root.style.removeProperty('color-scheme')
  } else {
    root.dataset.theme = choice
    root.style.colorScheme = choice
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    const media = meta.getAttribute('media') ?? ''
    const own: Theme = media.includes('dark') ? 'dark' : 'light'
    const theme = choice === 'system' ? own : resolveTheme(choice, prefersDark)
    meta.setAttribute('content', themeColours[theme])
  }
}

/**
 * The choice one press of the toggle moves to. From the system it goes to the
 * opposite of what the system shows, then to the other theme, then back to the
 * system, so every press except the last visibly changes the page.
 */
export const nextThemeChoice = (current: ThemeChoice, systemPrefersDark: boolean): ThemeChoice => {
  const systemTheme: Theme = systemPrefersDark ? 'dark' : 'light'
  const opposite: Theme = systemPrefersDark ? 'light' : 'dark'
  if (current === 'system') return opposite
  if (current === opposite) return systemTheme
  return 'system'
}
