#!/usr/bin/env node
/**
 * Fills the "Voorwaarden" section with the practice's general terms in Dutch
 * and British English: the treatment agreement, client rights, availability,
 * rates, the LVVP model payment terms (articles 1 to 7, word for word) and
 * the use of the website. Every statement comes from the practice's own
 * folder or website, the LVVP model text or the law. Saves a draft unless
 * --publish is given.
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node scripts/contentful-terms.mjs [--apply] [--publish]
 */
import process from 'node:process'

const sectionId = 'sUT7L1Dsl1bMONaJZ6CVx'
const apply = process.argv.includes('--apply')
const publish = process.argv.includes('--publish')
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

const subheading = (value) => ({ nodeType: 'heading-4', data: {}, content: [text(value)] })
const list = (...items) => ({
  nodeType: 'unordered-list',
  data: {},
  content: items.map((item) => ({
    nodeType: 'list-item',
    data: {},
    content: [paragraph(text(item))],
  })),
})

// The LVVP model payment terms, articles 1 to 7, word for word.
const lvvpArticles = {
  'nl-NL': [
    [
      'Artikel 1 – Toepassing',
      'Deze betalingsvoorwaarden zijn van toepassing op alle behandelingsovereenkomsten tussen de gz-psycholoog, psychotherapeut, klinisch psycholoog (hierna te noemen: behandelaar) en de patiënt.',
    ],
    [
      'Artikel 2 – Afspraken afzeggen',
      'Afspraken moeten uiterlijk 24 uur voor het tijdstip van de behandeling geannuleerd worden. Bij niet annuleren en bij annuleringen binnen 24 uur voor de afspraak is de behandelaar gerechtigd de gereserveerde tijd naar redelijkheid en billijkheid aan de patiënt in rekening te brengen.',
    ],
    [
      'Artikel 3 – Betalingstermijn',
      'De door de behandelaar aan de patiënt gedeclareerde kosten voor de behandeling dienen door de patiënt binnen 30 dagen na de datum van de factuur te zijn betaald.',
    ],
    [
      'Artikel 4 – Laatste herinnering',
      'Indien de patiënt het verschuldigde bedrag niet binnen 30 dagen na de factuurdatum heeft betaald, dan krijgt de patiënt een laatste gelegenheid om de factuur zonder ophoging van kosten binnen 14 dagen te betalen.',
    ],
    [
      'Artikel 5 – Incasso',
      'Voldoet de patiënt binnen 14 dagen na de datum van de betalingsherinnering niet aan zijn/haar verplichtingen, dan is de behandelaar zonder nadere ingebrekestelling gerechtigd incassomaatregelen te treffen, dan wel door derden te laten uitvoeren.',
    ],
    [
      'Artikel 6 – Incassokosten',
      'Alle buitengerechtelijke incassokosten verband houdende met de invordering van de gedeclareerde bedragen komen ten laste van de patiënt. De buitengerechtelijke incassokosten zijn vastgesteld op tenminste 15% van de hoofdsom met een minimum van € 25.',
    ],
    [
      'Artikel 7 – Opschorten van de behandeling',
      'Bij betalingsachterstand is de behandelaar gerechtigd - tenzij de behandeling zich hiertegen verzet - verdere behandeling op te schorten totdat de patiënt aan zijn/haar betalingsverplichtingen heeft voldaan.',
    ],
  ],
  'en-GB': [
    [
      'Article 1 – Scope',
      'These payment terms apply to all treatment agreements between the healthcare psychologist (gz-psycholoog), psychotherapist or clinical psychologist (hereinafter: the practitioner) and the patient.',
    ],
    [
      'Article 2 – Cancelling appointments',
      'Appointments must be cancelled no later than 24 hours before the time of the treatment. If an appointment is not cancelled, or is cancelled less than 24 hours beforehand, the practitioner is entitled to charge the patient for the reserved time on a fair and reasonable basis.',
    ],
    [
      'Article 3 – Payment period',
      'The costs of treatment invoiced by the practitioner to the patient must be paid by the patient within 30 days of the invoice date.',
    ],
    [
      'Article 4 – Final reminder',
      'If the patient has not paid the amount due within 30 days of the invoice date, the patient will be given a final opportunity to pay the invoice within 14 days without additional costs.',
    ],
    [
      'Article 5 – Debt collection',
      'If the patient does not meet his or her obligations within 14 days of the date of the payment reminder, the practitioner is entitled, without further notice of default, to take debt collection measures or to have these carried out by third parties.',
    ],
    [
      'Article 6 – Collection costs',
      'All extrajudicial collection costs relating to the recovery of the invoiced amounts are borne by the patient. The extrajudicial collection costs are set at no less than 15% of the principal sum, with a minimum of € 25.',
    ],
    [
      'Article 7 – Suspending treatment',
      'If payments are in arrears, the practitioner is entitled – unless the treatment itself precludes this – to suspend further treatment until the patient has met his or her payment obligations.',
    ],
  ],
}

const articles = (locale) =>
  lvvpArticles[locale].flatMap(([title, body]) => [subheading(title), paragraph(text(body))])

const terms = (pages) => ({
  'nl-NL': {
    title: 'Algemene voorwaarden',
    subtitle: 'Behandeling, betaling en het gebruik van deze website',
    content: document(
      paragraph(
        text(
          'Deze voorwaarden gelden voor behandelingen bij Loman Psychologiepraktijk en voor het gebruik van deze website. Ze beschrijven wat u van de praktijk kunt verwachten en wat de praktijk van u vraagt.',
        ),
      ),
      heading('De behandelovereenkomst'),
      paragraph(
        text(
          'Loman Psychologiepraktijk is een vrijgevestigde praktijk voor basis-generalistische GGZ, voor cliënten vanaf 18 jaar. U kunt bij de praktijk terecht met een verwijzing van uw huisarts.',
        ),
      ),
      paragraph(
        text(
          'In het eerste gesprek bespreken we uw hulpvraag en uw klachten. Blijkt dat uw klachten te zwaar of te licht zijn voor de basis-generalistische GGZ, dan wordt u terugverwezen naar uw huisarts.',
        ),
      ),
      paragraph(
        text(
          'Met de start van de behandeling gaat u een behandelovereenkomst aan. Daarop is de Wet op de geneeskundige behandelingsovereenkomst (WGBO) van toepassing.',
        ),
      ),
      heading('Uw rechten'),
      paragraph(text('Op grond van de WGBO heeft u onder meer recht op:')),
      list(
        'duidelijke informatie over uw klachten en de behandeling;',
        'het geven of weigeren van toestemming voor de behandeling;',
        'inzage in en een afschrift van uw dossier;',
        'geheimhouding: zonder uw toestemming worden geen gegevens over u aan anderen verstrekt, behalve aan wie direct bij uw behandeling betrokken is of wanneer de wet dat voorschrijft.',
      ),
      heading('Beroepscode en registratie'),
      paragraph(
        text(
          'Anke Loman is als GZ-psycholoog ingeschreven in het BIG-register (39927037225) en lid van het NIP en de LVVP. Zij werkt volgens de beroepscode voor psychologen van het NIP.',
        ),
      ),
      heading('Uw dossier en privacy'),
      paragraph(
        text(
          'De praktijk legt een dossier aan met de gegevens die nodig zijn voor uw behandeling. Het dossier wordt minimaal 20 jaar na de laatste wijziging bewaard, zoals de WGBO voorschrijft. Hoe de praktijk met uw persoonsgegevens omgaat, leest u in het ',
        ),
        pageLink(pages.privacybeleid, 'privacybeleid'),
        text('.'),
      ),
      heading('Bereikbaarheid en waarneming'),
      paragraph(
        text(
          'Tot uw behandeling is gestart, blijft uw huisarts uw aanspreekpunt. Nemen uw klachten toe of heeft u dringend hulp nodig, neem dan contact op met uw huisarts.',
        ),
      ),
      paragraph(
        text(
          'De praktijk heeft geen crisisdienst. Buiten kantoortijden en bij een crisis kunt u de Centrale Huisartsenpost (ZGT Almelo) bellen via 088-5880588. Denkt u aan zelfdoding? Bel 113 of gratis 0800-0113.',
        ),
      ),
      paragraph(
        text(
          'Tijdens vakanties en ziekte wordt waarneming geregeld met andere vrijgevestigde behandelaren in de regio. Als de praktijk gesloten is, staat dat op deze website, met de gegevens van de waarnemer.',
        ),
      ),
      heading('Tarieven en vergoeding'),
      paragraph(
        text(
          'De praktijk hanteert de tarieven die de Nederlandse Zorgautoriteit (NZa) jaarlijks vaststelt. U vindt ze bij de ',
        ),
        pageLink(pages.tarieven, 'tarieven'),
        text(
          '. Met een verwijzing naar de basis-generalistische GGZ valt de behandeling onder de basisverzekering; wel wordt eerst uw eigen risico aangesproken. Valt uw hulpvraag niet onder de verzekerde zorg, of kiest u ervoor de behandeling zelf te betalen, dan geldt het NZa-tarief voor een niet-basispakketzorg consult.',
        ),
      ),
      heading('Afspraken afzeggen'),
      paragraph(
        text(
          'Afspraken kunt u tot uiterlijk 24 uur van tevoren per mail of telefonisch afzeggen. Wanneer u zonder tijdige afmelding niet verschijnt, wordt €80,- bij u in rekening gebracht. Dit bedrag kunt u niet declareren bij uw zorgverzekeraar.',
        ),
      ),
      heading('Betalingsvoorwaarden'),
      paragraph(
        text(
          'Voor betalingen hanteert Loman Psychologiepraktijk de algemene betalingsvoorwaarden van de LVVP, de Landelijke Vereniging van Vrijgevestigde Psychologen & Psychotherapeuten.',
        ),
      ),
      ...articles('nl-NL'),
      heading('Klachten'),
      paragraph(
        text(
          'Bent u ontevreden, bespreek het dan eerst met uw behandelaar; vaak lost een gesprek veel op. Komt u er samen niet uit, dan kunt u terecht bij de ',
        ),
        pageLink(pages.klachtenfunctionaris, 'klachtenfunctionaris'),
        text('.'),
      ),
      heading('Gebruik van deze website'),
      paragraph(
        text(
          'De informatie op deze website is met zorg samengesteld en bedoeld als algemene informatie over de praktijk. Ze vervangt geen persoonlijk advies of behandeling. Tarieven, wachttijden en contracten met zorgverzekeraars kunnen wijzigen; aan de informatie op deze website kunt u geen rechten ontlenen.',
        ),
      ),
      paragraph(
        text(
          'Deze website plaatst geen cookies en gebruikt geen trackers of advertentiediensten. Afbeeldingen worden geladen via Contentful, het systeem waarin de teksten van deze website worden beheerd.',
        ),
      ),
      paragraph(
        text(
          'Links naar websites van anderen zijn bedoeld als service. De praktijk is niet verantwoordelijk voor de inhoud van die websites.',
        ),
      ),
      paragraph(
        text(
          'Teksten en het logo op deze website zijn eigendom van Loman Psychologiepraktijk. Foto’s zijn van de praktijk zelf of worden gebruikt onder de licentie van de fotograaf, zoals de licentie van Unsplash. Wilt u iets overnemen, neem dan eerst contact op.',
        ),
      ),
      heading('Wijzigingen'),
      paragraph(
        text(
          'De praktijk kan deze voorwaarden aanpassen. De versie op deze website is de geldende versie.',
        ),
      ),
      paragraph(text('Laatst geüpdatet op 04-11-2026')),
    ),
  },
  'en-GB': {
    title: 'General terms',
    subtitle: 'Treatment, payment and use of this website',
    content: document(
      paragraph(
        text(
          'These terms apply to treatment at Loman Psychologiepraktijk and to the use of this website. They describe what you can expect from the practice and what the practice asks of you.',
        ),
      ),
      heading('The treatment agreement'),
      paragraph(
        text(
          'Loman Psychologiepraktijk is an independent practice for generalist basic mental healthcare (basis-GGZ), for clients aged 18 and over. You can come to the practice with a referral from your GP (huisarts).',
        ),
      ),
      paragraph(
        text(
          'In the first appointment we discuss your request for help and your symptoms. If your symptoms turn out to be too severe or too mild for generalist basic mental healthcare, you will be referred back to your GP.',
        ),
      ),
      paragraph(
        text(
          'When treatment starts, you enter into a treatment agreement. The Dutch Medical Treatment Contracts Act (WGBO) applies to it.',
        ),
      ),
      heading('Your rights'),
      paragraph(text('Under the WGBO you are entitled, among other things, to:')),
      list(
        'clear information about your symptoms and the treatment;',
        'give or refuse consent to the treatment;',
        'see your file and receive a copy of it;',
        'confidentiality: no information about you is shared with others without your consent, except with those directly involved in your treatment or where the law requires it.',
      ),
      heading('Professional code and registration'),
      paragraph(
        text(
          'Anke Loman is registered as a healthcare psychologist (GZ-psycholoog) in the BIG register (39927037225) and is a member of the NIP and the LVVP. She works according to the NIP professional code for psychologists.',
        ),
      ),
      heading('Your file and privacy'),
      paragraph(
        text(
          'The practice keeps a file with the information needed for your treatment. The file is kept for at least 20 years after the last change to it, as the WGBO requires. How the practice handles your personal data is explained in the ',
        ),
        pageLink(pages.privacybeleid, 'privacy policy'),
        text('.'),
      ),
      heading('Availability and cover'),
      paragraph(
        text(
          'Until your treatment has started, your GP remains your point of contact. If your symptoms get worse or you need help urgently, please contact your GP.',
        ),
      ),
      paragraph(
        text(
          'The practice has no crisis service. Out of hours and in a crisis, you can call the Centrale Huisartsenpost (ZGT Almelo) on 088-5880588. Are you thinking about suicide? Call 113 or, free of charge, 0800-0113.',
        ),
      ),
      paragraph(
        text(
          'During holidays and illness, cover is arranged with other independent practitioners in the region. If the practice is closed, this website says so and gives the details of the practitioner providing cover.',
        ),
      ),
      heading('Rates and reimbursement'),
      paragraph(
        text(
          'The practice uses the rates set each year by the Dutch Healthcare Authority (NZa). You can find them under ',
        ),
        pageLink(pages.tarieven, 'rates'),
        text(
          '. With a referral to generalist basic mental healthcare, treatment is covered by the basic health insurance; your compulsory excess (eigen risico) is charged first. If your request for help is not covered by insured care, or you choose to pay for treatment yourself, the NZa rate for a consultation outside the basic package applies.',
        ),
      ),
      heading('Cancelling appointments'),
      paragraph(
        text(
          'You can cancel appointments by e-mail or phone up to 24 hours beforehand. If you do not attend without cancelling in time, you will be charged €80,-. You cannot claim this amount from your health insurer.',
        ),
      ),
      heading('Payment terms'),
      paragraph(
        text(
          'For payments, Loman Psychologiepraktijk applies the general payment terms of the LVVP, the Dutch national association of independent psychologists and psychotherapists (Landelijke Vereniging van Vrijgevestigde Psychologen & Psychotherapeuten).',
        ),
      ),
      ...articles('en-GB'),
      heading('Complaints'),
      paragraph(
        text(
          'If you are dissatisfied, please discuss it with your practitioner first; a conversation often resolves a lot. If you cannot resolve it together, you can turn to the ',
        ),
        pageLink(pages.klachtenfunctionaris, 'complaints officer'),
        text('.'),
      ),
      heading('Use of this website'),
      paragraph(
        text(
          'The information on this website has been compiled with care and is intended as general information about the practice. It does not replace personal advice or treatment. Rates, waiting times and contracts with health insurers may change; no rights can be derived from the information on this website.',
        ),
      ),
      paragraph(
        text(
          'This website does not set cookies and uses no trackers or advertising services. Images are loaded via Contentful, the system in which the texts of this website are managed.',
        ),
      ),
      paragraph(
        text(
          'Links to other websites are provided as a service. The practice is not responsible for the content of those websites.',
        ),
      ),
      paragraph(
        text(
          'Texts and the logo on this website are owned by Loman Psychologiepraktijk. Photos are the practice’s own or are used under the photographer’s licence, such as the Unsplash licence. If you would like to reuse anything, please get in touch first.',
        ),
      ),
      heading('Changes'),
      paragraph(
        text(
          'The practice may amend these terms. The version on this website is the version that applies.',
        ),
      ),
      paragraph(text('Last updated on 04-11-2026')),
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
  if (!publish) {
    console.info(`[terms] saved as draft (version ${saved.sys.version}); publish after review`)
    return
  }
  await request('PUT', `/entries/${sectionId}/published`, { version: saved.sys.version })
  console.info('[terms] published')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
