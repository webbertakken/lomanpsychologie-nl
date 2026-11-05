import Image from 'next/image'
import type { JSX } from 'react'
import type { IconType } from 'react-icons'
import { LuArrowRight, LuClock, LuLinkedin, LuMail, LuPhone } from 'react-icons/lu'
import type { Copy } from '../../core/copy'
import { isResolved } from '../../core/links'
import { practice } from '../../core/practice'
import { type Anchor, anchorsOf } from '../../core/sectionIndex'
import { useCopy } from '../../core/useLanguage'
import type { ProfileSectionEntry, SectionEntry } from '../../types/section'
import { renderContent } from '../content/renderContent'
import { useSiteChrome } from '../page/context/AppContext'
import RegistrationStop from '../page/RegistrationStop'
import SectionIndex from '../page/SectionIndex'

interface Props {
  section: ProfileSectionEntry
  pageSections: SectionEntry[]
}

const waitingTimeOf = (anchors: Anchor[]): Anchor | undefined =>
  anchors.find(({ title }) => /wacht|toegangstijd|waiting|access time/i.test(title))

interface CardRow {
  name: string
  href: string
  text: string
  icon: IconType
}

const cardRows = (waitingTime: Anchor | undefined, copy: Copy): CardRow[] => [
  ...(waitingTime
    ? [
        {
          name: copy.waitingTime,
          href: `#${waitingTime.slug}`,
          text: copy.currentWaitingTime,
          icon: LuClock,
        },
      ]
    : []),
  { name: copy.email, href: practice.email.href, text: practice.email.label, icon: LuMail },
  { name: copy.phone, href: practice.phone.href, text: practice.phone.label, icon: LuPhone },
]

/** The appointment card: whether and how to register, filled in like the practice's own card. */
const AppointmentCard = ({ anchors }: { anchors: Anchor[] }) => {
  const waitingTime = waitingTimeOf(anchors)
  const copy = useCopy()
  const isStopped = Boolean(useSiteChrome().registrationStop?.fields.isEnabled)

  return (
    <aside
      aria-labelledby="afspraak-titel"
      className="animate-settle border border-rule-strong bg-paper p-6 md:p-8"
    >
      <h2 id="afspraak-titel" className="text-2xl md:text-3xl">
        {copy.appointmentTitle}
      </h2>
      {isStopped ? (
        <div className="mt-3">
          <RegistrationStop />
        </div>
      ) : (
        <p className="mt-2 text-ink-soft">
          {copy.appointmentLead}
          {waitingTime && ` ${copy.appointmentWaitingFirst}`}
        </p>
      )}

      <dl className="@container mt-5">
        <div aria-hidden className="animate-rule-in h-px bg-rule-strong" />
        {cardRows(waitingTime, copy).map(({ name, href, text, icon: Icon }) => (
          <div
            key={name}
            className="grid grid-cols-1 border-b border-rule @sm:grid-cols-[6rem_1fr] @sm:items-center"
          >
            <dt className="pt-2.5 text-sm font-bold text-label @sm:pt-0">{name}</dt>
            <dd>
              <a
                href={href}
                className="flex min-h-11 items-center gap-2 font-bold no-underline hover:underline hover:decoration-rule-strong"
              >
                <Icon aria-hidden className="size-4.5 shrink-0 text-label" />
                <span className="tabular-nums [overflow-wrap:anywhere]">{text}</span>
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

const IntroSection = ({ section, pageSections }: Props): JSX.Element | null => {
  const { title, slug, photo, vocation, location, shortDescription, linkedInHandle } =
    section.fields
  const copy = useCopy()
  if (!isResolved(photo)) return null

  const { url, details } = photo.fields.file
  const anchors = anchorsOf(pageSections)

  // Name, her words and the page index on the left; the portrait on the right
  // with the appointment card under it, clear of the photo. On a phone the
  // portrait sits next to her name and her words come before the card, in the
  // DOM as on screen.
  return (
    <section id={slug} aria-labelledby={`${slug}-titel`} className="border-b">
      <div className="sheet grid grid-cols-[1fr_6.5rem] gap-x-5 gap-y-8 pt-10 pb-12 sm:grid-cols-[1fr_9rem] md:pt-14 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:pb-16">
        <div className="self-center lg:col-span-7 lg:self-start">
          <h1 id={`${slug}-titel`} className="text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-3 text-lg font-bold text-label hyphens-none md:text-xl">
            {[vocation, location].filter(Boolean).join(' in ')}
          </p>
          {linkedInHandle && (
            <a
              href={`https://www.linkedin.com/in/${linkedInHandle}`}
              className="link mt-2 inline-flex min-h-11 items-center gap-2 text-ink-soft"
              rel="noopener noreferrer"
            >
              <LuLinkedin aria-hidden className="size-4.5" />
              {copy.onLinkedIn(title)}
            </a>
          )}
        </div>

        <div className="col-span-2 font-display text-xl leading-snug md:text-[1.65rem] lg:col-span-6 lg:col-start-1 lg:row-start-2 [&_p+p]:mt-3">
          {renderContent(shortDescription)}
        </div>

        <div className="contents lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:block">
          <Image
            src={`https:${url}`}
            width={details.image.width}
            height={details.image.height}
            alt={copy.portraitOf(title)}
            priority
            sizes="(min-width: 1024px) 30rem, 9rem"
            className="col-start-2 row-start-1 aspect-[4/5] w-full border border-rule object-cover object-top lg:aspect-square"
          />
          <div className="col-span-2 lg:mt-8">
            <AppointmentCard anchors={anchors} />
          </div>
        </div>

        <div className="col-span-2 lg:col-span-6 lg:col-start-1 lg:row-start-3">
          <SectionIndex anchors={anchors} />
        </div>
      </div>
    </section>
  )
}

export default IntroSection
