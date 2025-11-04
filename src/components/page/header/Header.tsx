import cx from 'classnames';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PageContext } from '../context/PageContext';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import MobileMenuToggle from './MobileMenuToggle';
import { MenuContext } from '../context/MenuContext';
import { AppContext } from '../context/AppContext';
import { useRouter } from 'next/router';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { CONTACT_DETAILS } from '../../../core/contact';
import Link from 'next/link';

interface Props {}

const Header = ({}: Props): JSX.Element => {
  const { hasDarkBackground } = useContext(PageContext);
  const [show, setShow] = useState<boolean>(false);
  const { headerMenu: menu } = useContext(AppContext);
  const router = useRouter();

  const hideMenu = useCallback(() => {
    setShow(false);
  }, [setShow]);

  useEffect(() => {
    router.events.on('routeChangeStart', hideMenu);

    return () => router.events.off('routeChangeStart', hideMenu);
  }, [hideMenu, router.events]);

  const contactItems = useMemo(() => {
    const items = [] as Array<JSX.Element>;

    if (CONTACT_DETAILS.phone) {
      items.push(
        <a
          key="phone"
          href={CONTACT_DETAILS.phone.href}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <HiOutlinePhone className="h-4 w-4" aria-hidden />
          <span>{CONTACT_DETAILS.phone.formatted}</span>
        </a>,
      );
    }

    if (CONTACT_DETAILS.email) {
      items.push(
        <a
          key="email"
          href={CONTACT_DETAILS.email.href}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <HiOutlineMail className="h-4 w-4" aria-hidden />
          <span>{CONTACT_DETAILS.email.address}</span>
        </a>,
      );
    }

    return items;
  }, []);

  return (
    <header
      className={cx(
        'sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-300',
        hasDarkBackground
          ? 'border-white/10 bg-brand-midnight/90 text-white'
          : 'border-brand-denim/10 bg-white/85 text-neutral-800 shadow-sm',
      )}
      aria-label="Hoofdnavigatie"
    >
      <MenuContext.Provider value={{ type: 'sidebar', show, setShow, hasDarkBackground, menu }}>
        <MobileMenu />
      </MenuContext.Provider>

      {contactItems.length > 0 && (
        <div
          className={cx(
            'hidden border-b px-6 py-2 text-sm sm:flex sm:items-center sm:justify-between',
            hasDarkBackground ? 'border-white/10 text-white/80' : 'border-brand-denim/10 text-neutral-600',
          )}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-current/70">Neem contact op</span>
          <div className="flex items-center gap-6 text-current">{contactItems}</div>
        </div>
      )}

      <MenuContext.Provider value={{ type: 'main', show, setShow, hasDarkBackground, menu }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <DesktopMenu />
          <div className="flex items-center gap-3">
            {CONTACT_DETAILS.phone && (
              <a
                href={CONTACT_DETAILS.phone.href}
                className={cx('hidden text-sm font-semibold md:inline-flex', {
                  'text-white hover:text-white': hasDarkBackground,
                  'text-brand-denim hover:text-brand-midnight': !hasDarkBackground,
                })}
              >
                Bel direct
              </a>
            )}
            <Link href="/contact" className="button-primary hidden sm:inline-flex">
              Plan een kennismaking
            </Link>
            <MobileMenuToggle className="md:hidden" />
          </div>
        </div>
      </MenuContext.Provider>
    </header>
  );
};

export default Header;
