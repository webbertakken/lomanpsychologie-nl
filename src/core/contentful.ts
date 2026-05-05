import { ContentfulClientApi, createClient } from 'contentful'

export const getContentfulClient = (): ContentfulClientApi => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })

  // client.getSpace()
  //   .then((space) => {
  //     console.log('Client initialized successfully.');
  //     console.log('Space details:', space);
  //   })
  //   .catch((error) => {
  //     console.error('Client initialization failed:', error);
  //   });

  return client
}
