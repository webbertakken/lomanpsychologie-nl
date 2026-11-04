import type { JSX } from 'react'
import { useCopy } from '../../core/useLanguage'
import type { OfficeHoursEntry } from '../../types/section'
import FieldSection from './FieldSection'
import OfficeHoursTable from './OfficeHoursTable'

interface Props {
  section: OfficeHoursEntry
  isFirst?: boolean
}

const OfficeHoursSection = ({ section, isFirst }: Props): JSX.Element => {
  const copy = useCopy()
  const { title, slug, exceptions } = section.fields

  return (
    <FieldSection slug={slug} title={title} isFirst={isFirst}>
      <OfficeHoursTable hours={section.fields} />

      {exceptions && exceptions.length > 0 && (
        <div className="rich-text mt-10">
          <h3>{copy.details}</h3>
          <ul>
            {exceptions.map((exception) => (
              <li key={exception}>{exception}</li>
            ))}
          </ul>
        </div>
      )}
    </FieldSection>
  )
}

export default OfficeHoursSection
