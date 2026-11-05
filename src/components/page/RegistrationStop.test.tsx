import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { registrationStopOf, withChrome } from '../../test/chrome'
import RegistrationStop from './RegistrationStop'

const message = 'Naar verwachting kan er per januari 2027 weer worden verwezen.'

describe('RegistrationStop', () => {
  it('shows the stop and the practice note while it is switched on', () => {
    render(<RegistrationStop />, {
      wrapper: withChrome({ registrationStop: registrationStopOf(true, message) }),
    })

    expect(screen.getByText('Aanmeldstop')).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('shows nothing while it is switched off', () => {
    const { container } = render(<RegistrationStop />, {
      wrapper: withChrome({ registrationStop: registrationStopOf(false, message) }),
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('shows nothing when Contentful has no stop entry', () => {
    const { container } = render(<RegistrationStop />, { wrapper: withChrome({}) })

    expect(container).toBeEmptyDOMElement()
  })
})
