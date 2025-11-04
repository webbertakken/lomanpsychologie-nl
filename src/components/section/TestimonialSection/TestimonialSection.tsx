import { TestimonialSectionEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import { renderContent } from '../../content/renderContent';
import { TestimonialCard } from './TestimonialCard';

interface Props {
  section: TestimonialSectionEntry;
  index?: number;
}

const TestimonialSection = ({ section, index = 0 }: Props): JSX.Element => {
  const { title, slug, introduction, testimonials, highlight } = section.fields;
  const backgroundClass = index % 2 === 0 ? 'bg-brand-blush/80' : 'bg-white/95';

  return (
    <section id={slug} className={`w-full px-6 py-24 md:px-10 ${backgroundClass}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <FadeIntoView>
          <div className="flex flex-col gap-4 text-center md:text-left">
            {highlight && (
              <span className="inline-flex w-fit items-center self-center rounded-full bg-brand-sky/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-denim md:self-start">
                {highlight}
              </span>
            )}
            <h2 className="text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">{title}</h2>
            {introduction && (
              <div className="prose prose-lg mx-auto max-w-3xl text-neutral-600 md:mx-0">
                {renderContent(introduction)}
              </div>
            )}
          </div>
        </FadeIntoView>

        <FadeIntoView>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials?.map((testimonial) => (
              <TestimonialCard key={testimonial.sys.id} testimonial={testimonial} />
            ))}
          </div>
        </FadeIntoView>
      </div>
    </section>
  );
};

export default TestimonialSection;

