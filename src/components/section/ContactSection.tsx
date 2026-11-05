import type { JSX, ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { LuBike, LuCar, LuMail, LuMapPin, LuPhone, LuTrainFront } from 'react-icons/lu'
import { isResolved } from '../../core/links'
import { practice } from '../../core/practice'
import { useCopy } from '../../core/useLanguage'
import type { ContactSectionEntry } from '../../types/section'
import PlainText from '../content/PlainText'
import RegistrationStop from '../page/RegistrationStop'
import OfficeHoursTable from './OfficeHoursTable'

const Label = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="font-sans text-sm font-bold text-label">
    {children}
  </h2>
)

const Channel = ({
  href,
  icon: Icon,
  value,
  note,
}: {
  href: string
  icon: IconType
  value: string
  note?: string
}) => (
  <div className="py-3">
    <a
      href={href}
      className="inline-flex min-h-11 items-center gap-2 text-xl font-bold tabular-nums no-underline hover:underline hover:decoration-rule-strong [overflow-wrap:anywhere]"
    >
      <Icon aria-hidden className="size-5 shrink-0 text-label" />
      {value}
    </a>
    <PlainText text={note} className="text-ink-soft" />
  </div>
)

/**
 * The contact page, wayfinding first: the address as on an envelope, the way
 * to the waiting room, then every way to reach the practice.
 */
const ContactSection = ({ section }: { section: ContactSectionEntry }): JSX.Element => {
  const copy = useCopy()
  const { slug, street, postcode, town, building, routeUrl, directions, email, phone } =
    section.fields
  const { publicTransport, bicycle, car, emailNote, phoneNote, officeHours } = section.fields
  const { referral, crisis, cover, cancelling, registration } = section.fields

  const travel: Array<[IconType, string | undefined]> = [
    [LuTrainFront, publicTransport],
    [LuBike, bicycle],
    [LuCar, car],
  ]

  return (
    <section id={slug} aria-label={section.fields.title} className="sheet pb-8">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <div className="animate-settle border border-rule-strong p-6 sm:p-8 md:p-10">
            <Label>{copy.visitingAddress}</Label>
            <address className="mt-3 font-display text-3xl leading-tight not-italic [overflow-wrap:anywhere] sm:text-4xl md:text-5xl">
              {practice.name}
              <br />
              {street}
              <br />
              {postcode} {town}
            </address>
            {building && <p className="mt-4 text-ink-soft">{copy.inBuilding(building)}</p>}
            {routeUrl && (
              <a href={routeUrl} className="button button-ink mt-6" rel="noopener noreferrer">
                <LuMapPin aria-hidden className="size-4.5" />
                {copy.planRoute}
              </a>
            )}
          </div>

          {directions && directions.length > 0 && (
            <div className="mt-10">
              <Label id={`${slug}-route`}>{copy.wayIn}</Label>
              <ol aria-labelledby={`${slug}-route`} className="mt-3 border-t-2 border-rule-strong">
                {directions.map((step, index) => (
                  <li key={step} className="grid grid-cols-[3rem_1fr] border-b py-4">
                    <span aria-hidden className="font-display text-2xl leading-none text-label">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {travel.some(([, text]) => text) && (
            <div className="mt-8">
              <Label>{copy.gettingThere}</Label>
              <ul className="mt-3 grid gap-3 text-ink-soft sm:grid-cols-3">
                {travel
                  .filter(([, text]) => text)
                  .map(([Icon, text]) => (
                    <li key={text} className="flex gap-2">
                      <Icon aria-hidden className="mt-1 size-4.5 shrink-0 text-label" />
                      {text}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid content-start gap-10 lg:col-span-5">
          <div>
            <Label>{copy.reachPractice}</Label>
            <div className="mt-3 grid gap-4 empty:hidden">
              <RegistrationStop />
              <PlainText text={referral} className="text-ink-soft" />
            </div>
            {email && (
              <Channel href={`mailto:${email}`} icon={LuMail} value={email} note={emailNote} />
            )}
            {phone && (
              <Channel
                href={`tel:${phone.replace(/\D/g, '')}`}
                icon={LuPhone}
                value={phone}
                note={phoneNote}
              />
            )}
          </div>

          {isResolved(officeHours) && (
            <div>
              <Label>{copy.openingHours}</Label>
              <div className="mt-3">
                <OfficeHoursTable hours={officeHours.fields} compact />
              </div>
            </div>
          )}

          {crisis && (
            <aside aria-label={copy.inCrisis} className="border-y-2 border-stamp py-5">
              <h2 className="stamp font-sans">{copy.inCrisis}</h2>
              <PlainText text={crisis} className="mt-3" />
            </aside>
          )}
        </div>
      </div>

      <div className="mt-14 grid gap-8 border-t pt-8 md:grid-cols-2">
        {cover && (
          <div>
            <Label>{copy.cover}</Label>
            <PlainText text={cover} className="mt-2" />
          </div>
        )}
        {cancelling && (
          <div>
            <Label>{copy.cancelling}</Label>
            <PlainText text={cancelling} className="mt-2" />
          </div>
        )}
      </div>

      {registration && registration.length > 0 && (
        <div className="mt-10 border-t pt-4">
          <h2 className="sr-only">{copy.registration}</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft tabular-nums">
            {registration.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default ContactSection
