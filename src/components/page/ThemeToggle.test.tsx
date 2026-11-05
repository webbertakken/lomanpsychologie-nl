import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import ThemeToggle from './ThemeToggle'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('ThemeToggle', () => {
  it('follows the system until pressed, and says what a press does', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button')).toHaveAccessibleName('Weergave: systeem. Wissel naar donker')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('cycles dark, light and back to the system, remembering each choice', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await userEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(button).toHaveAccessibleName('Weergave: donker. Wissel naar licht')

    await userEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('light')

    await userEvent.click(button)
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('keeps two toggles on one page in step', async () => {
    render(
      <>
        <ThemeToggle />
        <ThemeToggle />
      </>,
    )
    const [first, second] = screen.getAllByRole('button')

    await userEvent.click(first)

    expect(second).toHaveAccessibleName('Weergave: donker. Wissel naar licht')
  })
})
