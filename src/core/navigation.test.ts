import { describe, expect, it } from 'vitest'
import type { MenuSortOrderEntry } from '../types/menu'
import type { PageEntry } from '../types/page'
import { activePathFor, buildMenu, headerPagesOf, pagePath, sortByMenuOrder } from './navigation'

const page = (id: string, fields: Record<string, unknown> = {}): PageEntry =>
  ({
    sys: { id, type: 'Entry' },
    fields: {
      title: id,
      slug: id,
      menuItemTitle: id.toUpperCase(),
      isHomePage: false,
      shouldBeShownInSubmenus: true,
      ...fields,
    },
  }) as unknown as PageEntry

const home = page('home', { isHomePage: true })
const treatments = page('behandelingen')
const emdr = page('emdr', { parentPage: treatments, subtitle: 'Eye Movement' })
const act = page('act', { parentPage: treatments })
const hidden = page('hidden', { parentPage: treatments, shouldBeShownInSubmenus: false })
const draftChild = page('draft', { parentPage: { sys: { type: 'Link', id: 'x' } } })
const fees = page('tarieven')

const order = (...pages: PageEntry[]) =>
  ({ fields: { menu: 'header', pages } }) as unknown as MenuSortOrderEntry

describe('pagePath', () => {
  it('serves the home page at the root', () => {
    expect(pagePath(home)).toBe('/')
  })

  it('nests a page under its parent', () => {
    expect(pagePath(emdr)).toBe('/behandelingen/emdr')
  })

  it('serves a page with an unresolved parent at its own slug', () => {
    expect(pagePath(draftChild)).toBe('/draft')
  })
})

describe('activePathFor', () => {
  it('maps a missing slug to the root', () => {
    expect(activePathFor(null)).toBe('/')
    expect(activePathFor(undefined)).toBe('/')
  })

  it('joins slug segments', () => {
    expect(activePathFor('tarieven')).toBe('/tarieven')
    expect(activePathFor(['behandelingen', 'emdr'])).toBe('/behandelingen/emdr')
  })
})

describe('sortByMenuOrder', () => {
  it('follows the authored order with the home page first', () => {
    const sorted = sortByMenuOrder([fees, treatments, home], order(treatments, fees))
    expect(sorted.map((p) => p.fields.slug)).toEqual(['home', 'behandelingen', 'tarieven'])
  })

  it('puts pages missing from the order last and skips unresolved order entries', () => {
    const unresolved = { sys: { type: 'Link', id: 'gone' } } as unknown as PageEntry
    const sorted = sortByMenuOrder([fees, treatments], order(unresolved, fees))
    expect(sorted.map((p) => p.fields.slug)).toEqual(['tarieven', 'behandelingen'])
  })

  it('keeps the given order without a sort order', () => {
    expect(sortByMenuOrder([fees, treatments], undefined)).toEqual([fees, treatments])
  })
})

describe('buildMenu', () => {
  const all = [home, treatments, emdr, act, hidden, draftChild, fees]

  it('lists root pages with their visible sub pages in alphabetical order', () => {
    const menu = buildMenu([home, treatments, emdr, fees], all, '/')

    expect(menu.map((item) => item.path)).toEqual(['/', '/behandelingen', '/tarieven'])
    expect(menu[1].subPages.map((item) => item.path)).toEqual([
      '/behandelingen/act',
      '/behandelingen/emdr',
    ])
    expect(menu[1].subPages[1]).toMatchObject({ title: 'EMDR', subtitle: 'Eye Movement' })
  })

  it('marks the active page and its parent', () => {
    const menu = buildMenu([home, treatments], all, '/behandelingen/emdr')

    expect(menu.map((item) => item.isActive)).toEqual([false, true])
    expect(menu[1].subPages.find((item) => item.isActive)?.path).toBe('/behandelingen/emdr')
  })
})

describe('headerPagesOf', () => {
  it('lists the pages marked for the header, leaving the way home to the logo', () => {
    const pages = [
      page('home', { isHomePage: true, shouldBeShownInHeader: true }),
      page('tarieven', { shouldBeShownInHeader: true }),
      page('privacybeleid', { shouldBeShownInHeader: false }),
      page('veelgestelde-vragen', { shouldBeShownInHeader: true }),
    ]

    expect(headerPagesOf(pages).map(({ sys }) => sys.id)).toEqual([
      'tarieven',
      'veelgestelde-vragen',
    ])
  })
})
