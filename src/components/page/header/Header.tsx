import Link from 'next/link'
import type { JSX } from 'react'
import { practice } from '../../../core/practice'
import DesktopNav from './DesktopNav'
import Logo from './Logo'
import MobileNav from './MobileNav'

const Header = (): JSX.Element => (
  <header className="sticky top-0 z-30 border-b bg-paper">
    <div className="sheet flex h-18 items-center justify-between gap-6">
      <Logo />
      <DesktopNav />
      <div className="flex items-center gap-3">
        <a
          href={practice.phone.href}
          className="link hidden font-bold tabular-nums no-underline hover:underline xl:inline"
        >
          {practice.phone.label}
        </a>
        <Link href="/contact" className="button button-ink hidden md:inline-flex">
          Contact
        </Link>
        <MobileNav />
      </div>
    </div>
  </header>
)

export default Header
