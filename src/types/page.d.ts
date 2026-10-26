import type { EntryFieldTypes } from 'contentful'
import type { ContentEntry } from './contentful'
import type { SectionSkeleton } from './section'

type PageSkeleton = {
  contentTypeId: 'page'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    menuItemTitle: EntryFieldTypes.Symbol
    subtitle: EntryFieldTypes.Symbol
    icon: EntryFieldTypes.Symbol
    isHomePage: EntryFieldTypes.Boolean
    hasOwnHeader: EntryFieldTypes.Boolean
    hasDarkBackground: EntryFieldTypes.Boolean
    parentPage: EntryFieldTypes.EntryLink<PageSkeleton>
    shouldBeShownInHeader: EntryFieldTypes.Boolean
    shouldBeShownInFooter: EntryFieldTypes.Boolean
    shouldBeShownInSubmenus: EntryFieldTypes.Boolean
    sections: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<SectionSkeleton>>
  }
}

type PageEntry = ContentEntry<PageSkeleton>

type PageFields = PageEntry['fields']
