import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  { title: 'Home', url: '/' },
  { title: 'Behandelingen', url: '/behandelingen' },
  { title: 'ACT', url: '/behandelingen/acceptance-and-commitment-therapy' },
  { title: 'CGT', url: '/behandelingen/cognitieve-gedragstherapie' },
  { title: 'eHealth', url: '/behandelingen/e-health' },
  { title: 'EMDR', url: '/behandelingen/emdr' },
  { title: 'Tarieven', url: '/tarieven' },
  { title: 'De praktijk', url: '/de-praktijk' },
  { title: 'Contact', url: '/contact' },
  { title: 'Veelgestelde vragen', url: '/veelgestelde-vragen' },
  { title: 'Privacybeleid', url: '/privacybeleid' },
  { title: 'Contact in English', url: '/en/contact' },
  { title: 'Privacy policy in English', url: '/en/privacy-policy' },
  { title: 'Not found', url: '/deze-pagina-bestaat-niet' },
  { title: 'Home in English', url: '/en' },
  { title: 'Rates in English', url: '/en/rates' },
  { title: 'EMDR in English', url: '/en/therapy/emdr' },
] as const

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`${colorScheme} scheme`, () => {
    test.use({ colorScheme })

    for (const page of pages) {
      test(`${page.title} has no automatically detectable accessibility violations`, async ({
        page: pwPage,
      }) => {
        await pwPage.goto(page.url)
        const result = await new AxeBuilder({ page: pwPage })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
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
  })
}

test.describe('not found', () => {
  test('answers an unknown path with a Dutch 404 page instead of the home page', async ({
    page,
  }) => {
    const response = await page.goto('/deze-pagina-bestaat-niet')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Deze pagina bestaat niet (meer)',
    )
    await expect(page).toHaveURL(/deze-pagina-bestaat-niet$/)
  })
})

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('opens as a dialog, keeps focus inside and closes on Escape', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Menu' })

    await toggle.click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog.getByRole('link', { name: 'Tarieven' })).toBeVisible()

    for (let index = 0; index < 20; index++) await page.keyboard.press('Tab')
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(toggle).toBeFocused()
  })

  test('hides the closed menu from the tab order', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Naar de inhoud' })).toBeFocused()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused()
  })
})

test.describe('treatments submenu', () => {
  test('opens with the keyboard and closes on Escape', async ({ page }) => {
    await page.goto('/tarieven')
    const button = page.getByRole('button', { name: 'Behandelingen' })

    await button.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('link', { name: /EMDR/ })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toBeFocused()
  })
})

test.describe('home', () => {
  test('offers the phone number and the contact page in the first viewport', async ({ page }) => {
    await page.goto('/')
    const header = page.getByRole('banner')

    await expect(header.getByRole('link', { name: '06-21591133' })).toHaveAttribute(
      'href',
      'tel:0621591133',
    )
    await expect(header.getByRole('link', { name: '06-21591133' })).toBeInViewport()
    await expect(header.getByRole('link', { name: 'Contact', exact: true })).toBeInViewport()
  })

  test('offers the contact page in the first viewport on a small laptop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 })
    await page.goto('/')

    await expect(
      page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true }),
    ).toBeInViewport()
  })

  for (const width of [1024, 1280, 1680]) {
    test(`sets the appointment card under the portrait, clear of it, at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const card = await page.getByRole('complementary', { name: 'Afspraak maken' }).boundingBox()
      const portrait = await page.getByRole('img', { name: /Portret van/ }).boundingBox()
      if (!card || !portrait) throw new Error('the card or the portrait is not on the page')

      const gap = card.y - (portrait.y + portrait.height)
      expect(gap).toBeGreaterThan(0)
      expect(gap).toBeLessThan(48)
      expect(Math.abs(card.x - portrait.x)).toBeLessThan(2)
      expect(Math.abs(card.width - portrait.width)).toBeLessThan(2)
    })
  }
})

test.describe('home on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('reads her own words before the appointment card', async ({ page }) => {
    await page.goto('/')
    const words = await page.getByText(/persoonlijk, open-minded/i).boundingBox()
    const card = await page.getByRole('complementary', { name: 'Afspraak maken' }).boundingBox()

    expect(words?.y ?? Infinity).toBeLessThan(card?.y ?? 0)
  })
})

test.describe('page index', () => {
  test('lists the sections of De praktijk, then the contracted insurers', async ({ page }) => {
    await page.goto('/de-praktijk')
    const index = page.getByRole('navigation', { name: 'Op deze pagina' })

    await expect(index.getByRole('link', { name: 'Locatie' })).toHaveAttribute('href', '#locatie')
    await index.getByRole('link', { name: 'Gecontracteerde zorgverzekeraars' }).click()

    await expect(page).toHaveURL(/\/#vergoeding$/)
    await expect(page.locator('#vergoeding')).toBeInViewport()
  })

  test('leaves short pages without an index', async ({ page }) => {
    await page.goto('/contact')

    await expect(page.getByRole('navigation', { name: 'Op deze pagina' })).toHaveCount(0)
  })
})

test.describe('faq', () => {
  test('lists questions from Contentful that open in place', async ({ page }) => {
    await page.goto('/veelgestelde-vragen')
    const question = page.getByText('Hoe meld ik me aan?')

    await question.click()

    await expect(page.getByRole('link', { name: 'info@lomanpsychologie.nl' }).first()).toBeVisible()
    await expect(page.getByText('In aanbouw')).toHaveCount(0)
  })
})

test.describe('language switch', () => {
  test('opens the same page in English and back in Dutch', async ({ page }) => {
    await page.goto('/tarieven')

    await page.getByRole('link', { name: 'English' }).click()
    await expect(page).toHaveURL(/\/en\/rates$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('link', { name: 'Nederlands' }).click()
    await expect(page).toHaveURL(/\/tarieven$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
  })

  test('redirects a Dutch address under /en to its English address', async ({ page }) => {
    await page.goto('/en/tarieven')

    await expect(page).toHaveURL(/\/en\/rates$/)
  })
})

test.describe('mobile header', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('keeps the menu button on screen and the language switch inside the menu', async ({
    page,
  }) => {
    await page.goto('/en')

    await expect(page.getByRole('button', { name: 'Menu' })).toBeInViewport({ ratio: 1 })
    await expect(page.getByRole('banner').getByRole('link', { name: 'Nederlands' })).toBeHidden()

    await page.getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('dialog').getByRole('link', { name: 'Nederlands' })).toBeVisible()
  })
})

test.describe('long texts', () => {
  test('index their headings and jump to the one chosen', async ({ page }) => {
    await page.goto('/privacybeleid')
    const index = page.getByRole('navigation', { name: 'Op deze pagina' })

    await index.getByRole('link', { name: 'Beveiliging' }).click()

    await expect(page).toHaveURL(/#beveiliging$/)
    await expect(page.getByRole('heading', { name: 'Beveiliging' })).toBeInViewport()
  })
})

test.describe('contact page', () => {
  test('leads with the address, the route and the way to the waiting room', async ({ page }) => {
    await page.goto('/contact')

    await expect(page.getByText('Schoolstraat 27').first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Route plannen' })).toHaveAttribute(
      'href',
      /maps\.app\.goo\.gl/,
    )
    await expect(
      page.getByRole('list', { name: 'Zo vindt u de wachtkamer' }).getByRole('listitem'),
    ).toHaveCount(3)
    await expect(
      page
        .getByRole('complementary', { name: 'Bij crisis' })
        .getByRole('link', { name: '088-5880588' }),
    ).toHaveAttribute('href', 'tel:0885880588')
  })

  test('says the GP stays the point of contact before offering e-mail', async ({ page }) => {
    await page.goto('/contact')

    const note = await page.getByText(/blijft uw huisarts uw aanspreekpunt/).boundingBox()
    const email = await page
      .getByRole('main')
      .getByRole('link', { name: 'info@lomanpsychologie.nl' })
      .boundingBox()
    expect(note?.y ?? Infinity).toBeLessThan(email?.y ?? 0)
  })

  test('does not repeat the contact details in the footer', async ({ page }) => {
    await page.goto('/contact')

    await expect(
      page.getByRole('contentinfo').getByText('Buiten kantoortijden en bij crisis'),
    ).toHaveCount(0)
  })
})

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'light' })

  test('overrides the system, survives a reload and paints dark from the start', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .getByRole('banner')
      .getByRole('button', { name: /Wissel naar donker/ })
      .click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Read the page as the browser first draws it, before any of the app has run.
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        ;(window as unknown as { firstPaint: string }).firstPaint = getComputedStyle(
          document.documentElement,
        ).backgroundColor
      })
    })
    await page.reload()

    expect(
      await page.evaluate(() => (window as unknown as { firstPaint: string }).firstPaint),
    ).toBe('rgb(14, 26, 36)')
    await expect(
      page.getByRole('banner').getByRole('button', { name: /Weergave: donker/ }),
    ).toBeVisible()

    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(result.violations).toEqual([])
  })

  test('returns to the system after light', async ({ page }) => {
    await page.goto('/')
    const banner = page.getByRole('banner')
    await banner.getByRole('button', { name: /Wissel naar donker/ }).click()
    await banner.getByRole('button', { name: /Wissel naar licht/ }).click()
    await banner.getByRole('button', { name: /Wissel naar systeem/ }).click()

    await page.reload()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme')
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    ).toBe('rgb(255, 255, 255)')
  })
})

test.describe('header', () => {
  for (const width of [1280, 1440]) {
    test(`keeps the phone number on one line in every theme at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const header = page.getByRole('banner')
      const phone = header.getByRole('link', { name: '06-21591133' })
      const lineHeight = await phone.evaluate((link) =>
        parseFloat(getComputedStyle(link).lineHeight),
      )

      for (let press = 0; press < 3; press++) {
        expect((await phone.boundingBox())?.height ?? Infinity).toBeLessThan(lineHeight * 1.5)
        await header.getByRole('button', { name: /Weergave|Appearance/ }).click()
      }
    })
  }
})

test.describe('header menu', () => {
  test('offers the questions page and leaves the way home to the logo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/tarieven')
    const menu = page.getByRole('navigation', { name: 'Hoofdmenu' })

    await expect(menu.getByRole('link', { name: 'Home' })).toHaveCount(0)
    await expect(
      page.getByRole('banner').getByRole('link', { name: /naar de homepage/ }),
    ).toHaveAttribute('href', '/')
    await menu.getByRole('link', { name: 'Vragen' }).click()
    await expect(page).toHaveURL(/\/veelgestelde-vragen$/)
  })

  test('offers the questions page in the phone menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()

    await page.getByRole('dialog').getByRole('link', { name: 'Vragen' }).click()
    await expect(page).toHaveURL(/\/veelgestelde-vragen$/)
  })

  for (const width of [1024, 1280]) {
    test(`keeps the whole header on screen at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')

      await expect(
        page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true }),
      ).toBeInViewport({ ratio: 1 })
    })
  }
})

test.describe('phone menu', () => {
  for (const [width, height] of [
    [768, 1024],
    [820, 1180],
  ]) {
    test(`keeps the contact and crisis details at the bottom at ${width}x${height}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.getByRole('button', { name: 'Menu' }).click()
      const crisis = await page
        .getByRole('dialog')
        .getByText('Buiten kantoortijden en bij crisis')
        .locator('..')
        .boundingBox()

      expect(height - ((crisis?.y ?? 0) + (crisis?.height ?? 0))).toBeLessThan(64)
    })
  }

  test('lets a short screen scroll to the details without overlap', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 560 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog')
    const toggle = await dialog.getByRole('button', { name: /Weergave/ }).boundingBox()
    const contact = await dialog.getByText('Contact met de praktijk').boundingBox()

    expect(contact?.y ?? 0).toBeGreaterThan((toggle?.y ?? 0) + (toggle?.height ?? 0))
    await dialog.getByText('Buiten kantoortijden en bij crisis').scrollIntoViewIfNeeded()
    await expect(dialog.getByText('Buiten kantoortijden en bij crisis')).toBeInViewport()
  })
})

test.describe('theme toggle on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('sits in the menu on the line of the language switch', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog')
    const language = await dialog.getByRole('link', { name: 'Nederlands' }).boundingBox()
    const toggle = await dialog.getByRole('button', { name: /Appearance/ }).boundingBox()

    expect(Math.abs((language?.y ?? 0) - (toggle?.y ?? 99))).toBeLessThan(12)
  })
})
