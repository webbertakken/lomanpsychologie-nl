import type { JSX } from 'react'
import { headingsOf } from '../../core/richText'
import type { BasicSectionEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'
import FieldSection from './FieldSection'
import PageIndex from './PageIndex'

interface Props {
  section: BasicSectionEntry
  isFirst?: boolean
}

const BasicSection = ({ section, isFirst }: Props): JSX.Element => {
  const { title, slug, subtitle, content } = section.fields

  return (
    <FieldSection
      slug={slug}
      title={title}
      subtitle={subtitle}
      isFirst={isFirst}
      aside={<PageIndex headings={headingsOf(content)} />}
    >
      <div className="rich-text">{renderContent(content)}</div>
    </FieldSection>
  )
}

export default BasicSection
