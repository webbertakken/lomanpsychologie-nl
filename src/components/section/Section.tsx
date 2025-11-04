import ProfileCardSection from './ProfileCardSection/ProfileCardSection';
import { Entry } from 'contentful';
import TherapyTypesSection from './TherapyTypesSection/TherapyTypesSection';
import BasicSection from './BasicSection/BasicSection';
import TherapyTypeDetailsSection from './TherapyTypeDetailsSection/TherapyTypeDetailsSection';
import OfficeHoursSection from './OfficeHoursSection/OfficeHoursSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';
import ProcessTimelineSection from './ProcessTimelineSection/ProcessTimelineSection';

interface Props {
  section: Entry<any>;
  index?: number;
}
const Section = ({ section, index }: Props): JSX.Element => {
  if (!section.sys.contentType) {
    // Section is still in draft
    return null;
  }

  const sectionType = section.sys.contentType.sys.id;

  switch (sectionType) {
    case 'section':
      return <BasicSection section={section} index={index} />;
    case 'profileCardSection':
      return <ProfileCardSection section={section} />;
    case 'therapyTypesSection':
      return <TherapyTypesSection section={section} />;
    case 'TherapyTypeDetailedSection':
      return <TherapyTypeDetailsSection section={section} />;
    case 'officeHoursSection':
      return <OfficeHoursSection section={section} index={index} />;
    case 'testimonialSection':
      return <TestimonialSection section={section} index={index} />;
    case 'processTimelineSection':
      return <ProcessTimelineSection section={section} index={index} />;
    default:
      return null;
  }
};

export default Section;
