import cx from 'classnames'
import type { JSX, ReactNode } from 'react'
import { usePageTitle } from '../page/context/PageTitleContext'

interface Props {
  slug: string
  title: string
  subtitle?: string
  /** Shown under the title, in the column that stays in view. */
  aside?: ReactNode
  isFirst?: boolean
  children: ReactNode
}

/**
 * One field of the practice's form: its name in the left column, stays in
 * view while the answer on the right is read.
 */
const FieldSection = ({ slug, title, subtitle, aside, isFirst, children }: Props): JSX.Element => {
  // A section named like its page keeps the name for screen readers only.
  const repeatsPageTitle = usePageTitle()?.trim() === title.trim()

  return (
    <section id={slug} aria-labelledby={`${slug}-titel`} className="sheet">
      <div
        className={cx(
          'grid gap-5 py-12 md:py-16 lg:grid-cols-12 lg:gap-10',
          !isFirst && 'border-t',
        )}
      >
        <header className="lg:sticky lg:top-28 lg:col-span-4 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <h2
            id={`${slug}-titel`}
            className={cx('text-3xl md:text-4xl', repeatsPageTitle && 'sr-only')}
          >
            {title}
          </h2>
          {subtitle?.trim() && (
            <p className={cx('font-bold text-label', !repeatsPageTitle && 'mt-3')}>
              {subtitle.trim()}
            </p>
          )}
          {aside}
        </header>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  )
}

export default FieldSection
