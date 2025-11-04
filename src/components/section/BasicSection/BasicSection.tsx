import { BasicSectionEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import { renderContent } from '../../content/renderContent';

interface Props {
  section: BasicSectionEntry;
  index?: number;
}

const BasicSection = ({ section, index }: Props): JSX.Element => {
  const { title, slug, subtitle, content } = section.fields;

  const backgroundClass = index % 2 === 0 ? 'bg-brand-blush/70' : 'bg-white/90';

  return (
    <section
      id={slug}
      className={`w-full px-6 py-20 md:px-10 ${backgroundClass} xl:px-0`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <FadeIntoView>
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim">
              {subtitle || 'Inzicht'}
            </span>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{title}</h2>
          </div>
        </FadeIntoView>

        <FadeIntoView>
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4">
              {subtitle && (
                <p className="text-lg font-semibold text-brand-denim">{subtitle}</p>
              )}
              <div className="mt-6 h-1 w-16 rounded-full bg-brand-denim/40" />
            </div>

            <div className="prose prose-lg max-w-none md:col-span-8 text-neutral-600">
              {renderContent(content)}
            </div>
          </div>
        </FadeIntoView>
      </div>
    </section>
  );
};

export default BasicSection;
