---
name: Loman Psychologiepraktijk
description: The practice's own paperwork, made kind: ruled card stock, blue-black ink, a rust stamp.
colors:
  paper: "#ffffff"
  paper-deep: "#f1f6f8"
  ink: "#15283a"
  ink-soft: "#3f5567"
  rule: "#b6e1ec"
  rule-strong: "#00a7d3"
  label: "#006a85"
  stamp: "#a84c14"
  carbon-paper: "#0e1a24"
  carbon-paper-deep: "#13232f"
  carbon-ink: "#e6eef2"
  carbon-ink-soft: "#a9bac6"
  carbon-rule: "#1f4656"
  carbon-rule-strong: "#2bb8de"
  carbon-label: "#6fd0ea"
  carbon-stamp: "#f0a070"
typography:
  display:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "4.5rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  quote:
    fontFamily: "Literata, ui-serif, Georgia, serif"
    fontSize: "1.65rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  sm: "2px"
spacing:
  ruling: "2rem"
  sheet-gutter: "2.5rem"
  field: "4rem"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "8px 18px"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.label}"
  button-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "44px"
  appointment-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "32px"
  stamp:
    textColor: "{colors.stamp}"
    rounded: "{rounded.sm}"
    padding: "1px 8px"
---

# Design System: Loman Psychologiepraktijk

## Overview

The site is the practice's own paperwork made kind: the folder, the appointment card and the registration form a referred client receives, filled in clearly. White card stock is ruled in cyan dropout ink (the logo's cyan), text is blue-black ballpoint, and the logo's rust is the one stamp colour for status. The dark scheme is the carbon copy: a blue-black sheet with pale cyan ruling.

Readers are often unwell, on a phone, in the evening. Calm is a service: status and contact come first, every topic is a labelled field, nothing moves except one quiet entrance.

## Colors

### Primary

- **Ink** (`ink`): all text and the filled button. Blue-black, never pure black.
- **Label cyan** (`label`): field labels, section subtitles, link icons, focus rings. The only cyan dark enough for text (6.2:1 on paper).

### Secondary

- **Dropout cyan** (`rule`, `rule-strong`): hairlines only. `rule` separates rows and fields; `rule-strong` (the logo cyan) marks a field's start, table heads, link underlines and the active state. Never text.

### Tertiary

- **Stamp rust** (`stamp`): status notices only (the banner's "Let op", the "Aanmeldstop"). Never decoration.

### Neutral

- **Paper** (`paper`) is the page; **Paper deep** (`paper-deep`) is the back of the folder: the footer and banner.
- Each light token has a `carbon-` twin used under `prefers-color-scheme: dark`.

### Named Rules

**The Dropout Rule.** Cyan is printed as lines, never as fills behind text.
**The One Stamp Rule.** Rust appears only where the practice's status changes what the reader should do.

## Typography

Literata (optical sizes) sets headings as if typed onto the form; Atkinson Hyperlegible sets prose and labels for readers who may be tired or anxious. Both are self-hosted through `next/font`.

### Hierarchy

- **Display** (Literata 500, up to 4.5rem): the page's `h1` only.
- **Title** (Literata 500, 1.875–2.25rem): section names in the label column.
- **Quote** (Literata 400, 1.25–1.65rem): the psychologist's own introduction.
- **Body** (Atkinson 400, 1.0625rem mobile, 1.125rem desktop, line height 1.65, max 68ch).
- **Label** (Atkinson 700, 0.875–1rem, label cyan): field names, subtitles, table heads.

### Named Rules

**The Two Voices Rule.** Literata speaks names and headings; Atkinson speaks everything that must be read or acted on. Only two weights of Atkinson: 400 and 700.

## Layout

One centred sheet, `max-width: 76rem`, gutters 1.25rem (mobile) and 2.5rem (from 48rem). Content pages are a column of fields: a 4/12 label column with the section title, sticky on desktop, and an 8/12 answer column. Fields are separated by a single `rule` hairline; a page header closes with a `rule-strong` line. The home hero is a folder spread on a 12-column grid: name and the appointment card in 7 columns on the left, the portrait in 5 columns on the right, spanning exactly the name and the card, so both panels share a top and a bottom edge. Her own words follow under the card, then "Op deze pagina" as a ruled index across the sheet. On a phone the portrait sits small beside her name and the card comes second.

## Elevation & Depth

Flat paper. Nothing overlaps: panels sit side by side and share their edges, as on an opened folder. No shadows, no blur, no glass.

## Shapes

Square corners with a 2px softening on buttons, stamps and focus rings. Images sit in a 1px `rule` frame, never rounded.

## Components

### Buttons

- **Ink** (`button-ink`): filled ink, paper text, 44px high, turns label cyan on hover. One per view: "Contact".
- **Line** (`button-line`): transparent with ink text; menu and close toggles.

### Cards / Containers

- **Appointment card**: the hero's signature. A `rule-strong` frame, a title, one line of guidance, then a definition list of ruled rows (Wachttijd, Mailen, Bellen) with label-cyan names on the left and tappable values on the right. While the practice has an aanmeldstop, the stamp and the practice's own note take the place of the guidance line.

### Navigation

- Desktop: text links with a 2px bottom line; `rule-strong` marks the current page. Sub pages open in a keyboard-operable popover.
- Mobile: a full-screen dialog sheet with large Literata links, sub pages in two columns, and the practice's contact and crisis details below.

### Tables

Set as timetables: a `rule-strong` head line, `rule` row lines, tabular figures, label-cyan header cells. Today's opening hours are marked by a doubled rule and the word "vandaag", never by colour alone.

### Downloads

A ruled tile with a download icon, the document's title, and its kind and size ("PDF, 226 kB").

## Do's and Don'ts

### Do:

- Do put status and contact before story.
- Do make every phone number and e-mail address tappable.
- Do carry state in line form (weight, doubling) plus words.
- Do test both schemes; every token has a carbon twin.

### Don't:

- Don't use shadows, gradients or blurred glass.
- Don't fill areas with cyan or rust.
- Don't animate content into view on scroll; content is visible by default.
- Don't add labels or eyebrows above headings; the label column already names each field.
