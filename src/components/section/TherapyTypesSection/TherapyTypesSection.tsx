import { TypesOfTherapyEntry } from '../../../types/section';
import { TherapyTypeCard } from './TherapyTypeCard';
import { renderContent } from '../../content/renderContent';

interface Props {
  section: TypesOfTherapyEntry;
}

const TherapyTypesSection = ({ section }: Props): JSX.Element => {
  const { slug, therapyTypeCards, title, shortDescription, getInTouchLink, getInTouchText } = section.fields;

  return (
    <section id={slug} className="w-full bg-white/95 px-6 py-24 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-brand-sky/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim">
              Aanbod
            </span>
            <h2 className="text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">{title}</h2>
          </div>
          {shortDescription && (
            <div className="prose prose-lg max-w-none text-neutral-600">
              {renderContent(shortDescription)}
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {therapyTypeCards?.map((card) => (
            <TherapyTypeCard key={card.sys.id} card={card} />
          ))}
        </div>

        {getInTouchLink && (
          <div className="flex flex-col items-start gap-4 rounded-3xl bg-brand-blush/70 p-8 text-brand-ink shadow-soft md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">{getInTouchText || 'Niet zeker welke begeleiding past? Ik denk graag mee.'}</p>
            <a href={getInTouchLink} className="button-secondary">
              Neem contact op
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TherapyTypesSection;
