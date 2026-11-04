import type { JSX } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import type { Heading } from '../../core/richText'
import { useCopy } from '../../core/useLanguage'

/** Long texts index their headings; shorter ones read fine without. */
export const minimumHeadingsForIndex = 4

const Links = ({ headings }: { headings: Heading[] }) => (
  <ol className="border-l border-rule">
    {headings.map(({ id, text }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-ink-soft no-underline hover:border-rule-strong hover:text-ink"
        >
          {text}
        </a>
      </li>
    ))}
  </ol>
)

/**
 * The headings of a long text. On wide screens it stays in view beside the
 * text; on phones it is folded away until asked for.
 */
const PageIndex = ({ headings }: { headings: Heading[] }): JSX.Element | null => {
  const copy = useCopy()
  if (headings.length < minimumHeadingsForIndex) return null

  return (
    <>
      <details className="group mt-6 border-y border-rule lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-bold [&::-webkit-details-marker]:hidden">
          {copy.onThisPage}
          <LuChevronDown
            aria-hidden
            className="size-5 text-label transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <div className="pb-4">
          <Links headings={headings} />
        </div>
      </details>

      <nav aria-label={copy.onThisPage} className="mt-8 hidden text-base lg:block">
        <p className="mb-2 text-sm font-bold text-label">{copy.onThisPage}</p>
        <Links headings={headings} />
      </nav>
    </>
  )
}

export default PageIndex
