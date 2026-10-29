import type { JSX } from 'react'
import { MenuProps } from '../../types/menu'
import MenuItem from './MenuItem'

interface Props {
  menu: MenuProps
  className?: string
  itemClassName?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  subMenuClassName?: string
}

const MenuItems = ({
  menu,
  className,
  itemClassName,
  ariaLabel,
  ariaLabelledBy,
  subMenuClassName,
}: Props): JSX.Element => (
  <nav className={className} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
    {menu?.map(({ path, ...rest }) => (
      <MenuItem
        key={path}
        path={path}
        className={itemClassName}
        {...rest}
        subMenuClassName={subMenuClassName}
      />
    ))}
  </nav>
)

export default MenuItems
