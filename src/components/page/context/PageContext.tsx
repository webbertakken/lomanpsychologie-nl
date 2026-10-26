import React from 'react'
import { PageFields } from '../../../types/page'

type ContextProps = Pick<PageFields, 'hasOwnHeader' | 'hasDarkBackground'>

export const PageContext = React.createContext<Partial<ContextProps>>({
  hasOwnHeader: false,
  hasDarkBackground: false,
})
