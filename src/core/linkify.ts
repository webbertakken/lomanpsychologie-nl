export type TextSegment =
  | { type: 'text'; value: string }
  | { type: 'email'; value: string; href: string }
  | { type: 'phone'; value: string; href: string }

const email = String.raw`[\w.+-]+@[\w-]+(?:\.[\w-]+)+`
// Dutch numbers start with 0 and have ten digits (06, 088, 053) or are
// 0800/0900 service numbers with four to seven digits after the prefix.
const phone = String.raw`\b0(?:800|900)-?\d{4,7}\b|\b0\d{1,3}-?\d{6,8}\b`
const contact = new RegExp(`(${email})|(${phone})`, 'g')

const isDialable = (digits: string): boolean =>
  /^0(800|900)\d{4,7}$/.test(digits) || digits.length === 10

/**
 * Splits prose into text, e-mail and phone segments, so contact details
 * written in the CMS become tappable without the author adding links.
 */
export const linkify = (text: string): TextSegment[] => {
  const segments: TextSegment[] = []
  let cursor = 0

  for (const match of text.matchAll(contact)) {
    const [value, isEmail] = match
    const digits = value.replace(/\D/g, '')
    if (!isEmail && !isDialable(digits)) continue

    if (match.index > cursor)
      segments.push({ type: 'text', value: text.slice(cursor, match.index) })
    segments.push(
      isEmail
        ? { type: 'email', value, href: `mailto:${value}` }
        : { type: 'phone', value, href: `tel:${digits}` },
    )
    cursor = match.index + value.length
  }

  if (cursor < text.length) segments.push({ type: 'text', value: text.slice(cursor) })
  return segments
}
