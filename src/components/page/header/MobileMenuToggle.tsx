import MenuIcon from '../../../assets/hamburger.svg';
import Image from 'next/image';
import { MenuContext } from '../context/MenuContext';
import { useContext } from 'react';
import IconButton from '../../icons/IconButton';
import cx from 'classnames';

interface Props {
  className?: string;
}

function MobileMenuToggle({ className }: Props): JSX.Element {
  const { show, setShow, hasDarkBackground } = useContext(MenuContext);

  return (
    <IconButton
      className={className}
      ariaLabel="open sidebar menu"
      onClick={() => setShow(!show)}
      dark={hasDarkBackground}
    >
      <Image src={MenuIcon} alt="menu icon" className={cx('icon h-6 w-6', { invert: hasDarkBackground })} />
    </IconButton>
  );
}

export default MobileMenuToggle;
