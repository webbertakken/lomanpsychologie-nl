# Product

<!-- impeccable:product-schema 1 -->

Facts below come from the live site's own content (Contentful) and the codebase. Lines marked _(inferred)_ were not confirmed by the practice owner.

## Platform

web

## Users

- Adults (18+) in Wierden and the wider Twente region with mild to moderate, non-complex psychological complaints (depression, anxiety, trauma, grief, coping with physical illness), referred by their huisarts to the basis-generalistische GGZ.
- They often read on a phone, at home, while not feeling well; many are first-time visitors to any psychologist _(inferred)_.
- Secondary: huisartsen and praktijkondersteuners checking the current waiting time and which insurers are contracted _(inferred)_.

## Product Purpose

The website of Loman Psychologiepraktijk, the solo practice of Anke Loman, GZ-psycholoog. It explains who she is and how she works, which treatments she offers, what care costs and which insurers are contracted, the current intake status (including any aanmeldstop), and how to register after a GP referral. Success: a referred visitor knows within a minute whether they can register now, how to do it, and what it will cost them.

## Positioning

A personal, small solo practice inside gezondheidscentrum De Zonnehoed in Wierden: one psychologist, short lines with a regional network of care providers, scientifically grounded methods (CGT, ACT, EMDR, schematherapie, eHealth), described in her own voice ("persoonlijk, open-minded en inzichtgevend").

## Operating Context

- Registration runs by e-mail or phone after a GP referral; the practice sends a folder, a registration form and a proposed first appointment.
- Waiting time and aanmeldstop change a few times a year and are edited in Contentful by the practice.
- No crisis service: out of hours, clients go to the Huisartsenpost or 113.
- Content is authored in Contentful (pages, sections, rich text, tables, assets); the site must render whatever the author adds without code changes.

## Capabilities and Constraints

- Next.js (pages router) on Vercel with ISR, content from Contentful (locale nl-NL; an en-GB locale exists but carries no translations).
- Section types: basic rich-text section, profile card, therapy type list, therapy type detail, office hours. Optional site-wide banner notification.
- Header and footer menus are ordered in Contentful (menuSortOrder).
- Dutch is the only real content language.

## Brand Commitments

- The logo (cyan shield, orange "loman" wordmark, rust "psychologiepraktijk") stays exactly as it is.
- Voice: calm, warm, direct, formal "u" in practical information and "je" in the personal introduction, as the owner writes it.

## Evidence on Hand

- A real portrait of Anke Loman (Contentful asset, 500×902).
- Photos for each treatment page (Contentful assets).
- LVVP and NIP membership logos (Contentful assets).
- Full tariff tables, insurer lists, quality statement, privacy policy and complaint procedure in Contentful.
- No testimonials, reviews or outcome numbers exist; none may be invented.

## Product Principles

- Status before story: whether you can register now is never more than one glance away.
- Calm is a service: nothing moves, flashes or crowds a reader who is not feeling well.
- The practice speaks in its own words; the design never adds claims.
- Practical facts (address, phone, crisis numbers, costs) are findable without reading prose.

## Accessibility & Inclusion

WCAG 2.2 AA throughout. Readers may be distressed, tired or reading on a small phone: generous type, plain wayfinding, full keyboard support, reduced-motion respected, light and dark schemes.
