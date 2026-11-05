import Link from 'next/link'
import type { JSX } from 'react'
import { practice } from '../../../core/practice'
import { useCopy } from '../../../core/useLanguage'
import { useSiteChrome } from '../context/AppContext'
import ThemeToggle from '../ThemeToggle'
import DesktopNav from './DesktopNav'
import LanguageSwitch from './LanguageSwitch'
import Logo from './Logo'
import MobileNav from './MobileNav'

const Header = (): JSX.Element => {
  const copy = useCopy()
  const { contactPath } = useSiteChrome()
  return (
    <header className="sticky top-0 z-30 border-b bg-paper">
      <div className="sheet flex h-18 items-center justify-between gap-6">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <a
            href={practice.phone.href}
            className="link hidden font-bold tabular-nums no-underline hover:underline xl:inline"
          >
            {practice.phone.label}
          </a>
          <Link href={contactPath} className="button button-ink hidden lg:inline-flex">
            {copy.contact}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
