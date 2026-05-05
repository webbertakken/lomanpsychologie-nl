import cx from 'classnames'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { MenuContext } from '../context/MenuContext'
import { PageContext } from '../context/PageContext'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import MobileMenuToggle from './MobileMenuToggle'

interface Props {}

const Header = ({}: Props): JSX.Element => {
  const { hasDarkBackground } = useContext(PageContext)
  const [show, setShow] = useState<boolean>(false)
  const { headerMenu: menu } = useContext(AppContext)
  const router = useRouter()

  const hideMenu = useCallback(() => {
    setShow(false)
  }, [setShow])

  useEffect(() => {
    router.events.on('routeChangeStart', hideMenu)

    return () => router.events.off('routeChangeStart', hideMenu)
  }, [hideMenu, router.events])

  return (
    <header
      className={cx(
        'w-full text-gray-300 body-font z-10',
        { 'bg-white/80': !hasDarkBackground },
        // axe-core cannot evaluate contrast through translucent backgrounds
        // and falls back to grey #808080, on which any light menu text
        // fails the 4.5:1 ratio. Use a solid dark colour instead so the
        // contrast can be evaluated correctly.
        { 'bg-gray-900': hasDarkBackground },
      )}
      aria-label="Main navigation bar"
    >
      <MenuContext.Provider value={{ type: 'sidebar', show, setShow, hasDarkBackground, menu }}>
        <MobileMenu />
      </MenuContext.Provider>

      <MenuContext.Provider value={{ type: 'main', show, setShow, hasDarkBackground, menu }}>
        <div className="container flex flex-row items-center justify-between py-4 px-6 mx-auto max-w-7xl">
          <DesktopMenu />
          <MobileMenuToggle />
        </div>
      </MenuContext.Provider>
    </header>
  )
}

export default Header
