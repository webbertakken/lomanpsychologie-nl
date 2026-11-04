#!/usr/bin/env node
/**
 * Fills the "Voorwaarden" section with the LVVP general payment terms (model
 * text, articles 1 to 7) in Dutch and British English, plus the practice's own
 * no-show fee from its folder. Saves a draft only: the practice owner reads it
 * in Contentful and publishes it herself.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node scripts/contentful-terms.mjs [--apply]
 */
import process from 'node:process'

const sectionId = 'sUT7L1Dsl1bMONaJZ6CVx'
const apply = process.argv.includes('--apply')
const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'

if (!space || !token) {
  console.error('[terms] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}/environments/${environment}`
const request = async (method, path, { body, version } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...(version !== undefined && { 'X-Contentful-Version': String(version) }),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })
  if (!response.ok)
    throw new Error(
      `[terms] ${method} ${path} answered ${response.status}: ${await response.text()}`,
    )
  return response.json()
}

const text = (value) => ({ nodeType: 'text', value, marks: [], data: {} })
const paragraph = (...content) => ({ nodeType: 'paragraph', data: {}, content })
const heading = (value) => ({ nodeType: 'heading-3', data: {}, content: [text(value)] })
const pageLink = (id, value) => ({
  nodeType: 'entry-hyperlink',
  data: { target: { sys: { id, type: 'Link', linkType: 'Entry' } } },
  content: [text(value)],
})
const document = (...content) => ({ nodeType: 'document', data: {}, content })

const terms = (pages) => ({
  'nl-NL': {
    title: 'Betalingsvoorwaarden',
    subtitle: 'Algemene betalingsvoorwaarden van de LVVP',
    content: document(
      paragraph(
        text(
          'Loman Psychologiepraktijk hanteert de algemene betalingsvoorwaarden van de LVVP, de Landelijke Vereniging van Vrijgevestigde Psychologen & Psychotherapeuten.',
        ),
      ),
      heading('Artikel 1 – Toepassing'),
      paragraph(
        text(
          'Deze betalingsvoorwaarden zijn van toepassing op alle behandelingsovereenkomsten tussen de gz-psycholoog, psychotherapeut, klinisch psycholoog (hierna te noemen: behandelaar) en de patiënt.',
        ),
      ),
      heading('Artikel 2 – Afspraken afzeggen'),
      paragraph(
        text(
          'Afspraken moeten uiterlijk 24 uur voor het tijdstip van de behandeling geannuleerd worden. Bij niet annuleren en bij annuleringen binnen 24 uur voor de afspraak is de behandelaar gerechtigd de gereserveerde tijd naar redelijkheid en billijkheid aan de patiënt in rekening te brengen.',
        ),
      ),
      paragraph(
        text(
          'Loman Psychologiepraktijk brengt hiervoor €80,- in rekening. Dit bedrag kunt u niet declareren bij uw zorgverzekeraar.',
        ),
      ),
      heading('Artikel 3 – Betalingstermijn'),
      paragraph(
        text(
          'De door de behandelaar aan de patiënt gedeclareerde kosten voor de behandeling dienen door de patiënt binnen 30 dagen na de datum van de factuur te zijn betaald.',
        ),
      ),
      heading('Artikel 4 – Laatste herinnering'),
      paragraph(
        text(
          'Indien de patiënt het verschuldigde bedrag niet binnen 30 dagen na de factuurdatum heeft betaald, dan krijgt de patiënt een laatste gelegenheid om de factuur zonder ophoging van kosten binnen 14 dagen te betalen.',
        ),
      ),
      heading('Artikel 5 – Incasso'),
      paragraph(
        text(
          'Voldoet de patiënt binnen 14 dagen na de datum van de betalingsherinnering niet aan zijn/haar verplichtingen, dan is de behandelaar zonder nadere ingebrekestelling gerechtigd incassomaatregelen te treffen, dan wel door derden te laten uitvoeren.',
        ),
      ),
      heading('Artikel 6 – Incassokosten'),
      paragraph(
        text(
          'Alle buitengerechtelijke incassokosten verband houdende met de invordering van de gedeclareerde bedragen komen ten laste van de patiënt. De buitengerechtelijke incassokosten zijn vastgesteld op tenminste 15% van de hoofdsom met een minimum van € 25.',
        ),
      ),
      heading('Artikel 7 – Opschorten van de behandeling'),
      paragraph(
        text(
          'Bij betalingsachterstand is de behandelaar gerechtigd - tenzij de behandeling zich hiertegen verzet - verdere behandeling op te schorten totdat de patiënt aan zijn/haar betalingsverplichtingen heeft voldaan.',
        ),
      ),
      heading('Zie ook'),
      paragraph(
        text('De bedragen per behandeling staan bij de '),
        pageLink(pages.tarieven, 'tarieven'),
        text('. Hoe de praktijk met uw gegevens omgaat, leest u in het '),
        pageLink(pages.privacybeleid, 'privacybeleid'),
        text('. Bent u ontevreden, dan kunt u terecht bij de '),
        pageLink(pages.klachtenfunctionaris, 'klachtenfunctionaris'),
        text('.'),
      ),
    ),
  },
  'en-GB': {
    title: 'Payment terms',
    subtitle: 'General payment terms of the LVVP',
    content: document(
      paragraph(
        text(
          'Loman Psychologiepraktijk applies the general payment terms of the LVVP, the Dutch national association of independent psychologists and psychotherapists (Landelijke Vereniging van Vrijgevestigde Psychologen & Psychotherapeuten).',
        ),
      ),
      heading('Article 1 – Scope'),
      paragraph(
        text(
          'These payment terms apply to all treatment agreements between the healthcare psychologist (gz-psycholoog), psychotherapist or clinical psychologist (hereinafter: the practitioner) and the patient.',
        ),
      ),
      heading('Article 2 – Cancelling appointments'),
      paragraph(
        text(
          'Appointments must be cancelled no later than 24 hours before the time of the treatment. If an appointment is not cancelled, or is cancelled less than 24 hours beforehand, the practitioner is entitled to charge the patient for the reserved time on a fair and reasonable basis.',
        ),
      ),
      paragraph(
        text(
          'Loman Psychologiepraktijk charges €80,- for this. You cannot claim this amount from your health insurer.',
        ),
      ),
      heading('Article 3 – Payment period'),
      paragraph(
        text(
          'The costs of treatment invoiced by the practitioner to the patient must be paid by the patient within 30 days of the invoice date.',
        ),
      ),
      heading('Article 4 – Final reminder'),
      paragraph(
        text(
          'If the patient has not paid the amount due within 30 days of the invoice date, the patient will be given a final opportunity to pay the invoice within 14 days without additional costs.',
        ),
      ),
      heading('Article 5 – Debt collection'),
      paragraph(
        text(
          'If the patient does not meet his or her obligations within 14 days of the date of the payment reminder, the practitioner is entitled, without further notice of default, to take debt collection measures or to have these carried out by third parties.',
        ),
      ),
      heading('Article 6 – Collection costs'),
      paragraph(
        text(
          'All extrajudicial collection costs relating to the recovery of the invoiced amounts are borne by the patient. The extrajudicial collection costs are set at no less than 15% of the principal sum, with a minimum of € 25.',
        ),
      ),
      heading('Article 7 – Suspending treatment'),
      paragraph(
        text(
          'If payments are in arrears, the practitioner is entitled – unless the treatment itself precludes this – to suspend further treatment until the patient has met his or her payment obligations.',
        ),
      ),
      heading('See also'),
      paragraph(
        text('The amounts per treatment are listed under '),
        pageLink(pages.tarieven, 'rates'),
        text('. How the practice handles your data is explained in the '),
        pageLink(pages.privacybeleid, 'privacy policy'),
        text('. If you are dissatisfied, you can turn to the '),
        pageLink(pages.klachtenfunctionaris, 'complaints officer'),
        text('.'),
      ),
    ),
  },
})

const pageIdBySlug = async (slug) => {
  const { items } = await request('GET', `/entries?content_type=page&fields.slug=${slug}&limit=1`)
  if (!items[0]) throw new Error(`[terms] no page with slug ${slug}`)
  return items[0].sys.id
}

const main = async () => {
  const pages = {
    tarieven: await pageIdBySlug('tarieven'),
    privacybeleid: await pageIdBySlug('privacybeleid'),
    klachtenfunctionaris: await pageIdBySlug('klachtenfunctionaris'),
  }
  const section = await request('GET', `/entries/${sectionId}`)
  if (section.sys.contentType.sys.id !== 'section') throw new Error('[terms] not a basic section')

  for (const [locale, fields] of Object.entries(terms(pages))) {
    for (const [field, value] of Object.entries(fields)) {
      section.fields[field] = { ...section.fields[field], [locale]: value }
    }
    console.info(
      `[terms] ${apply ? 'set' : 'would set'} ${locale}: "${fields.title}", ${fields.content.content.length} blocks`,
    )
  }
  if (!apply) return

  const saved = await request('PUT', `/entries/${sectionId}`, {
    body: { fields: section.fields, metadata: section.metadata },
    version: section.sys.version,
  })
  console.info(
    `[terms] saved as draft (version ${saved.sys.version}, published ${saved.sys.publishedVersion}); publish it in Contentful after review`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
