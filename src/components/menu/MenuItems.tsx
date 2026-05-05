import { MenuProps } from '../../types/menu'
import MenuItem from './MenuItem'

interface Props {
  menu: MenuProps
  className?: string
  itemClassName?: string
  role?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  subMenuClassName?: string
}

const MenuItems = ({
  menu,
  className,
  itemClassName,
  role,
  ariaLabel,
  ariaLabelledBy,
  subMenuClassName,
}: Props): JSX.Element => (
  <nav className={className} role={role} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
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
