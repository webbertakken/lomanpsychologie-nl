import type { JSX } from 'react'
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu'
import { practice } from '../../core/practice'
import { useCopy } from '../../core/useLanguage'

const row = 'flex items-start gap-3 py-2'
const icon = 'mt-1 size-4.5 shrink-0 text-label'

/** Address, phone and e-mail, plus where to go out of hours. */
const PracticeContact = (): JSX.Element => {
  const copy = useCopy()

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h2 className="mb-2 font-sans text-base font-bold">{copy.contactHeading}</h2>
        <ul>
          <li className={row}>
            <LuPhone aria-hidden className={icon} />
            <a href={practice.phone.href} className="link font-bold tabular-nums">
              {practice.phone.label}
            </a>
          </li>
          <li className={row}>
            <LuMail aria-hidden className={icon} />
            <a href={practice.email.href} className="link font-bold">
              {practice.email.label}
            </a>
          </li>
          <li className={row}>
            <LuMapPin aria-hidden className={icon} />
            <address className="not-italic">
              {practice.street}, {practice.postcode} {practice.town}
              <br />
              <a href={practice.routeUrl} className="link text-ink-soft" rel="noopener noreferrer">
                {copy.routeTo(practice.building)}
              </a>
            </address>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-sans text-base font-bold">{copy.crisisHeading}</h2>
        <p className="text-ink-soft">
          {copy.crisisNoService(practice.outOfHours.name)}{' '}
          <a href={practice.outOfHours.href} className="link font-bold text-ink tabular-nums">
            {practice.outOfHours.label}
          </a>
          . {copy.crisisSuicide}{' '}
          <a href={practice.suicidePrevention.short.href} className="link font-bold text-ink">
            {practice.suicidePrevention.short.label}
          </a>{' '}
          {copy.crisisFree}{' '}
          <a
            href={practice.suicidePrevention.free.href}
            className="link font-bold text-ink tabular-nums"
          >
            {practice.suicidePrevention.free.label}
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default PracticeContact
