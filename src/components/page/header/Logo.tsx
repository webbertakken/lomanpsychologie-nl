import Image from 'next/image'
import Link from 'next/link'
import type { JSX } from 'react'
import logo from '../../../assets/logo.svg'
import { practice } from '../../../core/practice'
import { useCopy } from '../../../core/useLanguage'

const Logo = ({ className = 'h-11 w-auto' }: { className?: string }): JSX.Element => {
  const copy = useCopy()
  return (
    <Link href="/" className="inline-flex shrink-0 rounded-[2px]">
      <Image src={logo} alt={copy.logoAlt(practice.name)} className={className} priority />
    </Link>
  )
}

export default Logo
