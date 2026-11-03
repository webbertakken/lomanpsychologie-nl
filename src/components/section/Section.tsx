import type { JSX } from 'react'
import type {
  BasicSectionEntry,
  OfficeHoursEntry,
  ProfileSectionEntry,
  SectionEntry,
  TherapyTypeDetailsEntry,
  TypesOfTherapyEntry,
} from '../../types/section'
import BasicSection from './BasicSection'
import IntroSection from './IntroSection'
import OfficeHoursSection from './OfficeHoursSection'
import TreatmentDetailSection from './TreatmentDetailSection'
import TreatmentListSection from './TreatmentListSection'

interface Props {
  section: SectionEntry
  isFirst?: boolean
  pageSections?: SectionEntry[]
}

/** Sections that open a page with their own `h1`. */
export const introducesPage = (section: SectionEntry): boolean =>
  ['profileCardSection', 'TherapyTypeDetailedSection'].includes(section.sys.contentType.sys.id)

// The content type id is the discriminant of `SectionEntry`, but Contentful
// types `sys.contentType.sys.id` as a plain string, so each case names its entry.
const Section = ({ section, isFirst, pageSections = [] }: Props): JSX.Element | null => {
  const contentType: string = section.sys.contentType.sys.id
  switch (contentType) {
    case 'section':
      return <BasicSection section={section as BasicSectionEntry} isFirst={isFirst} />
    case 'profileCardSection':
      return <IntroSection section={section as ProfileSectionEntry} pageSections={pageSections} />
    case 'therapyTypesSection':
      return <TreatmentListSection section={section as TypesOfTherapyEntry} />
    case 'TherapyTypeDetailedSection':
      return <TreatmentDetailSection section={section as TherapyTypeDetailsEntry} />
    case 'officeHoursSection':
      return <OfficeHoursSection section={section as OfficeHoursEntry} isFirst={isFirst} />
    default:
      console.warn(`[sections] no component for content type ${contentType}`)
      return null
  }
}

export default Section
