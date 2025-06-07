'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// FAQ categories
const categories = [
  { id: 'general', name: 'General Questions' },
  { id: 'creators', name: 'For Creators' },
  { id: 'sponsors', name: 'For Sponsors' },
  { id: 'payments', name: 'Payments & Billing' },
  { id: 'security', name: 'Security & Privacy' },
];

// FAQ items
const faqs = [
  {
    id: 1,
    question: 'What is Blitz?',
    answer: 'Blitz is a platform that connects local creators with sponsors for mutually beneficial partnerships. We use AI-powered matching to help creators find sponsorship opportunities and help sponsors find the right creators for their brand.',
    category: 'general',
  },
  {
    id: 2,
    question: 'How do I get started?',
    answer: 'Sign up for an account, complete your profile, and specify whether you\'re a creator or sponsor. Our AI will start matching you with relevant opportunities or creators based on your profile information.',
    category: 'general',
  },
  {
    id: 3,
    question: 'Is Blitz free to use?',
    answer: 'Blitz offers both free and premium tiers. Basic matching and messaging are free, while advanced features like priority matching, analytics, and promotional tools are available in our premium plans.',
    category: 'general',
  },
  {
    id: 4,
    question: 'How do I create a strong creator profile?',
    answer: 'Include detailed information about your content niche, audience demographics, engagement rates, and previous brand collaborations. Upload high-quality samples of your work and be specific about the types of partnerships you\'re interested in.',
    category: 'creators',
  },
  {
    id: 5,
    question: 'How do I apply for sponsorship opportunities?',
    answer: 'Browse available opportunities in your dashboard or check your AI-matched recommendations. Click on any listing to view details and use the "Apply" button to submit your application with a personalized message.',
    category: 'creators',
  },
  {
    id: 6,
    question: 'How do I get paid for sponsorships?',
    answer: 'Payments are processed through our secure payment system. Once a sponsor approves your deliverables, payment will be released according to the terms specified in your agreement. You can withdraw funds to your connected bank account or PayPal.',
    category: 'creators',
  },
  {
    id: 7,
    question: 'How do I create an effective sponsorship listing?',
    answer: 'Be clear about your requirements, budget, timeline, and deliverables. Specify your target audience and the type of creator you\'re looking for. Include information about your brand values and what makes this opportunity unique.',
    category: 'sponsors',
  },
  {
    id: 8,
    question: 'How does the creator matching work?',
    answer: 'Our AI analyzes creator profiles based on content quality, audience demographics, engagement rates, and previous work to match them with your brand values and target audience. You\'ll receive recommendations ranked by match percentage.',
    category: 'sponsors',
  },
  {
    id: 9,
    question: 'How do I review creator applications?',
    answer: 'All applications appear in your dashboard under "Applications." You can review each creator\'s profile, portfolio, and application message. Use the messaging system to ask questions before making your decision.',
    category: 'sponsors',
  },
  {
    id: 10,
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment system with industry-standard encryption.',
    category: 'payments',
  },
  {
    id: 11,
    question: 'What fees does Blitz charge?',
    answer: 'Blitz charges a 2% platform fee on all transactions, plus standard payment processing fees (typically 3%). These fees help us maintain the platform and continue improving our services.',
    category: 'payments',
  },
  {
    id: 12,
    question: 'When do creators get paid?',
    answer: 'Payment terms are set in each sponsorship agreement. Typically, sponsors release payment after approving the creator\'s deliverables. Funds are held in escrow until both parties confirm the work is complete.',
    category: 'payments',
  },
  {
    id: 13,
    question: 'How does Blitz protect my personal information?',
    answer: 'We use industry-standard security measures to protect your data. Your personal information is encrypted and never shared with third parties without your consent. See our Privacy Policy for more details.',
    category: 'security',
  },
  {
    id: 14,
    question: 'How are disputes handled?',
    answer: 'We have a dedicated support team to help resolve any disputes between creators and sponsors. If an issue arises, contact our support team through the Help Center, and we\'ll work with both parties to find a fair resolution.',
    category: 'security',
  },
  {
    id: 15,
    question: 'How does Blitz verify creators and sponsors?',
    answer: 'We use a combination of identity verification, platform connection verification, and manual review to ensure the authenticity of our users. Verified accounts receive a verification badge on their profile.',
    category: 'security',
  },
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter FAQs based on active category and search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === faq.category || activeCategory === 'all') &&
      (searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData({
      ...contactFormData,
      [name]: value,
    });
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend API
    console.log('Form submitted:', contactFormData);
    setFormSubmitted(true);
    // Reset form after submission
    setContactFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    // Reset form submission status after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Help Center</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/docs" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <BookOpenIcon className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Detailed guides and tutorials for using Blitz
              </p>
            </Link>
            <Link href="/dashboard/messages" className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <ChatBubbleLeftRightIcon className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Message Support</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Chat with our support team for personalized help
              </p>
            </Link>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <ArrowPathIcon className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                All systems operational
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-3">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or category selection to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help. Fill out the form and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 text-gray-600">
                    <p>support@blitz.example.com</p>
                    <p className="text-sm">Email response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 text-gray-600">
                    <p>(555) 123-4567</p>
                    <p className="text-sm">Mon-Fri, 9am-5pm PT</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {formSubmitted ? (
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-800">Message sent!</h3>
                      <p className="mt-2 text-green-700">
                        Thank you for reaching out. Our support team will get back to you shortly.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="account">Account Issues</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="technical">Technical Support</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactFormData.message}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

