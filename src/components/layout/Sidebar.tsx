'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CreditCardIcon,
  StarIcon,
  BuildingOfficeIcon,
  PresentationChartLineIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react'

interface NavigationItem {
  name: string
  href: string
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & { title?: string; titleId?: string } & RefAttributes<SVGSVGElement>>
  tooltip?: string
  disabled?: boolean
  comingSoon?: boolean
}

// Navigation items for sponsors
const sponsorNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Browse Creators', href: '/dashboard/browse', icon: MagnifyingGlassIcon },
  { name: 'My Listings', href: '/dashboard/my-listings', icon: BriefcaseIcon },
  { name: 'Create New Listing', href: '/dashboard/my-listings/create', icon: PlusCircleIcon },
  { name: 'Applications', href: '/dashboard/applications', icon: DocumentTextIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

// Navigation items for creators
const creatorNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Browse Opportunities', href: '/dashboard/browse', icon: MagnifyingGlassIcon },
  { name: 'My Applications', href: '/dashboard/applications', icon: DocumentTextIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

const supportLinks: NavigationItem[] = [
  { name: 'Help Center', href: '/help', icon: QuestionMarkCircleIcon },
  { name: 'Documentation', href: '/docs', icon: BookOpenIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role

  // Determine which navigation to use based on user role
  const navigation = userRole === 'SPONSOR' ? sponsorNavigation : creatorNavigation

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`} style={{ backgroundColor: 'var(--background)', borderColor: 'var(--secondary)' }}>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 rounded-full p-1 border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          {collapsed ? 'B' : 'Blitz'}
        </Link>
      </div>

      {/* User role indicator */}
      {!collapsed && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {userRole === 'SPONSOR' ? 'Sponsor Account' : 'Creator Account'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <div key={item.name} className="relative">
            {item.disabled ? (
              <span
                className={classNames(
                  'cursor-not-allowed opacity-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  'bg-gray-100'
                )}
              >
                <item.icon
                  className={classNames(
                    'text-gray-400 mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="text-gray-400">{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    )}
                  </div>
                )}
              </span>
            ) : (
              <Link
                href={item.href || '/'}
                className={classNames(
                  'hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  item.disabled ? 'cursor-not-allowed opacity-50' : ''
                )}
              >
                <item.icon
                  className={classNames(
                    item.disabled ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className={item.disabled ? 'text-gray-400' : 'text-gray-900'}>{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    )}
                  </div>
                )}
              </Link>
            )}
            {item.tooltip && !collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {item.tooltip}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Support Links */}
      <div className="flex-shrink-0 border-t border-secondary p-4">
        <div className="space-y-1">
          {supportLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <item.icon
                className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {!collapsed && item.name}
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-4 group flex w-full items-center px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <ArrowRightOnRectangleIcon
            className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  )
}

