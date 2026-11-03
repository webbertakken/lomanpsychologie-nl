import type { JSX } from 'react'
import type { BasicSectionEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'
import FieldSection from './FieldSection'

interface Props {
  section: BasicSectionEntry
  isFirst?: boolean
}

const BasicSection = ({ section, isFirst }: Props): JSX.Element => {
  const { title, slug, subtitle, content } = section.fields

  return (
    <FieldSection slug={slug} title={title} subtitle={subtitle} isFirst={isFirst}>
      <div className="rich-text">{renderContent(content)}</div>
    </FieldSection>
  )
}

export default BasicSection
