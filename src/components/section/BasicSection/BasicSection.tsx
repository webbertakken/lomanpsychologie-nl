import { BasicSectionEntry } from '../../../types/section'
import FadeIntoView from '../../animations/fade-into-view'
import { renderContent } from '../../content/renderContent'

interface Props {
  section: BasicSectionEntry
  index?: number
}

const BasicSection = ({ section, index }: Props): JSX.Element => {
  const { title, slug, subtitle, content } = section.fields

  const backgroundClass = index % 2 === 0 ? 'bg-[#bfc6d6]' : 'bg-white'

  return (
    <section id={slug} className={`w-full px-4 md:px-8 py-16 md:py-24 ${backgroundClass} xl:px-0`}>
      <div className="flex flex-col max-w-4xl mx-auto">
        <FadeIntoView>
          <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-12">{title}</h2>
        </FadeIntoView>

        <FadeIntoView>
          <div className="flex flex-col max-w-6xl mx-auto md:flex-row">
            <div className="w-full pr-5 md:w-3/12 xl:pr-12">
              {subtitle && <h3 className="text-2xl font-bold">{subtitle}</h3>}
            </div>

            <div className="prose w-full mt-5 md:mt-0 md:w-4/5 md:pl-2 text-gray-700 md:text-lg">
              {renderContent(content)}
            </div>
          </div>
        </FadeIntoView>
      </div>
    </section>
  )
}

export default BasicSection
