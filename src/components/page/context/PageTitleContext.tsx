import { createContext, useContext } from 'react'

/** The title of the page being shown, so a section can avoid repeating it. */
export const PageTitleContext = createContext<string | undefined>(undefined)

export const usePageTitle = (): string | undefined => useContext(PageTitleContext)
