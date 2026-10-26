import type { UnresolvedLink } from 'contentful'

type Linkable = { sys: { type: string } }

/**
 * Contentful leaves a link to a draft or deleted entry or asset as a bare
 * `UnresolvedLink`, which has no fields. Content that depends on one is
 * treated as a draft itself.
 */
export const isResolved = <Resolved extends Linkable>(
  link: Resolved | UnresolvedLink<'Entry' | 'Asset'> | undefined,
): link is Resolved => link !== undefined && link !== null && link.sys.type !== 'Link'
