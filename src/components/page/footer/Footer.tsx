import Link from 'next/link'
import type { JSX } from 'react'
import { practice } from '../../../core/practice'
import { useCopy } from '../../../core/useLanguage'
import { useSiteChrome } from '../context/AppContext'
import Logo from '../header/Logo'
import PracticeContact from '../PracticeContact'

const Footer = (): JSX.Element => {
  const { footerMenu } = useSiteChrome()
  const copy = useCopy()

  return (
    <footer className="mt-24 border-t bg-paper-deep">
      <div className="sheet grid gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="h-12 w-auto" />
          <p className="mt-5 max-w-xs text-ink-soft">
            {copy.footerAbout(practice.psychologist, practice.building, practice.town)}
          </p>
        </div>
        <div className="lg:col-span-8">
          <PracticeContact />
        </div>
      </div>

      <div className="border-t">
        <div className="sheet flex flex-col gap-4 py-6 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
          <nav aria-label={copy.footerMenu}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {footerMenu.map(({ path, title }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="inline-flex min-h-11 items-center hover:text-ink hover:underline"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>© {practice.name}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
