import { OfficeHoursEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import { useRouter } from 'next/router';
import { Day, translateDay } from '../../../core/locale';
import cx from 'classnames';
import { enforceEnDash } from '../../../core/utils';
import { HiOutlineClock, HiOutlineInformationCircle } from 'react-icons/hi';

const txClosed = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'Closed';
    case 'nl':
    default:
      return 'Gesloten';
  }
};

const txExceptions = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'Details';
    case 'nl':
    default:
      return 'Bijzonderheden';
  }
};

const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  section: OfficeHoursEntry;
  index?: number;
}

const OfficeHoursSection = ({ section, index }: Props): JSX.Element => {
  const { locale } = useRouter();
  const thisDay = new Date().toLocaleString('en-US', { weekday: 'long' }) as Day;

  const daysStartingWithToday = days
    .slice(days.indexOf(thisDay), days.length)
    .concat(days.slice(0, days.indexOf(thisDay)));

  const { title, slug, exceptions } = section.fields;

  const row = (day: Day, hours: string) => (
    <tr
      key={day}
      className={cx(
        'transition-colors',
        day === thisDay
          ? 'bg-brand-sky/60 font-semibold text-brand-denim'
          : 'text-neutral-600 hover:bg-brand-sky/30',
      )}
    >
      <td className="px-6 py-4 text-left text-sm uppercase tracking-wide text-neutral-500">
        <span className="text-xs font-semibold text-neutral-400">{translateDay(day, locale)}</span>
      </td>
      <td className="px-6 py-4 text-right text-base font-medium text-neutral-700">
        {enforceEnDash(hours)}
      </td>
    </tr>
  );

  const backgroundClass = index % 2 === 0 ? 'bg-white/90' : 'bg-brand-blush/70';
  return (
    <section
      id={slug}
      className={`w-full px-6 py-20 md:px-10 ${backgroundClass} xl:px-0`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <FadeIntoView>
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim">
              <HiOutlineClock className="h-4 w-4" aria-hidden /> Openingstijden
            </span>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{title}</h2>
          </div>
        </FadeIntoView>

        <FadeIntoView>
          <div className="overflow-hidden rounded-3xl bg-white/85 shadow-soft ring-1 ring-brand-denim/10">
            <table className="min-w-full divide-y divide-brand-denim/10 text-sm md:text-base">
              <tbody className="divide-y divide-brand-denim/10">
                {daysStartingWithToday.map((day) =>
                  row(day, section.fields[day.toLowerCase()] || txClosed(locale)),
                )}
              </tbody>
            </table>
          </div>
        </FadeIntoView>

        {exceptions && (
          <FadeIntoView>
            <div className="flex gap-4 rounded-3xl bg-white/80 p-6 text-sm text-neutral-600 shadow-sm ring-1 ring-brand-denim/10">
              <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-denim" aria-hidden />
              <div>
                <h3 className="text-base font-semibold text-brand-denim">{txExceptions(locale)}</h3>
                <ul className="mt-3 space-y-1">
                  {exceptions.map((exception) => (
                    <li key={exception}>{exception}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIntoView>
        )}
      </div>
    </section>
  );
};

export default OfficeHoursSection;
