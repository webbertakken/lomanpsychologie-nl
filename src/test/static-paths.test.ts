import { describe, expect, it, vi } from 'vitest'

const homePage = { sys: { id: 'home' }, fields: { slug: 'home', isHomePage: true } }
const feesPage = (slug: string) => ({ sys: { id: 'fees' }, fields: { slug, isHomePage: false } })

vi.mock('../core/contentful', () => ({
  getContentfulClient: () => ({
    getEntries: async (query: Record<string, unknown>) => ({
      items:
        query.content_type === 'page'
          ? [homePage, feesPage(query.locale === 'en-GB' ? 'rates' : 'tarieven')]
          : query.content_type === 'section'
            ? [{ sys: { id: 'intro' }, fields: { slug: 'intro', title: 'Intro' } }]
            : [],
    }),
  }),
}))

const pages = await import('../pages/[[...slug]]')
const sections = await import('../pages/sections/[slug]')
const notFound = await import('../pages/404')

describe('static paths', () => {
  it('renders a page that was not prebuilt on the server, never as a loading shell', async () => {
    expect(await pages.getStaticPaths({})).toMatchObject({ fallback: 'blocking' })
  })

  it('renders a section that was not prebuilt on the server, never as a loading shell', async () => {
    expect(await sections.getStaticPaths({})).toMatchObject({ fallback: 'blocking' })
  })
})

describe('regeneration', () => {
  it('refreshes a page from Contentful at most once a minute', async () => {
    const result = await pages.getStaticProps({ params: { slug: ['tarieven'] }, locale: 'nl' })

    expect(result).toMatchObject({ revalidate: 60 })
  })

  it('keeps the 404 for an unknown address until the next deploy', async () => {
    const result = await pages.getStaticProps({ params: { slug: ['wp-login.php'] }, locale: 'nl' })

    expect(result).toEqual({ notFound: true })
  })

  it('keeps a redirect until the next deploy', async () => {
    const result = await pages.getStaticProps({ params: { slug: ['tarieven'] }, locale: 'en' })

    expect(result).toEqual({ redirect: { destination: '/en/rates', permanent: false } })
  })

  it('builds the 404 page once per deploy, never on a visit', async () => {
    const result = await notFound.getStaticProps({ locale: 'nl' })

    expect(result).not.toHaveProperty('revalidate')
  })
})
