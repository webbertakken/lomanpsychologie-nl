import { describe, expect, it } from 'vitest'
import { linkify } from './linkify'

describe('linkify', () => {
  it('leaves plain text as one text segment', () => {
    expect(linkify('Schoolstraat 27')).toEqual([{ type: 'text', value: 'Schoolstraat 27' }])
  })

  it('turns an e-mail address into a mailto segment', () => {
    expect(linkify('via info@lomanpsychologie.nl of')).toEqual([
      { type: 'text', value: 'via ' },
      { type: 'email', value: 'info@lomanpsychologie.nl', href: 'mailto:info@lomanpsychologie.nl' },
      { type: 'text', value: ' of' },
    ])
  })

  it('turns Dutch phone numbers with and without a dash into tel segments', () => {
    expect(linkify('bel 06-21591133 of 0621591133.')).toEqual([
      { type: 'text', value: 'bel ' },
      { type: 'phone', value: '06-21591133', href: 'tel:0621591133' },
      { type: 'text', value: ' of ' },
      { type: 'phone', value: '0621591133', href: 'tel:0621591133' },
      { type: 'text', value: '.' },
    ])
  })

  it('links service numbers such as 088 and 0800 numbers', () => {
    expect(linkify('088-5880588 en 0800-0113')).toEqual([
      { type: 'phone', value: '088-5880588', href: 'tel:0885880588' },
      { type: 'text', value: ' en ' },
      { type: 'phone', value: '0800-0113', href: 'tel:08000113' },
    ])
  })

  it('leaves registration numbers and amounts alone', () => {
    const text = 'AGB praktijk: 94066386, KvK 83353550, €385,- vanaf 2027'
    expect(linkify(text)).toEqual([{ type: 'text', value: text }])
  })

  it('returns no segments for empty text', () => {
    expect(linkify('')).toEqual([])
  })
})
