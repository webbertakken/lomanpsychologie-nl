import cx from 'classnames'
import Link from 'next/link'
import type { JSX } from 'react'
import { LuLanguages } from 'react-icons/lu'
import { languageNames, languages } from '../../../core/languages'
import { useLanguage } from '../../../core/useLanguage'
import { useSiteChrome } from '../context/AppContext'

interface Props {
  className?: string
}

/** Links to this same page in the other language, named in that language. */
const LanguageSwitch = ({ className }: Props): JSX.Element => {
  const language = useLanguage()
  const { alternates } = useSiteChrome()
  const other = languages.find((candidate) => candidate !== language) ?? 'nl'

  return (
    <Link
      href={alternates[other]}
      locale={other}
      hrefLang={other}
      lang={other}
      className={cx(
        'inline-flex min-h-11 items-center gap-1.5 px-1 font-bold text-ink-soft no-underline hover:text-ink hover:underline hover:decoration-rule-strong',
        className,
      )}
    >
      <LuLanguages aria-hidden className="size-4.5 shrink-0 text-label" />
      {languageNames[other]}
    </Link>
  )
}

export default LanguageSwitch
