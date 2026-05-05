import Link from 'next/link'
import { MenuItemProps, RootMenuItemProps } from '../../types/menu'
import { DynamicIcon } from '../icons/DynamicIcon'

interface Props {
  subPages: Array<MenuItemProps>
}

function MenuSubItems({ subPages }: Props): JSX.Element {
  return (
    <>
      {subPages.map(({ path, title, subtitle, icon }) => {
        return (
          <Link
            key={path}
            href={path}
            className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
          >
            <DynamicIcon
              icon={icon}
              className="shrink-0 h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default MenuSubItems
