import React from 'react'
import { MenuProps } from '../../../types/menu'

interface ContextProps {
  type: 'none' | 'sidebar' | 'main' | 'footer'
  menu: MenuProps
  show: boolean
  setShow: (show: boolean) => void
  hasDarkBackground: boolean
}

export const MenuContext = React.createContext<Partial<ContextProps>>({
  type: 'none',
  menu: [],
  show: false,
  setShow: () => {},
  hasDarkBackground: false,
})
