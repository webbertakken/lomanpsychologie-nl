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
        'cursor-pointer md:hidden rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800',
        className,
        dark ? 'text-gray-200 hover:text-gray-100' : 'text-gray-900 hover:text-gray-800',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
