/**
 * Facts about the practice that the site repeats outside the CMS content:
 * the appointment card, the footer and the mobile menu. The CMS sections
 * stay the full source; change these together with the "Contactgegevens"
 * section in Contentful.
 */
export const practice = {
  name: 'Loman Psychologiepraktijk',
  psychologist: 'Anke Loman',
  street: 'Schoolstraat 27',
  postcode: '7642 AS',
  town: 'Wierden',
  building: 'gezondheidscentrum De Zonnehoed',
  routeUrl: 'https://maps.app.goo.gl/bDjqfb8ooAq67Vx16',
  phone: { label: '06-21591133', href: 'tel:0621591133' },
  email: { label: 'info@lomanpsychologie.nl', href: 'mailto:info@lomanpsychologie.nl' },
  outOfHours: { label: '088-5880588', href: 'tel:0885880588', name: 'Huisartsenpost (ZGT Almelo)' },
  suicidePrevention: {
    short: { label: '113', href: 'tel:113' },
    free: { label: '0800-0113', href: 'tel:08000113' },
  },
} as const
