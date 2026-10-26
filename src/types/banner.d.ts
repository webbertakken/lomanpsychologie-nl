import type { EntryFieldTypes } from 'contentful'
import type { ContentEntry } from './contentful'

type BannerNotificationSkeleton = {
  contentTypeId: 'bannerNotification'
  fields: {
    isEnabled: EntryFieldTypes.Boolean
    message: EntryFieldTypes.Text
  }
}

type BannerNotificationEntry = ContentEntry<BannerNotificationSkeleton>
