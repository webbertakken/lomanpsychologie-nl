import Logo from '../../../assets/logo.svg';
import MenuItems from '../../menu/MenuItems';
import Image from 'next/image';
import Link from 'next/link';
import cx from 'classnames';
import { useContext } from 'react';
import { MenuContext } from '../context/MenuContext';

interface Props {}

function DesktopMenu({}: Props): JSX.Element {
  const { hasDarkBackground, menu } = useContext(MenuContext);

  return (
    <>
      <Link href="/" className="z-10 md:ml-8" aria-label="Logo of Loman psychologiepraktijk">
        <Image
          src={Logo}
          alt="Loman Psychologiepraktijk"
          className="h-10 w-auto select-none cursor-pointer md:h-12"
        />
      </Link>

      <MenuItems
        role="navigation"
        ariaLabel="Main navigation"
        menu={menu}
        className={cx(
          'hidden items-center gap-8 md:flex',
        )}
        itemClassName={
          hasDarkBackground
            ? 'text-white/70 hover:text-white'
            : 'text-neutral-700 hover:text-brand-denim'
        }
      />
    </>
  );
}

export default DesktopMenu;
