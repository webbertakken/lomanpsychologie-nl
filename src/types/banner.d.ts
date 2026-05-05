import { Entry } from 'contentful'

interface BannerNotificationProps {
  isEnabled: boolean
  message: string
}

type BannerNotificationEntry = Entry<BannerNotificationProps>
