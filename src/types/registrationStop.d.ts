import type { EntryFieldTypes } from 'contentful'
import type { ContentEntry } from './contentful'

/** The practice's switch for "no new referrals for now", with its own note. */
type RegistrationStopSkeleton = {
  contentTypeId: 'registrationStop'
  fields: {
    isEnabled: EntryFieldTypes.Boolean
    message: EntryFieldTypes.Text
  }
}

type RegistrationStopEntry = ContentEntry<RegistrationStopSkeleton>
