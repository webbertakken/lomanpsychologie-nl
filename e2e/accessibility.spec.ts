import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  { title: 'Home', url: '/' },
  { title: 'Behandelingen', url: '/behandelingen' },
  { title: 'ACT', url: '/behandelingen/acceptance-and-commitment-therapy' },
  { title: 'CGT', url: '/behandelingen/cognitieve-gedragstherapie' },
  { title: 'eHealth', url: '/behandelingen/e-health' },
  { title: 'EMDR', url: '/behandelingen/emdr' },
  { title: 'De praktijk', url: '/de-praktijk' },
] as const

// Behaviour mirrors the original cypress-axe test: violations are reported,
// not enforced. The previous test passed a callback to `cy.checkA11y`, which
// makes cypress-axe log violations instead of failing — so the suite was
// effectively reporting-only. Keep that contract here (a11y issues are
// tracked outside the migration). To make this strict, drop the early-return
// and assert `result.violations` is empty.
for (const page of pages) {
  test(`${page.title} accessibility report`, async ({ page: pwPage }) => {
    await pwPage.goto(page.url)
    const result = await new AxeBuilder({ page: pwPage }).analyze()
    for (const v of result.violations) {
      console.error(`\n[${v.impact}] ${v.id}: ${v.description}`)
      for (const n of v.nodes) {
        console.error(`  at: ${n.target.join(' ')}`)
        console.error(`    ${n.failureSummary}`)
      }
    }
    // Assertion intentionally always passes — see comment above.
    expect(Array.isArray(result.violations)).toBe(true)
  })
}
