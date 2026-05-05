import cx from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import Cross from '../../../assets/cross.svg'
import Logo from '../../../assets/logo.svg'
import IconButton from '../../icons/IconButton'
import MenuItems from '../../menu/MenuItems'
import { MenuContext } from '../context/MenuContext'

interface Props {}

function MobileMenu({}: Props): JSX.Element {
  const { show, setShow, menu } = useContext(MenuContext)

  return (
    <>
      <div
        className={
          show
            ? 'w-full h-full md:hidden absolute z-40 transform translate-x-0 '
            : 'w-full h-full md:hidden absolute z-40 transform -translate-x-full'
        }
      >
        <div
          className="bg-gray-800 opacity-50 inset-0 fixed w-full h-full"
          onClick={() => setShow(!show)}
        />
        <div className="w-64 z-20 absolute left-0 z-40 top-0 bg-white shadow flex-col justify-between transition duration-150 ease-in-out h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="px-6 pt-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="z-10" aria-label="Logo of Loman psychologiepraktijk">
                  <Image
                    alt="Loman Psychologiepraktijk"
                    src={Logo}
                    className="h-12 w-auto md:h-14 select-none cursor-pointer"
                  />
                </Link>

                <IconButton ariaLabel="close sidebar menu" onClick={() => setShow(!show)}>
                  <Image src={Cross} alt="close sidebar menu" />
                </IconButton>
              </div>

              <MenuItems
                menu={menu}
                className={cx('flex-col py-5 space-y-4 text-base')}
                itemClassName={'text-gray-900 hover:text-gray-800'}
                subMenuClassName={'pt-4'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
