#!/usr/bin/env node
/**
 * Creates the FAQ in Contentful: the `faqItem` and `faqSection` content types,
 * the questions grouped in three sections, and the "veelgestelde-vragen" page
 * pointing at them. Safe to run again: everything has a fixed id and is
 * updated in place.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... node scripts/contentful-faq.mjs [--dry-run]
 *
 * The answers restate what the site already says elsewhere; the practice
 * owner edits them in Contentful from here on.
 */
import process from 'node:process'

const space = process.env.CONTENTFUL_SPACE_ID
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'
const locale = 'nl-NL'
const dryRun = process.argv.includes('--dry-run')

if (!space || !token) {
  console.error('[faq] set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const base = `https://api.contentful.com/spaces/${space}/environments/${environment}`

const request = async (method, path, { body, version, contentType } = {}) => {
  const response = await fetch(`${base}${path}`, {
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
  if (!response.ok) {
    throw new Error(`[faq] ${method} ${path} answered ${response.status}: ${await response.text()}`)
  }
  return response.status === 204 ? null : response.json()
}

const upsert = async (kind, id, body, contentType) => {
  const path = `/${kind}/${id}`
  const existing = await request('GET', path)
  if (dryRun) {
    console.info(`[faq] would ${existing ? 'update' : 'create'} ${kind} ${id}`)
    return
  }
  const saved = await request('PUT', path, { body, version: existing?.sys.version, contentType })
  await request('PUT', `${path}/published`, { version: saved.sys.version })
  console.info(`[faq] ${existing ? 'updated' : 'created'} and published ${kind} ${id}`)
}

// Rich text
const text = (value, marks = []) => ({
  nodeType: 'text',
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
})
const bold = (value) => text(value, ['bold'])
const link = (uri, value) => ({ nodeType: 'hyperlink', data: { uri }, content: [text(value)] })
const pageLink = (id, value) => ({
  nodeType: 'entry-hyperlink',
  data: { target: { sys: { id, type: 'Link', linkType: 'Entry' } } },
  content: [text(value)],
})
const paragraph = (...content) => ({ nodeType: 'paragraph', data: {}, content })
const document = (...content) => ({ nodeType: 'document', data: {}, content })

const pageIdBySlug = async (slug) => {
  const { items } = await request('GET', `/entries?content_type=page&fields.slug=${slug}&limit=1`)
  if (!items[0]) throw new Error(`[faq] no page with slug ${slug}`)
  return items[0].sys.id
}

const contentTypes = [
  {
    id: 'faqItem',
    body: {
      name: 'FaqItem',
      description: 'One question with its answer.',
      displayField: 'question',
      fields: [
        { id: 'question', name: 'Question', type: 'Symbol', required: true, localized: false },
        { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false },
        { id: 'answer', name: 'Answer', type: 'RichText', required: true, localized: false },
      ],
    },
  },
  {
    id: 'faqSection',
    body: {
      name: 'FaqSection',
      description: 'A group of questions shown as a field on a page.',
      displayField: 'title',
      fields: [
        { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: false },
        { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false },
        { id: 'subtitle', name: 'Subtitle', type: 'Symbol', required: false, localized: false },
        {
          id: 'questions',
          name: 'Questions',
          type: 'Array',
          required: true,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [{ linkContentType: ['faqItem'] }],
          },
        },
      ],
    },
  },
]

const questionsFor = (pages) => [
  {
    section: 'aanmelden',
    slug: 'heb-ik-een-verwijzing-nodig',
    question: 'Heb ik een verwijzing nodig?',
    answer: document(
      paragraph(
        text('Ja. U heeft een verwijzing van uw huisarts nodig naar de '),
        bold('basis-generalistische GGZ'),
        text('. Overleg met uw huisarts of uw klachten daarbinnen behandeld kunnen worden.'),
      ),
    ),
  },
  {
    section: 'aanmelden',
    slug: 'voor-wie-is-de-praktijk',
    question: 'Voor wie is de praktijk?',
    answer: document(
      paragraph(
        text(
          'Voor volwassenen vanaf 18 jaar met lichte tot matig ernstige, niet-complexe psychische klachten. Denk aan klachten die te maken hebben met depressie, angst, psychotrauma, verwerking en lichamelijke ziekte.',
        ),
      ),
    ),
  },
  {
    section: 'aanmelden',
    slug: 'hoe-meld-ik-me-aan',
    question: 'Hoe meld ik me aan?',
    answer: document(
      paragraph(
        text(
          'Neem na de verwijzing contact op via info@lomanpsychologie.nl of 06-21591133. U ontvangt dan een folder van de praktijk, een aanmeldformulier en een voorstel voor een datum en tijd voor een eerste gesprek.',
        ),
      ),
      paragraph(text('Het aanmeldformulier kunt u meenemen naar dit eerste gesprek.')),
    ),
  },
  {
    section: 'aanmelden',
    slug: 'hoe-lang-is-de-wachttijd',
    question: 'Hoe lang is de wachttijd?',
    answer: document(
      paragraph(
        text('De actuele wachttijd, en of er een aanmeldstop geldt, staat op de '),
        link('/#wachttijden', 'homepage onder Wachttijden'),
        text('.'),
      ),
      paragraph(
        text(
          'Vindt u de wachttijd te lang? Uw zorgverzekeraar kan u helpen met wachtlijstbemiddeling.',
        ),
      ),
    ),
  },
  {
    section: 'kosten',
    slug: 'wordt-de-behandeling-vergoed',
    question: 'Wordt de behandeling vergoed?',
    answer: document(
      paragraph(
        text(
          'Met een verwijzing naar de basis-generalistische GGZ valt de behandeling onder de basisverzekering. Wel wordt eerst uw eigen risico aangesproken, als dat nog niet bij andere zorgverleners is gebeurd.',
        ),
      ),
      paragraph(
        text('Met welke zorgverzekeraars de praktijk een contract heeft, leest u op de '),
        link('/#vergoeding', 'homepage onder Vergoeding'),
        text('. De bedragen per behandeling staan bij de '),
        pageLink(pages.tarieven, 'tarieven'),
        text('.'),
      ),
    ),
  },
  {
    section: 'kosten',
    slug: 'wat-als-ik-een-afspraak-niet-kan-nakomen',
    question: 'Wat als ik een afspraak niet kan nakomen?',
    answer: document(
      paragraph(
        text(
          'Zeg de afspraak uiterlijk 24 uur van tevoren af, per mail of telefonisch. Wanneer u zonder tijdige afmelding niet verschijnt, wordt €80,- bij u in rekening gebracht. Dit bedrag kunt u niet declareren bij uw zorgverzekeraar.',
        ),
      ),
    ),
  },
  {
    section: 'behandeling',
    slug: 'kan-ik-ook-online-gesprekken-hebben',
    question: 'Kan ik ook online gesprekken hebben?',
    answer: document(
      paragraph(
        text(
          'Naast gesprekken in de praktijk kan in overleg gekozen worden voor beeldbellen. In veel gevallen is ook blended behandeling mogelijk: ondersteuning via e-health naast de gesprekken.',
        ),
      ),
    ),
  },
  {
    section: 'behandeling',
    slug: 'wat-doe-ik-bij-een-crisis',
    question: 'Wat doe ik bij een crisis of buiten kantoortijden?',
    answer: document(
      paragraph(
        text(
          'De praktijk heeft geen crisisdienst. Bent u bij de praktijk in behandeling, dan kunt u in de avond, de nacht, het weekend of bij een crisis de Centrale Huisartsenpost (ZGT Almelo) bellen via 088-5880588. Hulp is 24 uur per dag mogelijk.',
        ),
      ),
      paragraph(text('Denkt u aan zelfdoding? Bel 113 of gratis 0800-0113.')),
    ),
  },
  {
    section: 'behandeling',
    slug: 'wat-als-ik-ontevreden-ben',
    question: 'Wat als ik ontevreden ben?',
    answer: document(
      paragraph(
        text(
          'Bespreek het eerst met uw behandelaar; vaak lost een gesprek veel op. Komt u er samen niet uit, dan kunt u terecht bij de ',
        ),
        pageLink(pages.klachtenfunctionaris, 'klachtenfunctionaris'),
        text('.'),
      ),
    ),
  },
]

const sections = [
  { slug: 'aanmelden', title: 'Aanmelden', subtitle: 'Voordat u start' },
  { slug: 'kosten', title: 'Kosten', subtitle: 'Vergoeding en afspraken' },
  { slug: 'behandeling', title: 'Tijdens de behandeling', subtitle: 'Gesprekken en hulp' },
]

const entryLink = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } })
const localised = (fields) =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { [locale]: value }]))

const main = async () => {
  for (const { id, body } of contentTypes) await upsert('content_types', id, body)

  const pages = {
    tarieven: await pageIdBySlug('tarieven'),
    klachtenfunctionaris: await pageIdBySlug('klachtenfunctionaris'),
    faq: await pageIdBySlug('veelgestelde-vragen'),
  }

  const questions = questionsFor(pages)
  for (const { slug, question, answer } of questions) {
    await upsert(
      'entries',
      `faq-${slug}`,
      { fields: localised({ question, slug, answer }) },
      'faqItem',
    )
  }

  for (const { slug, title, subtitle } of sections) {
    const ids = questions.filter((item) => item.section === slug).map((item) => `faq-${item.slug}`)
    const fields = localised({
      title,
      slug: `vragen-${slug}`,
      subtitle,
      questions: ids.map(entryLink),
    })
    await upsert('entries', `faq-section-${slug}`, { fields }, 'faqSection')
  }

  const page = await request('GET', `/entries/${pages.faq}`)
  const sectionLinks = sections.map(({ slug }) => entryLink(`faq-section-${slug}`))
  if (dryRun) {
    console.info(`[faq] would point page ${pages.faq} at ${sectionLinks.length} FAQ sections`)
    return
  }
  page.fields.sections = { [locale]: sectionLinks }
  page.fields.subtitle = { [locale]: 'Antwoorden op wat cliënten het vaakst vragen' }
  const saved = await request('PUT', `/entries/${pages.faq}`, {
    body: { fields: page.fields },
    version: page.sys.version,
  })
  await request('PUT', `/entries/${pages.faq}/published`, { version: saved.sys.version })
  console.info(`[faq] page ${pages.faq} now shows ${sectionLinks.length} FAQ sections`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
