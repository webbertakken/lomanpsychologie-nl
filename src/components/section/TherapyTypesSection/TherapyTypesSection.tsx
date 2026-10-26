import { isResolved } from '../../../core/links'
import { TypesOfTherapyEntry } from '../../../types/section'
import { TherapyTypeCard } from './TherapyTypeCard'

interface Props {
  section: TypesOfTherapyEntry
}

const TherapyTypesSection = ({ section }: Props): JSX.Element => {
  const { slug, therapyTypeCards } = section.fields

  return (
    <section id={slug} className="w-full bg-white py-6">
      {therapyTypeCards?.filter(isResolved).map((card) => (
        <TherapyTypeCard key={card.sys.id} card={card} />
      ))}
    </section>
  )
}

export default TherapyTypesSection
