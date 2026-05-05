import cx from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import Logo from '../../../assets/logo.svg'
import MenuItems from '../../menu/MenuItems'
import { MenuContext } from '../context/MenuContext'

interface Props {}

function DesktopMenu({}: Props): JSX.Element {
  const { hasDarkBackground, menu } = useContext(MenuContext)

  return (
    <>
      <Link href="/" className="z-10 md:ml-8" aria-label="Logo of Loman psychologiepraktijk">
        <Image
          src={Logo}
          alt="Loman Psychologiepraktijk"
          className="h-12 w-auto md:h-14 select-none cursor-pointer"
        />
      </Link>

      <MenuItems
        role="navigation"
        ariaLabel="Main navigation"
        menu={menu}
        className={cx(
          'hidden md:flex pr-8 top-0 left-0 z-0 flex items-center justify-center h-full py-5 -ml-0 space-x-4 text-base md:-ml-5 md:py-0',
        )}
        itemClassName={
          hasDarkBackground
            ? 'text-gray-200 hover:text-gray-100'
            : 'text-gray-900 hover:text-gray-800'
        }
      />
    </>
  )
}

export default DesktopMenu
