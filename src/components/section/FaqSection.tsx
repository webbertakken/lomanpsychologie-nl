import type { JSX } from 'react'
import { LuPlus } from 'react-icons/lu'
import { isResolved } from '../../core/links'
import type { FaqSectionEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'
import FieldSection from './FieldSection'

interface Props {
  section: FaqSectionEntry
  isFirst?: boolean
}

/** A group of questions; each answer opens in place, and each question can be linked to. */
const FaqSection = ({ section, isFirst }: Props): JSX.Element => {
  const { title, slug, subtitle, questions } = section.fields

  return (
    <FieldSection slug={slug} title={title} subtitle={subtitle} isFirst={isFirst}>
      <div className="max-w-[68ch] border-t-2 border-rule-strong">
        {questions?.filter(isResolved).map(({ sys, fields }) => (
          <details key={sys.id} id={fields.slug} className="group border-b">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-xl leading-snug hover:text-label [&::-webkit-details-marker]:hidden">
              {fields.question}
              <LuPlus
                aria-hidden
                className="size-5 shrink-0 text-label transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <div className="rich-text pb-6">{renderContent(fields.answer)}</div>
          </details>
        ))}
      </div>
    </FieldSection>
  )
}

export default FaqSection
