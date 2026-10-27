import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DynamicIcon } from './DynamicIcon'

describe('DynamicIcon', () => {
  it('loads the named icon from its react-icons library', async () => {
    const { container } = render(<DynamicIcon icon="FaRegFilePdf" />)

    await waitFor(() => expect(container.querySelector('svg')).not.toBeNull())
  })

  it('renders the fallback when no icon is given', () => {
    render(<DynamicIcon icon="" />)

    expect(screen.getByText('•')).toBeDefined()
  })
})
