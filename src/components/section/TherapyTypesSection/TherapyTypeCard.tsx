import { TherapyTypeCardEntry } from '../../../types/section';
import FadeIntoView from '../../animations/fade-into-view';
import Link from 'next/link';
import { useMemo } from 'react';
import { renderContent } from '../../content/renderContent';
import Image from 'next/image';
import cx from 'classnames';

interface Props {
  card: TherapyTypeCardEntry;
}

export const TherapyTypeCard = ({ card }: Props): JSX.Element => {
  const { title, slug, subtitle, summary, image, pageToLinkTo } = card.fields;

  const link = useMemo(() => {
    if (!pageToLinkTo) return '#';

    return pageToLinkTo.fields.parentPage
      ? `/${pageToLinkTo.fields.parentPage.fields.slug}/${pageToLinkTo.fields.slug}`
      : `/${pageToLinkTo.fields.slug}`;
  }, [pageToLinkTo]);

  const imageProps = {
    src: `https:${image.fields.file.url}`,
    width: image.fields.file.details.image.width,
    height: image.fields.file.details.image.height,
    className: 'h-full w-full object-cover',
  };

  return (
    <article
      id={slug}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 shadow-soft ring-1 ring-brand-denim/10 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <FadeIntoView>
        <Link href={link} className="relative block h-52 overflow-hidden">
          <Image {...imageProps} alt={title} sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" />
          {subtitle && (
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-denim shadow-sm">
              {subtitle}
            </span>
          )}
        </Link>
      </FadeIntoView>

      <div className="flex flex-1 flex-col gap-6 px-6 py-8">
        <FadeIntoView>
          <h3 className="text-2xl font-semibold text-brand-ink">
            <Link href={link} className="transition hover:text-brand-denim">
              {title}
            </Link>
          </h3>
        </FadeIntoView>

        <FadeIntoView>
          <div className={cx('prose prose-base max-w-none text-neutral-600')}>{renderContent(summary)}</div>
        </FadeIntoView>

        <FadeIntoView delay={200}>
          <div className="mt-auto">
            <Link href={link} className="button-secondary">
              Lees meer
            </Link>
          </div>
        </FadeIntoView>
      </div>
    </article>
  );
};
