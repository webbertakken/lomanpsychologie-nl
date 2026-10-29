import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { useClientValue } from './useClientValue'

const Probe = () => <div>{useClientValue(() => 'client', 'server')}</div>

describe('useClientValue', () => {
  it('renders the server value on the server', () => {
    expect(renderToString(<Probe />)).toContain('server')
  })

  it('renders the client value in the browser', () => {
    render(<Probe />)

    expect(screen.getByText('client')).toBeInTheDocument()
  })
})
