import type { JSX } from 'react'
import { useCopy } from '../../../core/useLanguage'
import { useSiteChrome } from '../context/AppContext'

/** A temporary notice from the practice, such as a holiday closure. */
const Banner = (): JSX.Element | null => {
  const { banner } = useSiteChrome()
  const copy = useCopy()
  if (!banner?.fields.isEnabled || !banner.fields.message) return null

  return (
    <aside aria-label={copy.noticeLabel} className="border-b bg-paper-deep">
      <p className="sheet flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
        <span className="stamp">{copy.notice}</span>
        <span>{banner.fields.message}</span>
      </p>
    </aside>
  )
}

export default Banner
