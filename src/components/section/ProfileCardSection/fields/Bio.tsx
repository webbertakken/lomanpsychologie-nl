import { Document } from '@contentful/rich-text-types'
import { renderContent } from '../../../content/renderContent'

interface Props {
  shortDescription: Document
}

const Bio = ({ shortDescription }: Props): JSX.Element => {
  return <div className="pt-8 text-sm">{renderContent(shortDescription)}</div>
}

export default Bio
