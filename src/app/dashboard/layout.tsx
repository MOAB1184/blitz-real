'use client'

import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Sidebar from '@/components/layout/Sidebar'
import MessageNotification from '@/components/messages/MessageNotification'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function DefaultAvatar({ name }: { name?: string | null }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  return (
    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 border-2 border-gray-300">
      {initials}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const [profileImage, setProfileImage] = useState<string | null>(user?.image || null)

  useEffect(() => {
    if (!user?.image) {
      fetch('/api/auth/profile')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.image) setProfileImage(data.image)
          else if (data?.logo) setProfileImage(data.logo)
        })
    } else {
      setProfileImage(user.image)
    }
  }, [user?.image])

  return (
    <div className="min-h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <Disclosure as="nav" className="shadow-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                <div className="flex items-center">
                  {/* Mobile menu button */}
                  <div className="-ml-2 mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                      <span className="sr-only">Open main menu</span>
                      <>
                        {open ? (
                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </>
                    </Disclosure.Button>
                  </div>

                  {/* Notification button */}
                  <MessageNotification />
                </div>

                {/* User menu desktop */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center gap-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {profileImage && profileImage.length > 0 ? (
                          <img src={profileImage} alt={user?.name || 'Profile'} className="h-8 w-8 rounded-full object-cover border-2 border-gray-300" />
                        ) : (
                          <DefaultAvatar name={user?.name} />
                        )}
                        <span className="hidden md:block text-gray-900 font-medium">{user?.name || 'Profile'}</span>
                        <span className="hidden md:block text-gray-500 text-xs">{user?.email || ''}</span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={"/dashboard/profile" || '/'}
                              className={classNames(
                                active ? 'bg-gray-200' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:text-gray-900'
                              )}
                            >
                              My Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={"/dashboard/settings" || '/'}
                              className={classNames(
                                active ? 'bg-gray-200' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:text-gray-900'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={classNames(
                                active ? 'bg-gray-200' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-gray-900'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

              </div>
            </div>

            {/* Mobile menu panel */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {/* Mobile Nav Items - if any are added here */}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4" style={{ borderColor: 'var(--secondary)' }}>
                <div className="flex items-center px-5">
                  {/* User avatar mobile */}
                  <div className="flex-shrink-0">
                    {profileImage && profileImage.length > 0 ? (
                      <img src={profileImage} alt={user?.name || 'Profile'} className="h-10 w-10 rounded-full object-cover border-2 border-gray-300" />
                    ) : (
                      <DefaultAvatar name={user?.name} />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name || 'Profile'}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email || ''}</div>
                  </div>
                  {/* Notification button mobile */}
                  <div className="ml-auto flex-shrink-0">
                    <MessageNotification />
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {/* Mobile Profile and Sign out links */}
                   <Link
                      href={"/dashboard/profile" || '/'}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                   >
                     My Profile
                   </Link>
                    <Link
                      href={"/dashboard/settings" || '/'}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Settings
                    </Link>
                    <button
                       onClick={() => signOut()}
                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                    >
                       Sign out
                    </button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 md:pl-64">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

