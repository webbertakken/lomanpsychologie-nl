import cx from 'classnames'
import Link from 'next/link'
import type { JSX } from 'react'
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu'
import { type Anchor, insurersSlug } from '../../core/sectionIndex'
import { useCopy } from '../../core/useLanguage'
import { useSiteChrome } from './context/AppContext'

const linkClass =
  'group flex min-h-11 items-center gap-2 no-underline hover:underline hover:decoration-rule-strong'
const iconClass =
  'size-4 shrink-0 text-label transition-transform duration-200 group-hover:translate-x-0.5'

/**
 * The page's own index: every section, one tap away, and the contracted
 * insurers, which patients look for wherever they are.
 */
interface Props {
  anchors: Anchor[]
  /** As a field of a content page: the name in the label column, the links beside it. */
  asField?: boolean
}

const SectionIndex = ({ anchors, asField = false }: Props): JSX.Element | null => {
  const copy = useCopy()
  const { insurersPath } = useSiteChrome()
  if (anchors.length === 0) return null
  const listsInsurers = anchors.some(({ slug }) => slug === insurersSlug)

  return (
    <nav
      aria-labelledby="op-deze-pagina"
      className={cx(asField && 'lg:grid lg:grid-cols-12 lg:gap-10')}
    >
      <h2
        id="op-deze-pagina"
        className={cx('font-sans text-sm font-bold text-label', asField && 'lg:col-span-4 lg:pt-3')}
      >
        {copy.onThisPage}
      </h2>
      <ul
        className={cx(
          'mt-1 grid grid-cols-1 gap-x-8 sm:grid-cols-2',
          asField && 'lg:col-span-8 lg:mt-0',
        )}
      >
        {anchors.map(({ slug, title }) => (
          <li key={slug}>
            <a href={`#${slug}`} className={linkClass}>
              <LuArrowRight aria-hidden className={iconClass} />
              {title}
            </a>
          </li>
        ))}
        {insurersPath && !listsInsurers && (
          <li>
            <Link href={insurersPath} className={linkClass}>
              <LuArrowUpRight aria-hidden className={iconClass} />
              {copy.contractedInsurers}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default SectionIndex
