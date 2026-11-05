#!/usr/bin/env node
/**
 * Gives the contact page its own structured section in Contentful, filled from
 * the practice's current texts (Contactgegevens, Locatie, Openingstijden) in
 * Dutch and British English.
 *
 *   node scripts/contentful-contact.mjs [--apply]
 *     creates the `contactSection` type and its entry, allows it on pages and
 *     adds it to the contact page in front of the old Contactgegevens block,
 *     which the live site keeps showing until the new code is deployed.
 *   node scripts/contentful-contact.mjs --finalise [--apply]
 *     removes the old block from the contact page once the new code is live.
 *     Home and De praktijk keep it.
 *
 * Needs CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID.
 */
import process from 'node:process'

const apply = process.argv.includes('--apply')
const finalise = process.argv.includes('--finalise')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'
const entryId = 'contact-section'
const oldBlockId = '1lyhZyi3NGCJHi87i5eh4c'
const officeHoursId = '1jl14nK6mmlUvZKB4bPznO'

if (!space || !token) {
  console.error('[contact] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}/environments/${environment}`
const request = async (method, path, { body, version, contentType } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
      ...(contentType && { 'X-Contentful-Content-Type': contentType }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (response.status === 404 && method === 'GET') return null
  if (!response.ok)
    throw new Error(
      `[contact] ${method} ${path} answered ${response.status}: ${await response.text()}`,
    )
  return response.json()
}

const say = (message) => console.info(`[contact] ${apply ? '' : 'would '}${message}`)

const publishNew = async (path, body, contentType) => {
  const existing = await request('GET', path)
  say(`${existing ? 'update' : 'create'} and publish ${path}`)
  if (!apply) return
  const saved = await request('PUT', path, { body, version: existing?.sys.version, contentType })
  await request('PUT', `${path}/published`, { version: saved.sys.version })
}

const field = (id, name, type, { localized = false, required = false, ...rest } = {}) => ({
  id,
  name,
  type,
  localized,
  required,
  ...rest,
})
const symbols = { type: 'Symbol' }

const contentType = {
  name: 'ContactSection',
  description: 'The contact page: address, the way in, every way to reach the practice.',
  displayField: 'title',
  fields: [
    field('title', 'Title', 'Symbol', { localized: true, required: true }),
    field('slug', 'Slug', 'Symbol', { required: true }),
    field('street', 'Street', 'Symbol', { required: true }),
    field('postcode', 'Postcode', 'Symbol', { required: true }),
    field('town', 'Town', 'Symbol', { required: true }),
    field('building', 'Building', 'Symbol', { localized: true }),
    field('buildingUrl', 'Building website', 'Symbol'),
    field('routeUrl', 'Route link', 'Symbol'),
    field('directions', 'Way to the waiting room', 'Array', { localized: true, items: symbols }),
    field('publicTransport', 'By public transport', 'Symbol', { localized: true }),
    field('bicycle', 'By bicycle', 'Symbol', { localized: true }),
    field('car', 'By car', 'Symbol', { localized: true }),
    field('referral', 'Referral and the GP', 'Text', { localized: true }),
    field('email', 'E-mail', 'Symbol', { required: true }),
    field('emailNote', 'E-mail note', 'Symbol', { localized: true }),
    field('phone', 'Phone', 'Symbol', { required: true }),
    field('phoneNote', 'Phone note', 'Text', { localized: true }),
    field('officeHours', 'Opening hours', 'Link', {
      linkType: 'Entry',
      validations: [{ linkContentType: ['officeHoursSection'] }],
    }),
    field('crisis', 'Out of hours and in a crisis', 'Text', { localized: true }),
    field('cover', 'Cover during absence', 'Text', { localized: true }),
    field('cancelling', 'Cancelling appointments', 'Text', { localized: true }),
    field('registration', 'Registration numbers', 'Array', { localized: true, items: symbols }),
  ],
}

const both = (nl, en) => ({ 'nl-NL': nl, 'en-GB': en })
const one = (value) => ({ 'nl-NL': value })

const entry = {
  title: both('Contactgegevens', 'Contact details'),
  slug: one('contact'),
  street: one('Schoolstraat 27'),
  postcode: one('7642 AS'),
  town: one('Wierden'),
  building: both('gezondheidscentrum De Zonnehoed', 'De Zonnehoed health centre'),
  buildingUrl: one('https://dezonnehoedwierden.nl/#!/zonnehoed'),
  routeUrl: one('https://maps.app.goo.gl/bDjqfb8ooAq67Vx16'),
  directions: both(
    [
      'Ga bij binnenkomst van het gezondheidscentrum rechts langs de balie.',
      'Neem de trap of de lift naar de 1e verdieping. Het gebouw is volledig rolstoeltoegankelijk.',
      'Neem plaats in de wachtkamer; vooraf melden is niet nodig. De behandelaar haalt u op de afgesproken tijd op.',
    ],
    [
      'When you enter the health centre, go right, past the reception desk.',
      'Take the stairs or the lift to the first floor. The building is fully wheelchair accessible.',
      'Take a seat in the waiting room; there is no need to report in. Your practitioner will collect you at the agreed time.',
    ],
  ),
  publicTransport: both(
    'Station Wierden en bushalte Wierden, N.H. Kerk liggen op 500 meter lopen.',
    'Wierden station and the Wierden, N.H. Kerk bus stop are a 500-metre walk away.',
  ),
  bicycle: both('Er is een fietsenstalling.', 'There is a bicycle shed.'),
  car: both('Er is ruime parkeergelegenheid.', 'There is plenty of parking.'),
  referral: both(
    'Tot uw behandeling is gestart, blijft uw huisarts uw aanspreekpunt. Nemen uw klachten toe of heeft u dringend hulp nodig, neem dan contact op met uw huisarts.',
    'Until your treatment has started, your GP remains your point of contact. If your symptoms get worse or you need help urgently, please contact your GP.',
  ),
  email: one('info@lomanpsychologie.nl'),
  emailNote: both(
    'Het snelst, binnen en buiten de openingstijden.',
    'The fastest way, within and outside opening hours.',
  ),
  phone: one('06-21591133'),
  phoneNote: both(
    'Let op: tijdens het spreekuur kan de telefoon niet worden aangenomen. Als u de voicemail inspreekt, wordt u zo spoedig mogelijk teruggebeld.',
    'Please note: the phone cannot be answered during consultations. If you leave a voicemail, you will be called back as soon as possible.',
  ),
  officeHours: one({ sys: { type: 'Link', linkType: 'Entry', id: officeHoursId } }),
  crisis: both(
    'De praktijk is een praktijk voor basis-GGZ zonder crisisdienst. Cliënten die bij de praktijk in behandeling zijn, kunnen in de avond, de nacht, het weekend en bij een crisis contact opnemen met de Centrale Huisartsenpost (ZGT Almelo) via 088-5880588. De dienstdoende huisarts beoordeelt de situatie en schakelt zo nodig de crisisdienst van Dimence in. Hulp is 24 uur per dag mogelijk.\n\nU kunt ook een telefonische hulplijn bellen, bijvoorbeeld 113 of gratis 0800-0113 als u aan zelfdoding denkt.',
    'The practice provides basic mental healthcare (basis-GGZ) and has no crisis service. Clients in treatment at the practice can contact the Centrale Huisartsenpost (ZGT Almelo) in the evening, at night, at the weekend and in a crisis on 088-5880588. The GP on duty assesses the situation and, if necessary, calls in the Dimence crisis service. Help is available 24 hours a day.\n\nYou can also call a helpline, for example 113, or 0800-0113 free of charge, if you are thinking about suicide.',
  ),
  cover: both(
    'Tijdens vakanties en ziekte wordt waarneming geregeld met andere vrijgevestigde behandelaren in de regio. Als de praktijk gesloten is, wordt dit op de website vermeld, met de contactgegevens van de waarnemer.',
    'During holidays and illness, cover is arranged with other independent practitioners in the region. If the practice is closed, this is announced on the website, with the contact details of the practitioner providing cover.',
  ),
  cancelling: both(
    'Afspraken kunnen tot uiterlijk 24 uur voor de afgesproken tijd per mail of telefonisch worden afgezegd. Wanneer u zonder tijdige afmelding niet verschijnt, wordt €80,- bij u in rekening gebracht. Dit bedrag kunt u niet declareren bij uw zorgverzekeraar.',
    'Appointments can be cancelled by e-mail or phone up to 24 hours before the agreed time. If you do not attend without cancelling in time, you will be charged €80,-. You cannot claim this amount from your health insurer.',
  ),
  registration: both(
    [
      'AGB praktijk: 94066386',
      'AGB zorgverlener: 94106897',
      'BIG-registratie: 39927037225',
      'KvK-nummer: 83353550',
    ],
    [
      'AGB practice: 94066386',
      'AGB practitioner: 94106897',
      'BIG registration: 39927037225',
      'Chamber of Commerce (KvK): 83353550',
    ],
  ),
}

const link = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } })

const contactPage = async () => {
  const { items } = await request('GET', '/entries?content_type=page&fields.slug=contact&limit=1')
  if (!items[0]) throw new Error('[contact] no contact page')
  return items[0]
}

const setSections = async (page, sections, extraFields = {}) => {
  if (page.sys.version > page.sys.publishedVersion + 1)
    throw new Error('[contact] the contact page has unpublished changes')
  say(`set contact page sections to ${sections.join(', ')}`)
  if (!apply) return
  page.fields.sections = { ...page.fields.sections, 'nl-NL': sections.map(link) }
  Object.assign(page.fields, extraFields)
  const saved = await request('PUT', `/entries/${page.sys.id}`, {
    body: { fields: page.fields, metadata: page.metadata },
    version: page.sys.version,
  })
  await request('PUT', `/entries/${page.sys.id}/published`, { version: saved.sys.version })
}

const allowOnPages = async () => {
  const pageType = await request('GET', '/content_types/page')
  const rule = pageType.fields
    .find(({ id }) => id === 'sections')
    .items.validations.find((v) => v.linkContentType)
  if (rule.linkContentType.includes('contactSection')) return
  say('allow contactSection in the page sections field')
  if (!apply) return
  rule.linkContentType.push('contactSection')
  const { name, description, displayField, fields } = pageType
  const saved = await request('PUT', '/content_types/page', {
    body: { name, description, displayField, fields },
    version: pageType.sys.version,
  })
  await request('PUT', '/content_types/page/published', { version: saved.sys.version })
}

const main = async () => {
  const page = await contactPage()
  if (finalise) {
    const current = page.fields.sections['nl-NL'].map(({ sys }) => sys.id)
    await setSections(
      page,
      current.filter((id) => id !== oldBlockId),
    )
    return
  }

  await publishNew('/content_types/contactSection', contentType)
  await allowOnPages()
  await publishNew(`/entries/${entryId}`, { fields: entry }, 'contactSection')
  await setSections(page, [entryId, oldBlockId], {
    subtitle: {
      ...page.fields.subtitle,
      'nl-NL': 'Zo bereikt u de praktijk',
      'en-GB': 'How to reach the practice',
    },
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
