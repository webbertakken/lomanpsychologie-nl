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

for (const page of pages) {
  test(`${page.title} has no automatically detectable accessibility violations`, async ({
    page: pwPage,
  }) => {
    await pwPage.goto(page.url)
    const result = await new AxeBuilder({ page: pwPage }).analyze()
    for (const v of result.violations) {
      console.error(`\n[${v.impact}] ${v.id}: ${v.description}`)
      for (const n of v.nodes) {
        console.error(`  at: ${n.target.join(' ')}`)
        console.error(`    ${n.failureSummary}`)
      }
    }
    expect(result.violations).toEqual([])
  })
}
