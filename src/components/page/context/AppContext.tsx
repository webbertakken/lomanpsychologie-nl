import { createContext, useContext } from 'react'
import type { SiteChrome } from '../../../core/site'

export const AppContext = createContext<SiteChrome>({
  headerMenu: [],
  footerMenu: [],
  banner: null,
  contactPath: '/contact',
  alternates: { nl: '/', en: '/' },
})

export const useSiteChrome = (): SiteChrome => useContext(AppContext)
