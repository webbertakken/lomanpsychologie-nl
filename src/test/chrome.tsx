import type { ReactNode } from 'react'
import { AppContext } from '../components/page/context/AppContext'
import type { SiteChrome } from '../core/site'
import type { RegistrationStopEntry } from '../types/registrationStop'

export const registrationStopOf = (isEnabled: boolean, message: string): RegistrationStopEntry =>
  ({
    sys: { id: 'stop', type: 'Entry', contentType: { sys: { id: 'registrationStop' } } },
    fields: { isEnabled, message },
  }) as unknown as RegistrationStopEntry

const chromeWith = (overrides: Partial<SiteChrome>): SiteChrome => ({
  headerMenu: [],
  footerMenu: [],
  banner: null,
  registrationStop: null,
  insurersPath: null,
  contactPath: '/contact',
  alternates: { nl: '/', en: '/' },
  ...overrides,
})

/** Wraps a component in the site chrome every page provides, with the given overrides. */
export const withChrome =
  (overrides: Partial<SiteChrome>) =>
  ({ children }: { children: ReactNode }) => (
    <AppContext.Provider value={chromeWith(overrides)}>{children}</AppContext.Provider>
  )
