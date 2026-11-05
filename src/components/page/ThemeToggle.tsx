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

/** One button that cycles system, light and dark; its icon shows the current choice. */
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
  const Icon = icons[current]
  const label = copy.themeToggle(names[current], names[next])

  return (
    <button
      type="button"
      onClick={() => choose(next)}
      aria-label={label}
      title={label}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[2px] text-ink-soft transition-colors duration-150 hover:bg-paper-deep hover:text-ink"
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}

export default ThemeToggle
