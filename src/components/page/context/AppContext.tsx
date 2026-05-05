import React from 'react'
import { BannerNotificationEntry } from '../../../types/banner'
import { MenuProps } from '../../../types/menu'

type ContextProps = {
  headerMenu: MenuProps
  footerMenu: MenuProps
  banner?: BannerNotificationEntry
}

export const AppContext = React.createContext<Partial<ContextProps>>({
  headerMenu: [],
  footerMenu: [],
  banner: null,
})
