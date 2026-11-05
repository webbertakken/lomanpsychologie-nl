import type { JSX } from 'react'
import { useCopy } from '../../core/useLanguage'
import PlainText from '../content/PlainText'
import { useSiteChrome } from './context/AppContext'

/** Says, where people get in touch, that the practice takes no new referrals for now. */
const RegistrationStop = (): JSX.Element | null => {
  const { registrationStop } = useSiteChrome()
  const copy = useCopy()
  if (!registrationStop?.fields.isEnabled) return null

  return (
    <div>
      <p className="stamp font-sans">{copy.registrationStop}</p>
      <PlainText text={registrationStop.fields.message} className="mt-1.5" />
    </div>
  )
}

export default RegistrationStop
