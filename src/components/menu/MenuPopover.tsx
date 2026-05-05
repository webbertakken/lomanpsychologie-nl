import { Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment, ReactChildren, useState } from 'react'

interface Props {
  isOpen: boolean
  children: JSX.Element
  parentTitle: string
  headerTitle: string
  headerLink: string
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
        className="absolute z-10 right-0 -mr-4 pt-3 transform px-2 w-screen max-w-md sm:px-0 2xl:ml-0 2xl:left-1/2 2xl:-translate-x-1/2"
        aria-labelledby={`${parentTitle} submenu`}
      >
        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <Link key={headerLink} href={headerLink} className="text-gray-600 hover:text-gray-800">
              <strong>{headerTitle}</strong>
            </Link>
            {children}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  )
}

export default MenuPopover
