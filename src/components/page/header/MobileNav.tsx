import { CloseButton, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type JSX, useEffect, useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import { useCopy } from '../../../core/useLanguage'
import { useSiteChrome } from '../context/AppContext'
import PracticeContact from '../PracticeContact'
import LanguageSwitch from './LanguageSwitch'
import Logo from './Logo'

const MobileNav = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const { headerMenu, contactPath } = useSiteChrome()
  const copy = useCopy()
  const router = useRouter()

  useEffect(() => {
    const close = () => setIsOpen(false)
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  }, [router.events])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="button button-line -mr-2 border-transparent px-2.5 md:hidden"
      >
        <LuMenu aria-hidden className="size-6" />
        <span>{copy.menu}</span>
      </button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50 md:hidden">
        <DialogPanel
          transition
          className="fixed inset-0 overflow-y-auto bg-paper transition duration-200 ease-out data-closed:opacity-0"
        >
          <DialogTitle className="sr-only">{copy.menu}</DialogTitle>
          <div className="sheet flex h-18 items-center justify-between border-b">
            <Logo />
            <CloseButton className="button button-line -mr-2 border-transparent px-2.5">
              <LuX aria-hidden className="size-6" />
              <span>{copy.close}</span>
            </CloseButton>
          </div>

          <nav aria-label={copy.mainMenu} className="sheet py-4">
            <ul>
              {headerMenu.map((item) => (
                <li key={item.path} className="border-b">
                  <Link
                    href={item.path}
                    aria-current={item.isActive && item.subPages.length === 0 ? 'page' : undefined}
                    className={cx(
                      'flex min-h-14 items-center font-display text-2xl no-underline',
                      item.isActive && 'underline decoration-rule-strong decoration-2',
                    )}
                  >
                    {item.title}
                  </Link>
                  {item.subPages.length > 0 && (
                    <ul className="-mt-1 grid grid-cols-2 gap-x-4 pb-4">
                      {item.subPages.map((subPage) => (
                        <li key={subPage.path}>
                          <Link
                            href={subPage.path}
                            aria-current={subPage.isActive ? 'page' : undefined}
                            className="flex min-h-11 items-center text-ink-soft no-underline aria-[current=page]:font-bold aria-[current=page]:text-ink"
                          >
                            {subPage.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="border-b">
                <Link
                  href={contactPath}
                  className="flex min-h-14 items-center font-display text-2xl no-underline"
                >
                  {copy.contact}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sheet pt-2">
            <LanguageSwitch />
          </div>

          <div className="sheet pt-6 pb-10">
            <PracticeContact />
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default MobileNav
