import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS, type Block, type Document, INLINES, type Node } from '@contentful/rich-text-types'
import Link from 'next/link'
import { Fragment, type ReactNode, createElement } from 'react'
import { LuClock } from 'react-icons/lu'
import { linkify } from '../../core/linkify'
import { imagesInLayoutTable, isLongList, plainText } from '../../core/richText'
import Asset, { type ContentfulAsset } from './Asset'

type Heading = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/** E-mail addresses and phone numbers written as text become tappable links. */
const renderText = (text: string): ReactNode =>
  linkify(text).map((segment, index) =>
    segment.type === 'text' ? (
      <Fragment key={index}>{segment.value}</Fragment>
    ) : (
      <a key={index} href={segment.href} className="whitespace-nowrap">
        {segment.value}
      </a>
    ),
  )

// Authors sometimes toggle a heading on an empty line; an empty heading is
// noise to screen readers, so it is left out. Rich text sits under a section's
// h2, so its headings start one level lower: an authored h1 becomes an h2.
const heading = (tag: Heading) =>
  function RichTextHeading(node: Node, children: ReactNode): ReactNode {
    return plainText(node).trim() ? createElement(tag, null, children) : null
  }

const isEmptyParagraph = (node: Node): boolean =>
  'content' in node &&
  (node as Block).content.every((child) => child.nodeType === 'text' && !child.value.trim())

const isLastUpdatedNote = (node: Node): boolean => /^\s*laatst (ge)?üpdatet/i.test(plainText(node))

const assetOf = (node: Node): ContentfulAsset | undefined => {
  const target = node.data?.target
  return target?.fields?.file ? (target as ContentfulAsset) : undefined
}

const pageHref = (target: {
  fields?: { slug?: string; parentPage?: { fields?: { slug?: string } } }
}) => {
  const slug = target.fields?.slug
  const parentSlug = target.fields?.parentPage?.fields?.slug
  return parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`
}

// An asset embedded twice in one text (a logo in a table and again below it) shows once.
const createOptions = (): Options => {
  const shown = new Set<string>()
  const firstShowing = (asset: ContentfulAsset): boolean => {
    if (shown.has(asset.sys.id)) return false
    shown.add(asset.sys.id)
    return true
  }

  return {
    renderText,
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        if (isEmptyParagraph(node)) return null
        if (isLastUpdatedNote(node)) {
          return (
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <LuClock aria-hidden className="size-4 shrink-0 text-label" />
              <span>{children}</span>
            </p>
          )
        }
        return <p>{children}</p>
      },
      [BLOCKS.HEADING_1]: heading('h2'),
      [BLOCKS.HEADING_2]: heading('h3'),
      [BLOCKS.HEADING_3]: heading('h3'),
      [BLOCKS.HEADING_4]: heading('h4'),
      [BLOCKS.HEADING_5]: heading('h5'),
      [BLOCKS.HEADING_6]: heading('h6'),
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className={isLongList(node) ? 'long-list' : undefined}>{children}</ul>
      ),
      [BLOCKS.TABLE]: (node, children) => {
        const images = imagesInLayoutTable(node)
        if (images) {
          return (
            <div className="logo-row">
              {images.map((image) => {
                const asset = assetOf(image)
                return asset ? <Asset key={asset.sys.id} asset={asset} /> : null
              })}
            </div>
          )
        }
        return (
          <div className="table-frame">
            <table>
              <tbody>{children}</tbody>
            </table>
          </div>
        )
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = assetOf(node)
        if (!asset || !firstShowing(asset)) return null
        return asset.fields.file.contentType.startsWith('image/') ? (
          <figure>
            <Asset asset={asset} />
          </figure>
        ) : (
          <p>
            <Asset asset={asset} />
          </p>
        )
      },
      [INLINES.ASSET_HYPERLINK]: (node) => {
        const asset = assetOf(node)
        if (!asset) return null
        firstShowing(asset)
        return <Asset asset={asset} />
      },
      [INLINES.HYPERLINK]: (node) => {
        const uri: string = node.data.uri
        const isExternal = /^https?:\/\//.test(uri) && !uri.includes('lomanpsychologie.nl')
        return (
          <a href={uri} rel={isExternal ? 'noopener noreferrer' : undefined}>
            {plainText(node)}
          </a>
        )
      },
      [INLINES.ENTRY_HYPERLINK]: (node) => {
        const target = node.data?.target
        if (target?.sys?.contentType?.sys?.id !== 'page') {
          console.warn('[rich text] link to an unsupported entry, rendering its text only')
          return plainText(node)
        }
        return <Link href={pageHref(target)}>{plainText(node)}</Link>
      },
    },
  }
}

export const renderContent = (content: Document | undefined): ReactNode =>
  content ? documentToReactComponents(content, createOptions()) : null
