import { type ContentfulClientApi, createClient } from 'contentful'

/**
 * Reads published content. `CONTENTFUL_ENVIRONMENT` lets a preview deployment
 * read a sandbox environment, so content for an unmerged change never reaches
 * the live site early.
 */
export const getContentfulClient = (): ContentfulClientApi<undefined> =>
  createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  })
