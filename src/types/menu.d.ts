import type { EntryFieldTypes } from 'contentful'
import type { ContentEntry } from './contentful'
import type { PageSkeleton } from './page'

interface MenuItemProps {
  title: string
  subtitle: string
  icon: string
  path: string
  isActive: boolean
}

interface RootMenuItemProps extends MenuItemProps {
  subPages: Array<MenuItemProps>
}

type MenuProps = Array<RootMenuItemProps>

type MenuOptions = 'header' | 'footer'

type MenuSortOrderSkeleton = {
  contentTypeId: 'menuSortOrder'
  fields: {
    menu: EntryFieldTypes.Symbol<MenuOptions>
    shouldShowSubmenus: EntryFieldTypes.Boolean
    pages: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<PageSkeleton>>
  }
}

type MenuSortOrderEntry = ContentEntry<MenuSortOrderSkeleton>
