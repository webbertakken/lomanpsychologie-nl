import { useContext } from 'react';
import Logo from '../../../assets/logo.svg';
import Cross from '../../../assets/cross.svg';
import Link from 'next/link';
import { MenuContext } from '../context/MenuContext';
import IconButton from '../../icons/IconButton';
import MenuItems from '../../menu/MenuItems';
import cx from 'classnames';
import Image from 'next/image';
import { CONTACT_DETAILS } from '../../../core/contact';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

interface Props {}

function MobileMenu({}: Props): JSX.Element {
  const { show, setShow, menu } = useContext(MenuContext);

  return (
    <>
      <div
        className={
          show
            ? 'absolute z-40 h-full w-full transform translate-x-0 md:hidden'
            : 'absolute z-40 h-full w-full transform -translate-x-full md:hidden'
        }
      >
        <div className="fixed inset-0 h-full w-full bg-brand-midnight/60" onClick={() => setShow(!show)} />
        <div className="absolute left-0 top-0 z-40 flex h-full w-72 flex-col overflow-hidden bg-neutral-25 shadow-soft transition duration-150 ease-in-out">
          <div className="flex h-full flex-col">
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="z-10" aria-label="Logo of Loman psychologiepraktijk">
                  <Image alt="Loman Psychologiepraktijk" src={Logo} className="h-10 w-auto select-none" />
                </Link>

                <IconButton ariaLabel="close sidebar menu" onClick={() => setShow(!show)}>
                  <Image src={Cross} alt="close sidebar menu" />
                </IconButton>
              </div>
              <div className="mt-6 space-y-3 rounded-2xl bg-white/70 p-4 text-sm font-medium text-neutral-600 shadow-sm">
                {CONTACT_DETAILS.phone && (
                  <a href={CONTACT_DETAILS.phone.href} className="flex items-center gap-3">
                    <HiOutlinePhone className="h-4 w-4 text-brand-denim" />
                    <span>{CONTACT_DETAILS.phone.formatted}</span>
                  </a>
                )}
                {CONTACT_DETAILS.email && (
                  <a href={CONTACT_DETAILS.email.href} className="flex items-center gap-3">
                    <HiOutlineMail className="h-4 w-4 text-brand-denim" />
                    <span>{CONTACT_DETAILS.email.address}</span>
                  </a>
                )}
              </div>

              <MenuItems
                menu={menu}
                className={cx('mt-6 flex flex-col gap-2 text-base')}
                itemClassName={'text-neutral-700 hover:text-brand-midnight'}
                subMenuClassName={'mt-2 space-y-2 pl-4 text-sm text-neutral-500'}
              />
            </div>

            <div className="mt-auto border-t border-brand-denim/10 bg-white/60 p-6">
              <Link href="/contact" className="button-primary w-full justify-center">
                Plan een kennismaking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
