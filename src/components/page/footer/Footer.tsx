import CopyrightAndLinksLayer from './CopyrightAndLinksLayer';
import Image from 'next/image';
import Logo from '../../../assets/logo.svg';
import { CONTACT_DETAILS } from '../../../core/contact';
import MenuItems from '../../menu/MenuItems';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Link from 'next/link';

interface Props {}

const Footer = ({}: Props): JSX.Element => {
  const { footerMenu: menu } = useContext(AppContext);

  return (
    <footer role="contentinfo" className="mt-auto bg-brand-midnight text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Image src={Logo} alt="Loman Psychologiepraktijk" className="h-12 w-auto" />
            <p className="text-sm text-white/70">
              Persoonlijke psychologiepraktijk voor duurzame verandering en veerkracht in het hart van Utrecht.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Contact</h3>
            <div className="space-y-2 text-sm text-white/80">
              {CONTACT_DETAILS.phone && (
                <a href={CONTACT_DETAILS.phone.href} className="block hover:text-white">
                  {CONTACT_DETAILS.phone.formatted}
                </a>
              )}
              <a href={CONTACT_DETAILS.email.href} className="block hover:text-white">
                {CONTACT_DETAILS.email.address}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Navigatie</h3>
            <MenuItems
              menu={menu}
              className="flex flex-col gap-2 text-sm"
              itemClassName="text-white/70 hover:text-white"
              role="navigation"
              ariaLabel="Footer menu"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Afspraak maken</h3>
            <p className="text-sm text-white/70">
              Laat een bericht achter of plan direct een kennismakingsgesprek. Ik reageer binnen twee werkdagen.
            </p>
            <Link
              href="/contact"
              className="button-primary inline-flex w-full justify-center bg-white text-brand-denim hover:bg-brand-sky"
            >
              Plan een kennismaking
            </Link>
          </div>
        </div>

        <CopyrightAndLinksLayer />
      </div>
    </footer>
  );
};

export default Footer;
