import cx from 'classnames'

interface Props {
  children: JSX.Element
  onClick?: () => void
  dark?: boolean
  className?: string
  ariaLabel: string
}

function IconButton({ children, onClick, dark, className, ariaLabel }: Props): JSX.Element {
  return (
    <button
      aria-label={ariaLabel}
      className={cx(
        'cursor-pointer p-2 md:hidden rounded',
        className,
        dark ? 'text-white hover:text-gray-100' : 'text-gray-900 hover:text-gray-800',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default IconButton
