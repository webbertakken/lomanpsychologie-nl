import { type JSX, useSyncExternalStore } from 'react'
import type { IconType } from 'react-icons'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import {
  applyTheme,
  asThemeChoice,
  nextThemeChoice,
  type ThemeChoice,
  themeStorageKey,
} from '../../core/theme'
import { useCopy } from '../../core/useLanguage'

const changed = 'theme-change'
const darkQuery = '(prefers-color-scheme: dark)'

const readChoice = (): ThemeChoice => {
  try {
    return asThemeChoice(localStorage.getItem(themeStorageKey))
  } catch {
    return 'system'
  }
}

const readSystemDark = (): boolean => window.matchMedia(darkQuery).matches

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(darkQuery)
  window.addEventListener(changed, onChange)
  window.addEventListener('storage', onChange)
  media.addEventListener('change', onChange)
  return () => {
    window.removeEventListener(changed, onChange)
    window.removeEventListener('storage', onChange)
    media.removeEventListener('change', onChange)
  }
}

const choose = (choice: ThemeChoice) => {
  try {
    if (choice === 'system') localStorage.removeItem(themeStorageKey)
    else localStorage.setItem(themeStorageKey, choice)
  } catch {
    console.warn('[theme] the choice cannot be stored; it applies to this page only')
  }
  applyTheme(choice)
  window.dispatchEvent(new Event(changed))
}

const icons: Record<ThemeChoice, IconType> = { system: LuMonitor, light: LuSun, dark: LuMoon }

/**
 * One button that cycles automatic, light and dark. Like the language link it
 * names, in words and an icon, what a press switches to.
 */
const ThemeToggle = (): JSX.Element => {
  const copy = useCopy()
  // The server cannot know the stored choice, so it renders "system" and the browser corrects it.
  const current = useSyncExternalStore(subscribe, readChoice, () => 'system' as const)
  const systemDark = useSyncExternalStore(subscribe, readSystemDark, () => false)
  const next = nextThemeChoice(current, systemDark)
  const names: Record<ThemeChoice, string> = {
    system: copy.themeSystem,
    light: copy.themeLight,
    dark: copy.themeDark,
  }
  const Icon = icons[next]
  const label = copy.themeToggle(names[current], names[next])

  return (
    <button
      type="button"
      onClick={() => choose(next)}
      aria-label={label}
      title={label}
      className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 px-1 font-bold text-ink-soft hover:text-ink hover:underline hover:decoration-rule-strong"
    >
      <Icon aria-hidden className="size-4.5 shrink-0 text-label" />
      {names[next]}
    </button>
  )
}

export default ThemeToggle
