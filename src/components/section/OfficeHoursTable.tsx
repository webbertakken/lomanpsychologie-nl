import cx from 'classnames'
import type { JSX } from 'react'
import { type Day, translateDay } from '../../core/locale'
import { useClientValue } from '../../core/useClientValue'
import { useCopy, useLanguage } from '../../core/useLanguage'
import { enforceEnDash } from '../../core/utils'
import type { OfficeHoursEntry } from '../../types/section'

const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const capitalise = (text: string): string => text.charAt(0).toLocaleUpperCase('nl') + text.slice(1)

const today = (): Day => new Date().toLocaleString('en-US', { weekday: 'long' }) as Day

interface Props {
  hours: OfficeHoursEntry['fields']
  /** Tighter rows, for a table beside other information. */
  compact?: boolean
}

/** Opening hours as a timetable; today is marked by a doubled rule and the word "today". */
const OfficeHoursTable = ({ hours, compact }: Props): JSX.Element => {
  const language = useLanguage()
  const copy = useCopy()
  // The server's clock and the browser's differ, so "today" is only marked in the browser.
  const thisDay = useClientValue<Day | null>(today, null)
  const row = compact ? 'py-2' : 'py-3'

  return (
    <table className="w-full max-w-md border-t-2 border-rule-strong tabular-nums">
      <thead className="sr-only">
        <tr>
          <th scope="col">{copy.day}</th>
          <th scope="col">{copy.hours}</th>
        </tr>
      </thead>
      <tbody>
        {days.map((day) => {
          const value = hours[day.toLowerCase() as Lowercase<Day>] as string | undefined
          const isToday = day === thisDay
          return (
            <tr
              key={day}
              className={cx(
                'border-b',
                isToday ? 'border-b-[3px] border-double border-rule-strong' : 'border-rule',
              )}
            >
              <th scope="row" className={cx(row, 'pr-4 text-left font-bold')}>
                {capitalise(translateDay(day, language))}
                <span className={cx('ml-2 text-sm font-bold text-label', !isToday && 'invisible')}>
                  {copy.today}
                </span>
              </th>
              <td className={cx(row, 'text-right', !value && 'text-ink-soft')}>
                {value ? capitalise(enforceEnDash(value)) : copy.closed}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default OfficeHoursTable
