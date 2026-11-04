import Link from 'next/link'
import type { JSX, ReactNode } from 'react'
import { LuChevronRight } from 'react-icons/lu'

export interface Crumb {
  title: string
  path: string
}

interface Props {
  title: string
  lead?: string
  parent?: Crumb
  children?: ReactNode
}

/** The heading block of a page that has no section of its own to introduce it. */
const PageHeader = ({ title, lead, parent, children }: Props): JSX.Element => (
  <div className="sheet pt-12 pb-2 md:pt-20">
    {parent && (
      <nav aria-label="Kruimelpad" className="mb-5 text-sm">
        <Link href={parent.path} className="link inline-flex items-center gap-1 text-ink-soft">
          {parent.title}
          <LuChevronRight aria-hidden className="size-3.5" />
        </Link>
      </nav>
    )}
    <h1 className="max-w-4xl text-4xl md:text-6xl">{title}</h1>
    {lead && lead.trim() !== title.trim() && (
      <p className="mt-5 max-w-2xl text-xl text-ink-soft md:text-2xl">{lead}</p>
    )}
    {children && <div className="mt-5 max-w-2xl text-lg text-ink-soft">{children}</div>}
    <div aria-hidden className="animate-rule-in mt-8 h-px bg-rule-strong md:mt-12" />
  </div>
)

export default PageHeader
