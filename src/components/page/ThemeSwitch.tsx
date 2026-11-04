import cx from 'classnames'
import { type JSX, useId, useSyncExternalStore } from 'react'
import type { IconType } from 'react-icons'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { applyTheme, asThemeChoice, type ThemeChoice, themeStorageKey } from '../../core/theme'
import { useCopy } from '../../core/useLanguage'

const changed = 'theme-change'

const readChoice = (): ThemeChoice => {
  try {
    return asThemeChoice(localStorage.getItem(themeStorageKey))
  } catch {
    return 'system'
  }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(changed, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(changed, onChange)
    window.removeEventListener('storage', onChange)
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

/** System, light or dark. Every switch on the page shows the same choice. */
const ThemeSwitch = ({ className }: { className?: string }): JSX.Element => {
  const copy = useCopy()
  const name = useId()
  // The server cannot know the stored choice, so it renders "system" and the browser corrects it.
  const current = useSyncExternalStore(subscribe, readChoice, () => 'system' as const)

  const options: Array<[ThemeChoice, string, IconType]> = [
    ['system', copy.themeSystem, LuMonitor],
    ['light', copy.themeLight, LuSun],
    ['dark', copy.themeDark, LuMoon],
  ]

  return (
    <fieldset className={cx('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      <legend className="sr-only">{copy.appearance}</legend>
      <span aria-hidden className="text-sm text-ink-soft">
        {copy.appearance}
      </span>
      <div className="inline-flex rounded-[2px] border border-rule">
        {options.map(([choice, label, Icon]) => (
          <label
            key={choice}
            className={cx(
              'relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-3 text-sm font-bold transition-colors duration-150 not-last:border-r not-last:border-rule has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-label',
              current === choice
                ? 'bg-ink text-on-ink'
                : 'text-ink-soft hover:bg-paper-deep hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              value={choice}
              checked={current === choice}
              onChange={() => choose(choice)}
              className="sr-only"
            />
            <Icon aria-hidden className="size-4" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default ThemeSwitch
