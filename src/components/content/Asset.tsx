import type { JSX } from 'react'
import { LuDownload } from 'react-icons/lu'
import { humanFileSize } from '../../core/humanFileSize'

export interface ContentfulAsset {
  sys: { id: string }
  fields: {
    title?: string
    description?: string
    file: {
      url: string
      fileName: string
      contentType: string
      details: { size: number; image?: { width: number; height: number } }
    }
  }
}

const documentKinds: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
}

const absolute = (url: string) => (url.startsWith('//') ? `https:${url}` : url)

/** An image from the CMS, or a download row for any other file. */
const Asset = ({ asset }: { asset: ContentfulAsset }): JSX.Element => {
  const { title, description, file } = asset.fields
  const name = title || description || file.fileName

  if (file.contentType.startsWith('image/')) {
    return (
      // Contentful serves its own resized images; next/image would fetch them twice.
      // oxlint-disable-next-line nextjs/no-img-element
      <img
        src={absolute(file.url)}
        alt={name}
        width={file.details.image?.width}
        height={file.details.image?.height}
        loading="lazy"
      />
    )
  }

  const kind = documentKinds[file.contentType] ?? file.fileName.split('.').pop()?.toUpperCase()

  return (
    <a
      href={absolute(file.url)}
      className="group my-1 mr-3 inline-flex min-h-12 items-center gap-3 border border-rule bg-paper py-2 pr-4 pl-3 align-middle no-underline! hover:border-rule-strong"
    >
      <LuDownload aria-hidden className="size-5 shrink-0 text-label" />
      <span className="flex flex-col leading-tight">
        <span className="font-bold group-hover:underline group-hover:decoration-rule-strong">
          {name}
        </span>
        <span className="text-sm text-ink-soft">
          {kind}, {humanFileSize(file.details.size, true, 0)}
        </span>
      </span>
    </a>
  )
}

export default Asset
