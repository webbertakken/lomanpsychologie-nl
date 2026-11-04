/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    // Visitors choose the language with the switch in the header; the browser's
    // language never redirects them away from the address they opened.
    localeDetection: false,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.ctfassets.net' }],
  },
}
