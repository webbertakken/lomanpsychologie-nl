import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FadeIntoView from './fade-into-view'

describe('FadeIntoView', () => {
  it('renders its children inside a wrapper carrying the given class', () => {
    render(
      <FadeIntoView className="fade-wrapper">
        <p>Welkom</p>
      </FadeIntoView>,
    )

    const child = screen.getByText('Welkom')
    expect(child).toBeInTheDocument()
    expect(child.parentElement).toHaveClass('fade-wrapper')
  })

  it('renders without a class or delay', () => {
    render(
      <FadeIntoView>
        <p>Hallo</p>
      </FadeIntoView>,
    )

    expect(screen.getByText('Hallo')).toBeInTheDocument()
  })
})
