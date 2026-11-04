import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import ThemeSwitch from './ThemeSwitch'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('ThemeSwitch', () => {
  it('follows the system until the visitor chooses', () => {
    render(<ThemeSwitch />)

    expect(screen.getByRole('radio', { name: 'Systeem' })).toBeChecked()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('applies and remembers a chosen theme', async () => {
    render(<ThemeSwitch />)

    await userEvent.click(screen.getByRole('radio', { name: 'Donker' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(screen.getByRole('radio', { name: 'Donker' })).toBeChecked()
  })

  it('returns to the system setting and forgets the choice', async () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeSwitch />)
    expect(screen.getByRole('radio', { name: 'Licht' })).toBeChecked()

    await userEvent.click(screen.getByRole('radio', { name: 'Systeem' }))

    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('keeps two switches on one page in step', async () => {
    render(
      <>
        <ThemeSwitch />
        <ThemeSwitch />
      </>,
    )

    await userEvent.click(screen.getAllByRole('radio', { name: 'Licht' })[0])

    expect(screen.getAllByRole('radio', { name: 'Licht' })[1]).toBeChecked()
  })
})
