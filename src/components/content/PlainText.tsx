import { Fragment, type JSX } from 'react'
import { linkify } from '../../core/linkify'

/** Multi-line text from the CMS: blank lines start a paragraph, numbers and addresses are tappable. */
const PlainText = ({
  text,
  className,
}: {
  text?: string
  className?: string
}): JSX.Element | null => {
  const paragraphs = (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  if (paragraphs.length === 0) return null

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? 'mt-3' : undefined}>
          {linkify(paragraph).map((segment, part) =>
            segment.type === 'text' ? (
              <Fragment key={part}>{segment.value}</Fragment>
            ) : (
              <a key={part} href={segment.href} className="link font-bold whitespace-nowrap">
                {segment.value}
              </a>
            ),
          )}
        </p>
      ))}
    </div>
  )
}

export default PlainText
