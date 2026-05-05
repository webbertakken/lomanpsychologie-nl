import cx from 'classnames'
import Image from 'next/image'
import { useContext } from 'react'
import MenuIcon from '../../../assets/hamburger.svg'
import IconButton from '../../icons/IconButton'
import { MenuContext } from '../context/MenuContext'

interface Props {
  className?: string
}

function MobileMenuToggle({ className }: Props): JSX.Element {
  const { show, setShow, hasDarkBackground } = useContext(MenuContext)

  return (
    <IconButton
      className={className}
      ariaLabel="open sidebar menu"
      onClick={() => setShow(!show)}
      dark={hasDarkBackground}
    >
      <Image src={MenuIcon} alt="menu icon" className={cx('icon', { invert: hasDarkBackground })} />
    </IconButton>
  )
}

export default MobileMenuToggle
