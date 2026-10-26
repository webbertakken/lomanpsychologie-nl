import { ContentfulClientApi, createClient } from 'contentful'

export const getContentfulClient = (): ContentfulClientApi<'WITHOUT_UNRESOLVABLE_LINKS'> =>
  createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  }).withoutUnresolvableLinks
