'use client'

import Link from 'next/link'
import { CheckIcon, XMarkIcon, UserGroupIcon, CalendarDaysIcon, MapPinIcon, SparklesIcon, MagnifyingGlassIcon, DocumentTextIcon, CreditCardIcon, ChartBarIcon, DocumentMinusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const stats = [
  { label: 'Businesses Served', value: '5,000+' },
  { label: 'Sponsorships Facilitated', value: '10k+' },
  { label: 'Local Communities Impacted', value: 'Springfield & Beyond' },
]

const includedFeatures = [
  'AI-Powered Matching',
  'Detailed Creator Profiles',
  'Streamlined Application Process',
  'Built-in Messaging',
  'Sponsorship Agreement Templates',
  'Performance Analytics Dashboard',
  'Tax Reporting Assistance',
  'Dedicated Support',
]

const features = [
  {
    name: 'AI Matching',
    description: 'Placeholder description.',
    icon: SparklesIcon,
  },
  {
    name: 'Creator Discovery',
    description: 'Browse detailed profiles of local influencers, sports teams, events, and non-profit organizations.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Application Management',
    description: 'Receive and manage sponsorship applications seamlessly through the platform.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Secure Payments',
    description: 'Handle sponsorship payments securely and efficiently within Blitz (Coming Soon).',
    icon: CreditCardIcon,
  },
  {
    name: 'Analytics & Reporting',
    description: 'Track the performance and ROI of your sponsorships with comprehensive analytics.',
    icon: ChartBarIcon,
  },
  {
    name: 'Tax Automation',
    description: 'Simplify tax season with automated tracking and reporting of eligible sponsorship write-offs.',
    icon: DocumentMinusIcon,
  },
]

const testimonials = [
  {
    author: 'Michael Thompson',
    role: 'Owner, Michael\'s Family Restaurant',
    content:
      'Blitz made it incredibly easy to find and sponsor our local soccer team. We saw a real boost in community engagement!',
  },
  {
    author: 'Maria Lopez',
    role: 'Local Food Blogger',
    content:
      'Finding relevant brand sponsorships used to be a headache. With Blitz, I connect with businesses that truly fit my niche.',
  },
  {
    author: 'Springfield Little League',
    role: 'Youth Sports Organization',
    content:
      'Managing sponsorships for multiple teams was overwhelming. Blitz streamlined everything and helped us secure more funding.',
  },
]

const faqs = [
  {
    question: 'What is Blitz?',
    answer:
      'Blitz is a platform connecting local businesses and brands with local events, creators, sports teams, and non-profit organizations for impactful sponsorship opportunities.',
  },
  {
    question: 'How does AI Matching work?',
    answer:
      'Our AI analyzes your brand, target audience, and goals to suggest the most relevant and high-impact local sponsorship opportunities for you.',
  },
  {
    question: 'Is Blitz only for large businesses?',
    answer:
      'No! Blitz is designed for businesses of all sizes, with a particular focus on empowering small and medium-sized local businesses.',
  },
  {
    question: 'What types of creators can I sponsor?',
    answer:
      'You can sponsor a variety of local entities, including social media influencers, podcasters, event organizers, sports teams, non-profit organizations, and more.',
  },
  {
    question: 'How does Blitz help with taxes?',
    answer:
      'Blitz tracks your eligible sponsorship expenses and provides automated reports to simplify tax write-offs.',
  },
  {
    question: 'How much does Blitz cost?',
    answer:
      'Blitz offers different pricing tiers, including a free plan to get started. Visit our pricing page for more details.',
  },
]

const featuredEvents = [
  {
    name: 'Downtown Art Walk',
    date: 'July 20, 2025',
    location: 'Main Street, Springfield',
    description: 'A celebration of local artists and musicians. Open to all ages.',
  },
  {
    name: 'Springfield Food Fest',
    date: 'August 5, 2025',
    location: 'Central Park, Springfield',
    description: 'A showcase of local restaurants and food trucks. Family friendly!',
  },
]

const featuredCreators = [
  {
    name: 'Maria Lopez',
    niche: 'Local Food Blogger',
    location: 'Springfield',
    audience: '5,000+ local followers',
    partnerships: 'Partnered with 10+ local cafes',
  },
  {
    name: 'The Community Podcast',
    niche: 'Neighborhood News & Stories',
    location: 'Springfield',
    audience: '2,000+ listeners',
    partnerships: 'Sponsored by local businesses',
  },
]

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="shadow-sm" style={{ backgroundColor: 'var(--background-light)' }}>
        <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center sm:items-stretch justify-start">
              <Link href="/" className="flex flex-shrink-0 items-center">
                <span className="text-2xl font-bold text-primary">Blitz</span>
              </Link>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {session ? (
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="ml-4 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate py-16" style={{ backgroundColor: 'var(--background)' }}>
        {/* Background gradient - Removed old gradient div */}
        
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect with local events and creators
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Empowering small businesses to discover and collaborate with local events and creators for impactful sponsorships.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" style={{ backgroundColor: 'var(--primary)' }}
              >
                Get started
              </Link>
              <Link href="#local-focus" className="text-base font-semibold leading-7 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="py-12" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Feature comparison section */}
      <div className="py-24 sm:py-32" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Smarter Way to Handle Sponsorships
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See how Blitz transforms the sponsorship process compared to traditional methods
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto" style={{ backgroundColor: 'var(--background-light)' }}>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-primary">
                  What's included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="py-24 sm:py-32" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Powerful Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines AI technology with powerful tools to make sponsorship deals easier,
              faster, and more successful for both creators and sponsors.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 sm:py-32" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by creators and brands alike
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.author} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="gap-4">
                    <p className="text-lg font-semibold leading-6 text-gray-900">{testimonial.author}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{testimonial.role}</p>
                    <p className="mt-4 text-base leading-6 text-gray-600">{testimonial.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 sm:py-32" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">FAQ</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Common questions
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                  <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
                    {faq.question}
                  </dt>
                  <dd className="mt-4 lg:col-span-7 lg:mt-0">
                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
        {/* Background gradient - Removed old gradient div */}
        
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to transform your sponsorship game?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join thousands of creators and brands who are already using Blitz to streamline their sponsorship process.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started for free
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Local Events */}
      <div id="local-focus" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Local Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.name} className="rounded-xl p-6 shadow ring-1 ring-gray-200 flex flex-col gap-2" style={{ backgroundColor: 'var(--background-light)' }}>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <MapPinIcon className="h-5 w-5" /> {event.location}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
                <div className="text-sm text-gray-500">{event.date}</div>
                <p className="text-gray-700 mt-2">{event.description}</p>
                <Link href="/signup" className="mt-4 inline-block rounded px-4 py-2 text-gray-900 font-semibold hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>Sponsor this Event</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Local Creators */}
      <div className="py-12" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Local Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCreators.map((creator) => (
              <div key={creator.name} className="rounded-xl p-6 shadow ring-1 ring-gray-200 flex flex-col gap-2" style={{ backgroundColor: 'var(--background)' }}>
                <div className="flex items-center gap-2 text-primary font-semibold">
                   <UserGroupIcon className="h-5 w-5" /> {creator.location} {/* Using UserGroupIcon as a placeholder */} 
                </div>
                 <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                 <div className="text-sm text-gray-500">{creator.niche}</div>
                 <div className="text-sm text-gray-500">Audience: {creator.audience}</div>
                 <div className="text-sm text-gray-500">{creator.partnerships}</div>
                <Link href="/signup" className="mt-4 inline-block rounded px-4 py-2 text-gray-900 font-semibold hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>Sponsor this Creator</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* You can add a footer component here if you have one */}

    </div>
  )
} 