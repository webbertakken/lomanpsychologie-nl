import { describe, expect, it, vi } from 'vitest'

vi.mock('../core/contentful', () => ({
  getContentfulClient: () => ({
    getEntries: async () => ({
      items: [{ sys: { id: 'home' }, fields: { slug: 'home', isHomePage: true } }],
    }),
  }),
}))

const { getStaticPaths: getPagePaths } = await import('../pages/[[...slug]]')
const { getStaticPaths: getSectionPaths } = await import('../pages/sections/[slug]')

describe('static paths', () => {
  it('renders a page that was not prebuilt on the server, never as a loading shell', async () => {
    expect(await getPagePaths({})).toMatchObject({ fallback: 'blocking' })
  })

  it('renders a section that was not prebuilt on the server, never as a loading shell', async () => {
    expect(await getSectionPaths({})).toMatchObject({ fallback: 'blocking' })
  })
})
