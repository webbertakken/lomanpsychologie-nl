import Link from 'next/link'
import { useMemo } from 'react'
import { TherapyTypeCardEntry } from '../../../types/section'
import FadeIntoView from '../../animations/fade-into-view'
import { renderContent } from '../../content/renderContent'

interface Props {
  card: TherapyTypeCardEntry
}

export const TherapyTypeCard = ({ card }: Props): JSX.Element => {
  const { title, slug, subtitle, summary, image, pageToLinkTo } = card.fields

  const link = useMemo(() => {
    if (!pageToLinkTo) return '#'

    return pageToLinkTo.fields.parentPage
      ? `/${pageToLinkTo.fields.parentPage.fields.slug}/${pageToLinkTo.fields.slug}`
      : `/${pageToLinkTo.fields.slug}`
  }, [pageToLinkTo])

  const imageProps = {
    src: `https:${image.fields.file.url}`,
    width: image.fields.file.details.image.width,
    height: image.fields.file.details.image.height,
  }

  return (
    <div id={slug} className="max-w-3xl md:p-6 lg:py-12 sm:text-center mx-auto">
      <FadeIntoView>
        <Link href={link} className="block mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={title}
            {...imageProps}
            className="object-cover object-center w-full md:rounded h-72"
          />
        </Link>
      </FadeIntoView>

      <div className="w-full px-6 md:px-0">
        <FadeIntoView>
          <h2 className="mt-4 mb-5">
            <Link
              href={link}
              className="text-xl font-bold leading-tight tracking-tight md:text-2xl lg:text-3xl dark:text-gray-100 prata"
            >
              {title}
            </Link>
          </h2>
        </FadeIntoView>

        <FadeIntoView>
          <Link href={link}>
            <p className="mt-5 mb-6 text-xs text-gray-500 md:text-sm">{subtitle}</p>
          </Link>
        </FadeIntoView>

        <FadeIntoView>
          <div className="prose text-base text-gray-600 lg:text-lg mx-auto">
            {renderContent(summary)}
          </div>
        </FadeIntoView>

        <FadeIntoView delay={400}>
          <div className="pt-3">
            <Link href={link} className="lg:text-lg text-gray-500 hover:text-gray-700 underline">
              Lees meer »
            </Link>
          </div>
        </FadeIntoView>
      </div>

      <div className="w-full border-b border-gray-150 dark:border-gray-750 pt-12" />
    </div>
  )
}
