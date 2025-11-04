import { ProcessTimelineSectionEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import { renderContent } from '../../content/renderContent';
import Link from 'next/link';

interface Props {
  section: ProcessTimelineSectionEntry;
  index?: number;
}

const ProcessTimelineSection = ({ section, index = 0 }: Props): JSX.Element => {
  const { title, slug, introduction, steps, ctaLink, ctaText } = section.fields;
  const backgroundClass = index % 2 === 0 ? 'bg-white/95' : 'bg-brand-blush/80';

  return (
    <section id={slug} className={`w-full px-6 py-24 md:px-10 ${backgroundClass}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <FadeIntoView>
          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="inline-flex w-fit items-center self-center rounded-full bg-brand-sky/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim md:self-start">
              Aanpak
            </span>
            <h2 className="text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">{title}</h2>
            {introduction && (
              <div className="prose prose-lg mx-auto max-w-3xl text-neutral-600 md:mx-0">
                {renderContent(introduction)}
              </div>
            )}
          </div>
        </FadeIntoView>

        <FadeIntoView>
          <ol className="relative ml-2 border-l border-brand-denim/20 pl-8">
            {steps?.map((step, idx) => {
              const { title: stepTitle, description, duration } = step.fields;
              return (
                <li key={step.sys.id} className="group mb-12 last:mb-0">
                  <span className="absolute -left-[37px] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-brand-denim shadow-soft ring-1 ring-brand-denim/15">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-3 rounded-3xl bg-white/90 p-6 shadow-soft ring-1 ring-brand-denim/10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-brand-ink">{stepTitle}</h3>
                      {duration && (
                        <span className="rounded-full bg-brand-sky/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-denim">
                          {duration}
                        </span>
                      )}
                    </div>
                    <div className="prose prose-base max-w-none text-neutral-600">
                      {renderContent(description)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </FadeIntoView>

        {ctaLink && (
          <FadeIntoView>
            <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand-denim text-white p-8 md:flex-row md:items-center md:justify-between">
              <p className="text-lg font-semibold">{ctaText || 'Klaar om de eerste stap te zetten?'}</p>
              {ctaLink.startsWith('/') ? (
                <Link href={ctaLink} className="button-primary bg-white text-brand-denim hover:bg-brand-sky">
                  Plan een gesprek
                </Link>
              ) : (
                <a href={ctaLink} className="button-primary bg-white text-brand-denim hover:bg-brand-sky">
                  Plan een gesprek
                </a>
              )}
            </div>
          </FadeIntoView>
        )}
      </div>
    </section>
  );
};

export default ProcessTimelineSection;

