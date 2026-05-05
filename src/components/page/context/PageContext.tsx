import React from 'react'
import { PageProps } from '../../../types/page'

type ContextProps = Pick<PageProps, 'hasOwnHeader' | 'hasDarkBackground'>

export const PageContext = React.createContext<Partial<ContextProps>>({
  hasOwnHeader: false,
  hasDarkBackground: false,
})
