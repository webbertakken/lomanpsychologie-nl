import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DynamicIcon } from './DynamicIcon'

describe('DynamicIcon', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads the named icon from its react-icons library', async () => {
    const { container } = render(<DynamicIcon icon="FaRegFilePdf" />)

    await waitFor(() => expect(container.querySelector('svg')).not.toBeNull())
  })

  it('finds icons that only exist in the newer set sharing their prefix', async () => {
    const { container } = render(<DynamicIcon icon="FaPersonCircleExclamation" />)

    await waitFor(() => expect(container.querySelector('svg')).not.toBeNull())
  })

  it('renders the fallback when no icon is given', () => {
    render(<DynamicIcon icon="" />)

    expect(screen.getByText('•')).toBeDefined()
  })

  it('renders the fallback and warns when the library is unknown', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<DynamicIcon icon="XyzHeart" />)

    expect(screen.getByText('•')).toBeDefined()
    expect(warn).toHaveBeenCalledWith('DynamicIcon: no react-icons library for "XyzHeart"')
  })

  it('renders the fallback and warns when the library lacks the icon', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<DynamicIcon icon="FaNoSuchIcon" />)

    expect(await screen.findByText('•')).toBeDefined()
    expect(warn).toHaveBeenCalledWith('DynamicIcon: react-icons/fa has no icon "FaNoSuchIcon"')
  })
})
