import { describe, expect, it } from 'vitest'
import { asThemeChoice, resolveTheme, themeColours } from './theme'

describe('asThemeChoice', () => {
  it('accepts a stored choice and falls back to the system for anything else', () => {
    expect(asThemeChoice('dark')).toBe('dark')
    expect(asThemeChoice('light')).toBe('light')
    expect(asThemeChoice('system')).toBe('system')
    expect(asThemeChoice('sepia')).toBe('system')
    expect(asThemeChoice(null)).toBe('system')
  })
})

describe('resolveTheme', () => {
  it('follows the system unless the visitor chose light or dark', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('themeColours', () => {
  it('gives the browser chrome the page colour of each theme', () => {
    expect(themeColours).toEqual({ light: '#ffffff', dark: '#0e1a24' })
  })
})
