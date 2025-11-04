import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

interface Props {}

const Banner = ({}: Props): JSX.Element => {
  const { banner } = useContext(AppContext);

  if (!banner || !banner.fields.isEnabled) return null;

  return (
    <section
      className="relative w-full bg-brand-denim text-white"
      aria-label="Tijdelijke melding"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-6 py-3 text-center sm:flex-row sm:gap-6 sm:text-left">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
          Update
        </span>
        <p className="text-sm font-medium leading-relaxed text-white/90">{banner.fields.message}</p>
      </div>
    </section>
  );
};

export default Banner;
