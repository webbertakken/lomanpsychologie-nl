import type { Entry, EntrySkeletonType } from 'contentful'

/**
 * An entry as delivered by our client: links resolved, and links to drafts or
 * deleted entries removed rather than left as bare link objects.
 */
type ContentEntry<Skeleton extends EntrySkeletonType> = Entry<
  Skeleton,
  'WITHOUT_UNRESOLVABLE_LINKS'
>
