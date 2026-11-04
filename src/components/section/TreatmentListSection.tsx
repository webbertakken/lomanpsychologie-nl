import Image from 'next/image'
import Link from 'next/link'
import type { JSX } from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { isResolved } from '../../core/links'
import type { TherapyTypeCardEntry, TypesOfTherapyEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'

const linkOf = ({ fields }: TherapyTypeCardEntry): string | null => {
  if (!isResolved(fields.pageToLinkTo)) return null
  const { slug, parentPage } = fields.pageToLinkTo.fields
  return isResolved(parentPage) ? `/${parentPage.fields.slug}/${slug}` : `/${slug}`
}

const Treatment = ({ card }: { card: TherapyTypeCardEntry }) => {
  const { title, slug, subtitle, summary, image } = card.fields
  const link = linkOf(card)
  const file = isResolved(image) ? image.fields.file : null

  return (
    <li id={slug} className="grid gap-6 border-t py-10 md:grid-cols-12 md:gap-10 md:py-14">
      {file && (
        <div className="md:col-span-4">
          <Image
            src={`https:${file.url}`}
            width={file.details.image.width}
            height={file.details.image.height}
            alt=""
            sizes="(min-width: 768px) 22rem, 100vw"
            className="aspect-[3/2] w-full border border-rule object-cover"
          />
        </div>
      )}
      <div className="md:col-span-8">
        <h2 className="text-3xl md:text-4xl">
          {link ? (
            <Link href={link} className="no-underline hover:underline hover:decoration-rule-strong">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        {subtitle && subtitle !== title && <p className="mt-2 font-bold text-label">{subtitle}</p>}
        <div className="rich-text mt-4">{renderContent(summary)}</div>
        {link && (
          <Link
            href={link}
            className="link mt-5 inline-flex min-h-11 items-center gap-2 font-bold"
            aria-label={`Lees meer over ${title}`}
          >
            Lees meer
            <LuArrowRight aria-hidden className="size-4" />
          </Link>
        )}
      </div>
    </li>
  )
}

const TreatmentListSection = ({ section }: { section: TypesOfTherapyEntry }): JSX.Element => {
  const { slug, therapyTypeCards } = section.fields

  return (
    <section id={slug} aria-label={section.fields.title} className="sheet">
      <ul className="[&>li:first-child]:border-t-0">
        {therapyTypeCards?.filter(isResolved).map((card) => (
          <Treatment key={card.sys.id} card={card} />
        ))}
      </ul>
    </section>
  )
}

export default TreatmentListSection
