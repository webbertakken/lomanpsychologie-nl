import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import cx from 'classnames'
import Link from 'next/link'
import type { JSX } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import type { RootMenuItemProps } from '../../../types/menu'
import { useSiteChrome } from '../context/AppContext'

const itemClass = (isActive: boolean) =>
  cx(
    'inline-flex min-h-11 items-center gap-1 border-b-2 px-1 pt-0.5 font-bold no-underline transition-colors duration-150',
    isActive
      ? 'border-rule-strong text-ink'
      : 'border-transparent text-ink-soft hover:border-rule hover:text-ink',
  )

const SubMenu = ({ title, path, subtitle, isActive, subPages }: RootMenuItemProps) => (
  <Popover className="relative">
    <PopoverButton className={cx(itemClass(isActive), 'cursor-pointer data-open:text-ink')}>
      {title}
      <LuChevronDown
        aria-hidden
        className="size-4 transition-transform duration-200 in-data-open:rotate-180"
      />
    </PopoverButton>
    <PopoverPanel
      transition
      anchor={{ to: 'bottom start', gap: 12 }}
      className="z-40 w-[26rem] border border-rule bg-paper p-2 transition duration-200 ease-out data-closed:-translate-y-1 data-closed:opacity-0"
    >
      <CloseButton
        as={Link}
        href={path}
        className="block border-b border-rule px-4 pt-3 pb-4 no-underline hover:bg-paper-deep"
      >
        <span className="font-bold">Alle behandelingen</span>
        {subtitle && <span className="block text-sm text-ink-soft">{subtitle}</span>}
      </CloseButton>
      <ul>
        {subPages.map((subPage) => (
          <li key={subPage.path}>
            <CloseButton
              as={Link}
              href={subPage.path}
              aria-current={subPage.isActive ? 'page' : undefined}
              className="group block px-4 py-3 no-underline hover:bg-paper-deep aria-[current=page]:bg-paper-deep"
            >
              <span className="font-bold group-hover:underline group-hover:decoration-rule-strong">
                {subPage.title}
              </span>
              {subPage.subtitle && (
                <span className="block text-sm text-ink-soft">{subPage.subtitle}</span>
              )}
            </CloseButton>
          </li>
        ))}
      </ul>
    </PopoverPanel>
  </Popover>
)

const DesktopNav = (): JSX.Element => {
  const { headerMenu } = useSiteChrome()

  return (
    <nav aria-label="Hoofdmenu" className="hidden flex-1 md:block">
      <ul className="flex items-center gap-5 lg:gap-7">
        {headerMenu.map((item) => (
          <li key={item.path}>
            {item.subPages.length > 0 ? (
              <SubMenu {...item} />
            ) : (
              <Link
                href={item.path}
                aria-current={item.isActive ? 'page' : undefined}
                className={itemClass(item.isActive)}
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default DesktopNav
