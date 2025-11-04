import Image from 'next/image';
import { renderContent } from '../../content/renderContent';
import { TestimonialEntry } from '../../../types/section';

interface Props {
  testimonial: TestimonialEntry;
}

export const TestimonialCard = ({ testimonial }: Props): JSX.Element => {
  const { quote, author, role, portrait } = testimonial.fields;

  const portraitImage = portrait?.fields?.file?.url
    ? {
        src: `https:${portrait.fields.file.url}`,
        width: portrait.fields.file.details.image.width,
        height: portrait.fields.file.details.image.height,
      }
    : null;

  return (
    <figure className="flex h-full flex-col gap-6 rounded-3xl bg-white/90 p-8 shadow-soft ring-1 ring-brand-denim/10">
      <div className="text-brand-denim">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M9.5 4C6.46243 4 4 6.46243 4 9.5C4 12.5376 6.46243 15 9.5 15H11V20C11 20.5523 11.4477 21 12 21H13C13.5523 21 14 20.5523 14 20V11C14 7.68629 11.3137 5 8 5H7C6.44772 5 6 4.55228 6 4V3C6 2.44772 6.44772 2 7 2H9.5ZM19.5 4C16.4624 4 14 6.46243 14 9.5C14 12.5376 16.4624 15 19.5 15H21V20C21 20.5523 21.4477 21 22 21H23C23.5523 21 24 20.5523 24 20V11C24 7.68629 21.3137 5 18 5H17C16.4477 5 16 4.55228 16 4V3C16 2.44772 16.4477 2 17 2H19.5Z"
            fill="currentColor"
            fillOpacity={0.2}
          />
        </svg>
      </div>

      <blockquote className="prose prose-lg max-w-none text-neutral-600">
        {renderContent(quote)}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-4">
        {portraitImage && (
          <Image
            alt={author}
            {...portraitImage}
            className="h-12 w-12 rounded-full object-cover"
            sizes="48px"
          />
        )}
        <div>
          <p className="text-base font-semibold text-brand-ink">{author}</p>
          {role && <p className="text-sm text-neutral-500">{role}</p>}
        </div>
      </figcaption>
    </figure>
  );
};

