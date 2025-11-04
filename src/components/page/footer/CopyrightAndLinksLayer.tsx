import Link from 'next/link';

interface Props {}

const currentYear = new Date().getFullYear();

const CopyrightAndLinksLayer = ({}: Props): JSX.Element => {
  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
      <p>© {currentYear} Loman Psychologiepraktijk. Alle rechten voorbehouden.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/privacybeleid" className="hover:text-white">
          Privacybeleid
        </Link>
        <Link href="/algemene-voorwaarden" className="hover:text-white">
          Algemene voorwaarden
        </Link>
      </div>
    </div>
  );
};

export default CopyrightAndLinksLayer;
