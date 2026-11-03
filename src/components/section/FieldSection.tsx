import cx from 'classnames'
import type { JSX, ReactNode } from 'react'

interface Props {
  slug: string
  title: string
  subtitle?: string
  isFirst?: boolean
  children: ReactNode
}

/**
 * One field of the practice's form: its name in the left column, stays in
 * view while the answer on the right is read.
 */
const FieldSection = ({ slug, title, subtitle, isFirst, children }: Props): JSX.Element => (
  <section id={slug} aria-labelledby={`${slug}-titel`} className="sheet">
    <div
      className={cx('grid gap-5 py-12 md:py-16 lg:grid-cols-12 lg:gap-10', !isFirst && 'border-t')}
    >
      <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <h2 id={`${slug}-titel`} className="text-3xl md:text-4xl">
          {title}
        </h2>
        {subtitle?.trim() && <p className="mt-3 font-bold text-label">{subtitle.trim()}</p>}
      </header>
      <div className="lg:col-span-8">{children}</div>
    </div>
  </section>
)

export default FieldSection
