import { Document } from '@contentful/rich-text-types';
import { Entry } from 'contentful';
import { PageEntry } from './page';

interface BasicSectionProps {
  title: string;
  subtitle: string;
  slug: string;
  content: Document;
}

type BasicSectionEntry = Entry<BasicSectionProps>;

interface OfficeHoursProps {
  title: string;
  slug: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  exceptions: string[];
}

type OfficeHoursEntry = Entry<OfficeHoursProps>;

interface ProfileSectionProps {
  title: string;
  slug: string;
  photo: Entry<any>;
  photoShouldBeOnTheLeft: boolean;
  vocation: string;
  location: string;
  getInTouchText: string;
  getInTouchLink: string;
  shortDescription: Document;
  instagramHandle: string;
  facebookHandle: string;
  twitterHandle: string;
  youtubeHandle: string;
  linkedInHandle: string;
}

type ProfileSectionEntry = Entry<ProfileSectionProps>;

interface TherapyTypeCardProps {
  image: Entry<any>;
  title: string;
  slug: string;
  subtitle: string;
  summary: Document;
  content: Document;
  pageToLinkTo?: PageEntry;
}

type TherapyTypeCardEntry = Entry<TherapyTypeCardProps>;

interface TypesOfTherapyProps {
  title: string;
  slug: string;
  therapyTypeCards: TherapyTypeCardEntry[];
  vocation: string;
  location: string;
  getInTouchText: string;
  getInTouchLink: string;
  shortDescription: Document;
  instagramHandle: string;
  facebookHandle: string;
  twitterHandle: string;
  youtubeHandle: string;
  linkedInHandle: string;
}

type TypesOfTherapyEntry = Entry<TypesOfTherapyProps>;

interface TherapyTypeDetailsProps {
  title: string;
  slug: string;
  therapyTypeCard: TherapyTypeCardEntry;
}

type TherapyTypeDetailsEntry = Entry<TherapyTypeDetailsProps>;

interface TestimonialProps {
  quote: Document;
  author: string;
  role?: string;
  portrait?: Entry<any>;
}

type TestimonialEntry = Entry<TestimonialProps>;

interface TestimonialSectionProps {
  title: string;
  slug: string;
  introduction?: Document;
  testimonials: TestimonialEntry[];
  highlight?: string;
}

type TestimonialSectionEntry = Entry<TestimonialSectionProps>;

interface ProcessStepProps {
  title: string;
  description: Document;
  duration?: string;
}

type ProcessStepEntry = Entry<ProcessStepProps>;

interface ProcessTimelineSectionProps {
  title: string;
  slug: string;
  introduction?: Document;
  steps: ProcessStepEntry[];
  ctaText?: string;
  ctaLink?: string;
}

type ProcessTimelineSectionEntry = Entry<ProcessTimelineSectionProps>;
