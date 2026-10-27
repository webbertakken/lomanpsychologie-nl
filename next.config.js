/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.ctfassets.net' }],
  },
}
