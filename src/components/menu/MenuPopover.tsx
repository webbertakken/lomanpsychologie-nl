import Link from 'next/link';
import { Fragment, ReactChildren, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';

interface Props {
  isOpen: boolean;
  children: JSX.Element;
  parentTitle: string;
  headerTitle: string;
  headerLink: string;
}

function MenuPopover({
  isOpen,
  parentTitle,
  headerTitle,
  headerLink,
  children,
}: Props): JSX.Element {
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      {/* these values assume that the menu is on the right-hand side */}
      <Popover.Panel
        unmount={false}
        className="absolute right-0 z-20 mt-3 w-screen max-w-lg -translate-x-3 px-2 sm:px-0 2xl:left-1/2 2xl:-translate-x-1/2"
        aria-labelledby={`${parentTitle} submenu`}
      >
        <div className="overflow-hidden rounded-3xl bg-white/90 shadow-soft ring-1 ring-brand-denim/10 backdrop-blur">
          <div className="relative grid gap-5 px-6 py-6 sm:gap-6 sm:p-8">
            <Link
              key={headerLink}
              href={headerLink}
              className="text-sm font-semibold text-brand-denim transition hover:text-brand-midnight"
            >
              {headerTitle || parentTitle}
            </Link>
            {children}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
}

export default MenuPopover;
