import type { Entry, EntrySkeletonType } from 'contentful'

/**
 * An entry as delivered by our client: links resolved where possible, while
 * links to drafts or deleted entries stay as bare `UnresolvedLink` objects.
 */
type ContentEntry<Skeleton extends EntrySkeletonType> = Entry<Skeleton, undefined>
