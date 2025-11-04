import { DynamicIcon } from '../icons/DynamicIcon';
import Link from 'next/link';
import { MenuItemProps, RootMenuItemProps } from '../../types/menu';

interface Props {
  subPages: Array<MenuItemProps>;
}

function MenuSubItems({ subPages }: Props): JSX.Element {
  return (
    <>
      {subPages.map(({ path, title, subtitle, icon }) => {
        return (
          <Link
            key={path}
            href={path}
            className="group -m-3 flex items-start gap-3 rounded-2xl p-3 transition hover:bg-brand-sky/40"
          >
            <DynamicIcon
              icon={icon}
              className="h-6 w-6 shrink-0 text-brand-denim"
              aria-hidden="true"
            />
            <div className="ml-4">
              <p className="text-sm font-semibold text-neutral-800 group-hover:text-brand-midnight">{title}</p>
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
}

export default MenuSubItems;
