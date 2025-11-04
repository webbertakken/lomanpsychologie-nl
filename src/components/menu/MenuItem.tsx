import Link from 'next/link';
import cx from 'classnames';
import { useContext, useState } from 'react';
import { Popover } from '@headlessui/react';
import { RootMenuItemProps } from '../../types/menu';
import { HiChevronDown } from 'react-icons/hi';
import MenuSubItems from './MenuSubItems';
import MenuPopover from './MenuPopover';
import { MenuContext } from '../page/context/MenuContext';

interface Props extends RootMenuItemProps {
  className?: string;
  subMenuClassName?: string;
}

const MenuItem = ({
  title,
  subtitle,
  path,
  isActive,
  subPages,
  className,
  subMenuClassName,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { type } = useContext(MenuContext);

  const hasSubpages = subPages.length >= 1;

  const isSidebar = type === 'sidebar';
  const linkClassName = isSidebar
    ? 'group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-colors duration-200'
    : 'group relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold transition-colors duration-200';

  return (
    <Popover
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        key={path}
        href={path}
        className={cx(
          linkClassName,
          className,
          {
            'text-brand-denim': isActive,
          },
          { '-mr-1': hasSubpages && !isSidebar },
        )}
      >
        <span className="relative flex items-center gap-2">
          {title}
          {hasSubpages && !isSidebar && (
            <HiChevronDown
              className={cx('h-4 w-4 transition-colors duration-200', {
                'text-brand-denim': isOpen,
                'text-current/60 group-hover:text-current': !isOpen,
              })}
              aria-hidden="true"
            />
          )}
        </span>
        {!isSidebar && (
          <span
            className={cx(
              'pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-brand-denim transition-all duration-200 ease-out group-hover:scale-x-100',
              { 'scale-x-100': isActive || isOpen },
            )}
          />
        )}
      </Link>

      {hasSubpages && type === 'main' && (
        <MenuPopover isOpen={isOpen} parentTitle={title} headerTitle={subtitle} headerLink={path}>
          <MenuSubItems subPages={subPages} />
        </MenuPopover>
      )}
      {hasSubpages && type === 'sidebar' && (
        <div className={subMenuClassName}>
          <MenuSubItems subPages={subPages} />
        </div>
      )}
    </Popover>
  );
};

export default MenuItem;
