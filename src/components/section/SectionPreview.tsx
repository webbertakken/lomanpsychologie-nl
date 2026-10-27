import Link from 'next/link'
import type { JSX } from 'react'
import { BasicSectionEntry } from '../../types/section'

interface Props {
  section: BasicSectionEntry
}

const SectionPreview = ({ section }: Props): JSX.Element => {
  const { title, slug } = section.fields

  return (
    <div>
      <Link href={`/sections/${slug}`}>{title}</Link>
    </div>
  )
}

export default SectionPreview
