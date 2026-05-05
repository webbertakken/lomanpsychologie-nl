import { TherapyTypeDetailsEntry } from '../../../types/section'
import FadeIntoView from '../../animations/fade-into-view'
import { renderContent } from '../../content/renderContent'

interface Props {
  section: TherapyTypeDetailsEntry
}

const TherapyTypeDetailsSection = ({ section }: Props): JSX.Element => {
  const { slug, therapyTypeCard } = section.fields
  const { title, subtitle, image, content } = therapyTypeCard.fields

  const imageProps = {
    src: `https:${image.fields.file.url}`,
    width: image.fields.file.details.image.width,
    height: image.fields.file.details.image.height,
  }

  return (
    <section id={slug} className="w-full bg-white -mt-24">
      <div
        className="w-full h-screen bg-cover"
        style={{ backgroundImage: `url(${imageProps.src}` }}
      >
        <div className="pt-24 h-full w-full flex flex-col items-center justify-center gap-3">
          <div className="h-2/5" />

          <FadeIntoView className="px-3">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-white py-3 px-3 sm:px-12 rounded text-center">
              {title}
            </h1>
          </FadeIntoView>

          <FadeIntoView className="px-3">
            <p className="text-xl md:text-xl lg:text-2xl bg-white py-3 px-3 sm:px-12 rounded text-center">
              {subtitle}
            </p>
          </FadeIntoView>
        </div>
      </div>
      <div className="max-w-3xl md:p-6 lg:py-12 sm:text-center mx-auto">
        <div className="w-full px-6 md:px-0">
          <FadeIntoView>
            <div className="prose text-base text-gray-600 lg:text-lg mx-auto">
              {renderContent(content)}
            </div>
          </FadeIntoView>
        </div>
      </div>
    </section>
  )
}

export default TherapyTypeDetailsSection
