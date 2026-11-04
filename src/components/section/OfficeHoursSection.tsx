import cx from 'classnames'
import { useRouter } from 'next/router'
import type { JSX } from 'react'
import { type Day, translateDay } from '../../core/locale'
import { useClientValue } from '../../core/useClientValue'
import { useCopy } from '../../core/useLanguage'
import { enforceEnDash } from '../../core/utils'
import type { OfficeHoursEntry } from '../../types/section'
import FieldSection from './FieldSection'

const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const capitalise = (text: string): string => text.charAt(0).toLocaleUpperCase('nl') + text.slice(1)

const today = (): Day => new Date().toLocaleString('en-US', { weekday: 'long' }) as Day

interface Props {
  section: OfficeHoursEntry
  isFirst?: boolean
}

const OfficeHoursSection = ({ section, isFirst }: Props): JSX.Element => {
  const { locale = 'nl' } = useRouter()
  const tx = useCopy()

  // The server's clock and the browser's differ, so "today" is only marked in the browser.
  const thisDay = useClientValue<Day | null>(today, null)
  const { title, slug, exceptions } = section.fields

  return (
    <FieldSection slug={slug} title={title} isFirst={isFirst}>
      <table className="w-full max-w-md border-t-2 border-rule-strong tabular-nums">
        <thead className="sr-only">
          <tr>
            <th scope="col">{tx.day}</th>
            <th scope="col">{tx.hours}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => {
            const hours = section.fields[day.toLowerCase() as Lowercase<Day>] as string | undefined
            const isToday = day === thisDay
            return (
              <tr
                key={day}
                className={cx(
                  'border-b',
                  isToday ? 'border-b-[3px] border-double border-rule-strong' : 'border-rule',
                )}
              >
                <th scope="row" className="py-3 pr-4 text-left font-bold">
                  {capitalise(translateDay(day, locale))}
                  <span
                    className={cx('ml-2 text-sm font-bold text-label', !isToday && 'invisible')}
                  >
                    {tx.today}
                  </span>
                </th>
                <td className={cx('py-3 text-right', !hours && 'text-ink-soft')}>
                  {hours ? capitalise(enforceEnDash(hours)) : tx.closed}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {exceptions && exceptions.length > 0 && (
        <div className="rich-text mt-10">
          <h3>{tx.details}</h3>
          <ul>
            {exceptions.map((exception) => (
              <li key={exception}>{exception}</li>
            ))}
          </ul>
        </div>
      )}
    </FieldSection>
  )
}

export default OfficeHoursSection
