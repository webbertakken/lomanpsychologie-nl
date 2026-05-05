import { Popover } from '@headlessui/react'
import cx from 'classnames'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { RootMenuItemProps } from '../../types/menu'
import { MenuContext } from '../page/context/MenuContext'
import MenuPopover from './MenuPopover'
import MenuSubItems from './MenuSubItems'

interface Props extends RootMenuItemProps {
  className?: string
  subMenuClassName?: string
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
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { type } = useContext(MenuContext)

  const hasSubpages = subPages.length >= 1

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
          `group inline-flex items-center relative transition duration-150 ease-out`,
          className,
          { 'text-gray-500': isOpen },
          { '-mr-1': hasSubpages && type !== 'sidebar' },
        )}
      >
        <span className="pb-0.5">{title}</span>
        {hasSubpages && type !== 'sidebar' && (
          <HiChevronDown
            className={cx('text-gray-400 group-hover:text-gray-500', {
              'text-gray-600': isOpen,
            })}
            aria-hidden="true"
          />
        )}
        <span className="absolute bottom-0 left-0 inline-block w-full h-0.5 overflow-hidden">
          <span
            className={cx(
              'absolute inset-0 inline-block w-full h-1/2 transform group-hover:bg-gray-600',
              { 'bg-gray-500': isActive || isOpen },
            )}
          />
        </span>
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
  )
}

export default MenuItem
