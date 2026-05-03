import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, Node } from '@contentful/rich-text-types';
import { ReactNode, createElement } from 'react';
import { DynamicIcon } from '../icons/DynamicIcon';
import { fileTypeIcon } from './fileTypeIcon';
import { humanFileSize } from '../../core/humanFileSize';
import { PageProps } from '../../types/page';
import Link from 'next/link';

// Skip headings that are visually empty (only whitespace text). Authors in
// Contentful occasionally leave an empty `h3` between paragraphs by hitting
// the heading toggle on a blank line; that renders as `<h3></h3>` and
// triggers an axe-core `empty-heading` violation.
const nodeText = (node: Node): string => {
  if ('value' in node && typeof (node as { value: unknown }).value === 'string') {
    return (node as { value: string }).value;
  }
  if ('content' in node && Array.isArray((node as { content: unknown[] }).content)) {
    return ((node as { content: Node[] }).content).map(nodeText).join('');
  }
  return '';
};

const renderHeadingIfNonEmpty = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
  function HeadingRenderer(node: Node, children: ReactNode): ReactNode {
    return nodeText(node).trim() ? createElement(tag, null, children) : null;
  };

const options: Options = {
  renderNode: {
    'asset-hyperlink': function AssetHyperlink(node, children) {
      const { content, data, nodeType } = node;
      const { fields, metadata, sys } = data.target;

      const { title, description, file } = fields;
      const { contentType, details, fileName, url } = file;
      const { image, size } = details;

      const isImage = contentType.startsWith('image/');

      return isImage ? (
        <img src={url} alt={title || description || fileName} />
      ) : (
        <a
          className="w-40 inline-flex flex-col gap-2 p-2 pb-8 overflow-hidden items-center no-underline hover:underline"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-size={size}
        >
          <DynamicIcon
            icon={fileTypeIcon(contentType)}
            className="shrink-0 grow-1 h-10 w-10 text-indigo-600 inline mb-2"
            aria-hidden="true"
          />
          <span className="text-sm text-center">{title}</span>
          <span className="text-xs text-center"> ({humanFileSize(size, true)})</span>
        </a>
      );
    },
    [BLOCKS.HEADING_1]: renderHeadingIfNonEmpty('h1'),
    [BLOCKS.HEADING_2]: renderHeadingIfNonEmpty('h2'),
    [BLOCKS.HEADING_3]: renderHeadingIfNonEmpty('h3'),
    [BLOCKS.HEADING_4]: renderHeadingIfNonEmpty('h4'),
    [BLOCKS.HEADING_5]: renderHeadingIfNonEmpty('h5'),
    [BLOCKS.HEADING_6]: renderHeadingIfNonEmpty('h6'),
    'entry-hyperlink': function EntryHyperlink(node, children) {
      const { target } = node.data;
      const { fields, metadata, sys } = target || {};

      // Link to a page
      if (sys?.contentType?.sys?.id === 'page') {
        const { title, slug } = fields as PageProps;
        return (
          <Link href={`/${slug}`} title={title}>
            {children}
          </Link>
        );
      }

      console.warn('unhandled node:', node);
      return <></>;
    },
    // 'embedded-entry-inline': function EmbeddedEntryInline(node, children) {
    //   console.log('node', node);
    //   console.log('children', children);
    //
    //   return <span>EmbeddedEntryInline</span>;
    // },
  },
};

export const renderContent = (content: Document) => documentToReactComponents(content, options);
