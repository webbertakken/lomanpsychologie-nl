import Image from 'next/image'
import Link from 'next/link'
import type { JSX } from 'react'
import { isResolved } from '../../core/links'
import type { TherapyTypeDetailsEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'
import { useSiteChrome } from '../page/context/AppContext'
import PageHeader from '../page/PageHeader'

/** The menu branch the current page sits in: its parent and its siblings. */
const useMenuBranch = () => {
  const { headerMenu } = useSiteChrome()
  return headerMenu.find(({ subPages }) => subPages.some(({ isActive }) => isActive))
}

const TreatmentDetailSection = ({
  section,
}: {
  section: TherapyTypeDetailsEntry
}): JSX.Element | null => {
  const branch = useMenuBranch()
  const { slug, therapyTypeCard } = section.fields
  if (!isResolved(therapyTypeCard)) return null

  const { title, subtitle, image, content } = therapyTypeCard.fields
  const file = isResolved(image) ? image.fields.file : null
  const siblings = branch?.subPages.filter(({ isActive }) => !isActive) ?? []

  return (
    <article id={slug}>
      <PageHeader
        title={title}
        lead={subtitle !== title ? subtitle : undefined}
        parent={branch ? { title: branch.title, path: branch.path } : undefined}
      />

      <div className="sheet grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          {file && (
            <Image
              src={`https:${file.url}`}
              width={file.details.image.width}
              height={file.details.image.height}
              alt=""
              priority
              sizes="(min-width: 1024px) 46rem, 100vw"
              className="mb-10 aspect-[16/9] w-full border border-rule object-cover"
            />
          )}
          <div className="rich-text">{renderContent(content)}</div>
        </div>

        {siblings.length > 0 && (
          <nav aria-labelledby="andere-behandelingen" className="lg:col-span-3 lg:col-start-10">
            <h2 id="andere-behandelingen" className="font-sans text-sm font-bold text-label">
              Andere behandelingen
            </h2>
            <ul className="mt-2 border-t-2 border-rule-strong">
              {siblings.map((sibling) => (
                <li key={sibling.path} className="border-b">
                  <Link
                    href={sibling.path}
                    className="block py-3 no-underline hover:underline hover:decoration-rule-strong"
                  >
                    <span className="font-bold">{sibling.title}</span>
                    {sibling.subtitle && (
                      <span className="block text-sm text-ink-soft">{sibling.subtitle}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  )
}

export default TreatmentDetailSection
