import cx from 'classnames';

interface Props {
  children: JSX.Element;
  onClick?: () => void;
  dark?: boolean;
  className?: string;
  ariaLabel: string;
}

function IconButton({ children, onClick, dark, className, ariaLabel }: Props): JSX.Element {
  return (
    <button
      aria-label={ariaLabel}
      className={cx(
        'md:hidden rounded-full border border-transparent p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-denim',
        className,
        dark
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-brand-denim/10 text-brand-denim hover:bg-brand-denim/20',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
