import {
  BasicSectionEntry,
  OfficeHoursEntry,
  ProfileSectionEntry,
  SectionEntry,
  TherapyTypeDetailsEntry,
  TypesOfTherapyEntry,
} from '../../types/section'
import BasicSection from './BasicSection/BasicSection'
import OfficeHoursSection from './OfficeHoursSection/OfficeHoursSection'
import ProfileCardSection from './ProfileCardSection/ProfileCardSection'
import TherapyTypeDetailsSection from './TherapyTypeDetailsSection/TherapyTypeDetailsSection'
import TherapyTypesSection from './TherapyTypesSection/TherapyTypesSection'

interface Props {
  section: SectionEntry
  index?: number
}

// The content type id is the discriminant of `SectionEntry`, but Contentful
// types `sys.contentType.sys.id` as a plain string, so each case names its entry.
const Section = ({ section, index }: Props): JSX.Element => {
  switch (section.sys.contentType.sys.id) {
    case 'section':
      return <BasicSection section={section as BasicSectionEntry} index={index} />
    case 'profileCardSection':
      return <ProfileCardSection section={section as ProfileSectionEntry} />
    case 'therapyTypesSection':
      return <TherapyTypesSection section={section as TypesOfTherapyEntry} />
    case 'TherapyTypeDetailedSection':
      return <TherapyTypeDetailsSection section={section as TherapyTypeDetailsEntry} />
    case 'officeHoursSection':
      return <OfficeHoursSection section={section as OfficeHoursEntry} index={index} />
    default:
      return null
  }
}

export default Section
