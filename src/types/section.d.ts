import type { EntryFieldTypes } from 'contentful'
import type { ContentEntry } from './contentful'
import type { PageSkeleton } from './page'

type BasicSectionSkeleton = {
  contentTypeId: 'section'
  fields: {
    title: EntryFieldTypes.Symbol
    subtitle: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    content: EntryFieldTypes.RichText
  }
}

type BasicSectionEntry = ContentEntry<BasicSectionSkeleton>

type OfficeHoursSkeleton = {
  contentTypeId: 'officeHoursSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    monday: EntryFieldTypes.Symbol
    tuesday: EntryFieldTypes.Symbol
    wednesday: EntryFieldTypes.Symbol
    thursday: EntryFieldTypes.Symbol
    friday: EntryFieldTypes.Symbol
    saturday: EntryFieldTypes.Symbol
    sunday: EntryFieldTypes.Symbol
    exceptions: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }
}

type OfficeHoursEntry = ContentEntry<OfficeHoursSkeleton>

type ProfileSectionSkeleton = {
  contentTypeId: 'profileCardSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    photo: EntryFieldTypes.AssetLink
    photoShouldBeOnTheLeft: EntryFieldTypes.Boolean
    vocation: EntryFieldTypes.Symbol
    location: EntryFieldTypes.Symbol
    getInTouchText: EntryFieldTypes.Symbol
    getInTouchLink: EntryFieldTypes.Symbol
    shortDescription: EntryFieldTypes.RichText
    instagramHandle: EntryFieldTypes.Symbol
    facebookHandle: EntryFieldTypes.Symbol
    twitterHandle: EntryFieldTypes.Symbol
    youtubeHandle: EntryFieldTypes.Symbol
    linkedInHandle: EntryFieldTypes.Symbol
  }
}

type ProfileSectionEntry = ContentEntry<ProfileSectionSkeleton>

type TherapyTypeCardSkeleton = {
  contentTypeId: string
  fields: {
    image: EntryFieldTypes.AssetLink
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    subtitle: EntryFieldTypes.Symbol
    summary: EntryFieldTypes.RichText
    content: EntryFieldTypes.RichText
    pageToLinkTo?: EntryFieldTypes.EntryLink<PageSkeleton>
  }
}

type TherapyTypeCardEntry = ContentEntry<TherapyTypeCardSkeleton>

type TypesOfTherapySkeleton = {
  contentTypeId: 'therapyTypesSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    therapyTypeCards: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TherapyTypeCardSkeleton>>
  }
}

type TypesOfTherapyEntry = ContentEntry<TypesOfTherapySkeleton>

type TherapyTypeDetailsSkeleton = {
  contentTypeId: 'TherapyTypeDetailedSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    therapyTypeCard: EntryFieldTypes.EntryLink<TherapyTypeCardSkeleton>
  }
}

type TherapyTypeDetailsEntry = ContentEntry<TherapyTypeDetailsSkeleton>

type FaqItemSkeleton = {
  contentTypeId: 'faqItem'
  fields: {
    question: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    answer: EntryFieldTypes.RichText
  }
}

type FaqItemEntry = ContentEntry<FaqItemSkeleton>

type FaqSectionSkeleton = {
  contentTypeId: 'faqSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    subtitle: EntryFieldTypes.Symbol
    questions: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<FaqItemSkeleton>>
  }
}

type FaqSectionEntry = ContentEntry<FaqSectionSkeleton>

type ContactSectionSkeleton = {
  contentTypeId: 'contactSection'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    street: EntryFieldTypes.Symbol
    postcode: EntryFieldTypes.Symbol
    town: EntryFieldTypes.Symbol
    building: EntryFieldTypes.Symbol
    buildingUrl: EntryFieldTypes.Symbol
    routeUrl: EntryFieldTypes.Symbol
    directions: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    publicTransport: EntryFieldTypes.Symbol
    bicycle: EntryFieldTypes.Symbol
    car: EntryFieldTypes.Symbol
    email: EntryFieldTypes.Symbol
    emailNote: EntryFieldTypes.Symbol
    phone: EntryFieldTypes.Symbol
    phoneNote: EntryFieldTypes.Text
    referral: EntryFieldTypes.Text
    officeHours: EntryFieldTypes.EntryLink<OfficeHoursSkeleton>
    crisis: EntryFieldTypes.Text
    cover: EntryFieldTypes.Text
    cancelling: EntryFieldTypes.Text
    registration: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }
}

type ContactSectionEntry = ContentEntry<ContactSectionSkeleton>

type SectionSkeleton =
  | BasicSectionSkeleton
  | OfficeHoursSkeleton
  | ProfileSectionSkeleton
  | TypesOfTherapySkeleton
  | TherapyTypeDetailsSkeleton
  | FaqSectionSkeleton
  | ContactSectionSkeleton

type SectionEntry =
  | BasicSectionEntry
  | OfficeHoursEntry
  | ProfileSectionEntry
  | TypesOfTherapyEntry
  | TherapyTypeDetailsEntry
  | FaqSectionEntry
  | ContactSectionEntry
