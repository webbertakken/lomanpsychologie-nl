import { Document } from '@contentful/rich-text-types';
import { renderContent } from '../../../content/renderContent';

interface Props {
  shortDescription: Document;
}

const Bio = ({ shortDescription }: Props): JSX.Element => {
  return <div className="prose prose-lg max-w-none text-neutral-600">{renderContent(shortDescription)}</div>;
};

export default Bio;
