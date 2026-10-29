import cx from 'classnames'
import { useRouter } from 'next/router'
import type { JSX } from 'react'
import { Day, translateDay } from '../../../core/locale'
import { useClientValue } from '../../../core/useClientValue'
import { enforceEnDash } from '../../../core/utils'
import { OfficeHoursEntry } from '../../../types/section'
import FadeIntoView from '../../animations/fade-into-view'

const txClosed = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'Closed'
    case 'nl':
    default:
      return 'Gesloten'
  }
}

const txExceptions = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'Details'
    case 'nl':
    default:
      return 'Bijzonderheden'
  }
}

const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const today = (): Day => new Date().toLocaleString('en-US', { weekday: 'long' }) as Day

interface Props {
  section: OfficeHoursEntry
  index?: number
}

const OfficeHoursSection = ({ section, index }: Props): JSX.Element => {
  const { locale } = useRouter()

  // `new Date()` differs between the server's clock and the browser's, so the
  // today-aware reorder and highlight only apply once rendering in the browser.
  const thisDay = useClientValue<Day | null>(today, null)

  const daysStartingWithToday = thisDay
    ? days.slice(days.indexOf(thisDay), days.length).concat(days.slice(0, days.indexOf(thisDay)))
    : days

  const { title, slug, exceptions } = section.fields

  const row = (day: Day, hours: string) => (
    <tr
      key={day}
      className={cx({
        'font-bold': day === thisDay,
        'opacity-85': day !== thisDay,
      })}
    >
      <td className="">{translateDay(day, locale)}</td>
      <td className="pl-5">{enforceEnDash(hours)}</td>
    </tr>
  )

  const backgroundClass = index % 2 === 0 ? 'bg-[#bfc6d6]' : 'bg-white'
  return (
    <section id={slug} className={`w-full px-4 md:px-8 py-16 md:py-24 ${backgroundClass} xl:px-0`}>
      <div className="flex flex-col max-w-4xl mx-auto">
        <FadeIntoView>
          <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-12">{title}</h2>
        </FadeIntoView>

        <FadeIntoView>
          <table className="font-sans">
            <tbody>
              {daysStartingWithToday.map((day) =>
                row(day, section.fields[day.toLowerCase()] || txClosed(locale)),
              )}
            </tbody>
          </table>
        </FadeIntoView>

        {exceptions && (
          <FadeIntoView>
            <div className="font-sans">
              <h3 className="text-xl mt-6 mb-2.5 font-semibold leading-6">
                {txExceptions(locale)}
              </h3>

              <ul className="list-disc list-inside pl-5">
                {exceptions.map((exception) => (
                  <li key={exception}>{exception}</li>
                ))}
              </ul>
            </div>
          </FadeIntoView>
        )}
      </div>
    </section>
  )
}

export default OfficeHoursSection
