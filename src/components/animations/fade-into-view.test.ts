import { afterEach, describe, expect, it } from 'vitest'
import { isAutomatedBrowser } from './fade-into-view'

const originalWebdriver = Object.getOwnPropertyDescriptor(
  Object.getPrototypeOf(navigator),
  'webdriver',
)

describe('isAutomatedBrowser', () => {
  afterEach(() => {
    // Restore the original `navigator.webdriver` property so tests don't
    // leak state between cases.
    if (originalWebdriver) {
      Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', originalWebdriver)
    }
    // @ts-ignore -- cleanup test-only fixture
    delete (window as { Cypress?: unknown }).Cypress
  })

  it('returns false in a regular browser session', () => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      configurable: true,
      get: () => false,
    })
    expect(isAutomatedBrowser()).toBe(false)
  })

  it('returns true when navigator.webdriver is true (Playwright, Selenium, modern Cypress)', () => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      configurable: true,
      get: () => true,
    })
    expect(isAutomatedBrowser()).toBe(true)
  })

  it('returns true when window.Cypress is set (legacy Cypress fallback)', () => {
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      configurable: true,
      get: () => false,
    })
    // @ts-ignore -- emulate legacy Cypress global
    window.Cypress = { version: '12.x' }
    expect(isAutomatedBrowser()).toBe(true)
  })
})
