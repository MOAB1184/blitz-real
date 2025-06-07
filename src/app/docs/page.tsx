'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

// Documentation sections
const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpenIcon,
    color: 'bg-blue-100 text-blue-800',
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to Blitz',
        content: `
# Welcome to Blitz

Blitz is a platform that connects local creators with sponsors for mutually beneficial partnerships. Our AI-powered matching system helps creators find sponsorship opportunities that align with their content and values, while helping sponsors find the right creators for their brand.

## What You Can Do on Blitz

### For Creators:
- Create a professional profile to showcase your content and audience
- Browse sponsorship opportunities from local and national brands
- Receive AI-matched recommendations based on your profile
- Apply to sponsorship opportunities with just a few clicks
- Manage your applications and communications in one place
- Get paid securely through our payment system

### For Sponsors:
- Create detailed listings for your sponsorship opportunities
- Browse creator profiles to find the perfect match for your brand
- Receive AI-matched creator recommendations
- Review applications and communicate with potential partners
- Manage your active sponsorships and track performance
- Process payments securely through our platform

## Next Steps

1. [Complete your profile](/dashboard/profile) to improve your matching results
2. Explore the [dashboard](/dashboard) to familiarize yourself with the platform
3. Check out your [AI-matched recommendations](/dashboard/matched-creators)
4. Read through our documentation to learn more about specific features
        `,
      },
      {
        id: 'account-setup',
        title: 'Setting Up Your Account',
        content: `
# Setting Up Your Account

A complete and accurate profile is essential for getting the best matches on Blitz. Follow these steps to set up your account properly.

## Profile Completion Checklist

### Basic Information
- [ ] Profile photo (professional headshot or logo)
- [ ] Cover image (showcase your work or brand)
- [ ] Bio/description (clear, concise overview)
- [ ] Location information (city/region)
- [ ] Contact details (professional email)

### For Creators
- [ ] Content niche and categories
- [ ] Platform links (YouTube, Instagram, TikTok, etc.)
- [ ] Audience demographics
- [ ] Engagement metrics
- [ ] Previous brand collaborations
- [ ] Content samples
- [ ] Rate card or pricing information

### For Sponsors
- [ ] Company information
- [ ] Brand values and mission
- [ ] Target audience
- [ ] Types of creators you're looking for
- [ ] Budget ranges for partnerships
- [ ] Previous sponsorship examples

## Profile Tips

1. **Be specific**: The more detailed your profile, the better our AI can match you with relevant opportunities or creators.
2. **Be authentic**: Represent your true brand values and content style to ensure meaningful partnerships.
3. **Update regularly**: Keep your metrics, samples, and information current for the best results.
4. **Verify your account**: Complete the verification process to build trust with potential partners.

## Account Settings

Manage your account settings, including:
- Password and security
- Notification preferences
- Payment methods
- Privacy settings
- Connected accounts

[Go to Settings](/dashboard/settings)
        `,
      },
      {
        id: 'navigation',
        title: 'Navigating the Platform',
        content: `
# Navigating the Platform

Blitz is designed to be intuitive and easy to use. Here's a guide to help you navigate the platform effectively.

## Main Dashboard

The dashboard is your home base on Blitz. From here, you can:
- View key metrics and statistics
- See recent activity
- Access quick actions
- View recommended matches

## Sidebar Navigation

The sidebar contains links to all main sections of the platform:

### For Creators
- **Dashboard**: Overview of your account
- **Browse Opportunities**: Search and filter available sponsorships
- **My Applications**: Track your submitted applications
- **Sponsor Matches**: View AI-recommended sponsors
- **Messages**: Communicate with sponsors
- **Payments**: Manage your earnings and payment methods
- **Profile**: Update your creator profile
- **Settings**: Manage account settings

### For Sponsors
- **Dashboard**: Overview of your account
- **Browse Creators**: Search and filter available creators
- **My Listings**: Manage your sponsorship opportunities
- **Create New Listing**: Post a new sponsorship opportunity
- **Applications**: Review incoming applications
- **Matched Creators**: View AI-recommended creators
- **Messages**: Communicate with creators
- **Payments**: Manage your payments and billing
- **Profile**: Update your company profile
- **Settings**: Manage account settings

## Mobile Navigation

On mobile devices, the sidebar collapses to a menu icon. Tap it to expand the navigation options.

## Search Functionality

Use the search bar at the top of most pages to quickly find specific creators, sponsors, or opportunities.

## Help Resources

Access help resources through:
- The Help Center link in the sidebar
- The Documentation link in the sidebar
- The support chat icon in the bottom right corner
        `,
      },
    ],
  },
  {
    id: 'for-creators',
    title: 'For Creators',
    icon: UserIcon,
    color: 'bg-green-100 text-green-800',
    articles: [
      {
        id: 'creator-profile',
        title: 'Creating an Effective Profile',
        content: `
# Creating an Effective Creator Profile

Your profile is your digital storefront on Blitz. A well-crafted profile significantly increases your chances of getting matched with relevant sponsors and having your applications accepted.

## Profile Elements

### Essential Components
1. **Profile Photo**: A professional headshot or recognizable logo
2. **Cover Image**: Showcase your best content or brand aesthetic
3. **Bio**: Concise description of your content and value proposition
4. **Niche**: Clearly defined content categories and specialties
5. **Platforms**: Links to your social media accounts and content platforms
6. **Metrics**: Audience size, engagement rates, and demographic information
7. **Portfolio**: Samples of your best work and previous brand collaborations

## Optimization Tips

### Highlight Your Unique Value
- What makes your content unique?
- What specific audience do you reach?
- What results have you delivered for previous sponsors?

### Use Data Effectively
- Include specific metrics rather than general statements
- Update your engagement and audience data regularly
- Be honest about your numbers - verification is part of our process

### Showcase Your Best Work
- Include 3-5 examples of your highest quality content
- If you've done sponsored content before, highlight those examples
- Demonstrate range and versatility if applicable

### Set Clear Expectations
- Be upfront about your rates and pricing structure
- Specify what types of collaborations you're interested in
- Note any content categories you won't work with

## Profile Verification

Verified profiles receive priority in matching and appear more trustworthy to potential sponsors. To get verified:

1. Connect your social media accounts
2. Provide proof of identity
3. Submit examples of previous work
4. Complete our verification review process

[Edit Your Profile](/dashboard/profile)
        `,
      },
      {
        id: 'finding-opportunities',
        title: 'Finding Sponsorship Opportunities',
        content: `
# Finding Sponsorship Opportunities

Blitz offers multiple ways to discover sponsorship opportunities that match your content and audience.

## AI-Matched Recommendations

Our AI matching system analyzes your profile, content, and audience to recommend sponsorship opportunities that are likely to be a good fit.

- **Match Score**: Each recommendation includes a match percentage indicating compatibility
- **Factors Considered**: Content niche, audience demographics, engagement rates, brand values
- **Personalization**: Recommendations improve as you use the platform and complete more sponsorships

[View Your Matches](/dashboard/sponsor-matches)

## Browsing Available Opportunities

You can also manually browse and search for opportunities:

1. Navigate to [Browse Opportunities](/dashboard/browse)
2. Use filters to narrow down by:
   - Category/niche
   - Budget range
   - Opportunity type (one-time, ongoing, etc.)
   - Location (local or remote)
   - Required deliverables

## Search Functionality

Use the search bar to find specific:
- Brands or companies
- Types of opportunities
- Keywords related to your content

## Opportunity Details

Each listing includes:
- Sponsor information and verification status
- Budget range
- Required deliverables
- Timeline expectations
- Application requirements
- Match score with your profile

## Application Process

When you find an opportunity you're interested in:
1. Click "View Details" to see the full listing
2. Review all requirements carefully
3. Click "Apply" to submit your application
4. Customize your application message for each opportunity
5. Submit any additional requested information

## Application Tracking

Track all your submitted applications in the [My Applications](/dashboard/applications) section, where you can:
- See application status (pending, accepted, rejected)
- Follow up on pending applications
- Review feedback from sponsors
- Accept or decline offers
        `,
      },
      {
        id: 'creator-payments',
        title: 'Getting Paid for Sponsorships',
        content: `
# Getting Paid for Sponsorships

Blitz provides a secure payment system to ensure creators receive timely compensation for their work.

## Payment Process Overview

1. **Agreement**: Payment terms are established in the sponsorship agreement
2. **Milestone Setup**: For larger projects, payments may be split into milestones
3. **Deliverable Submission**: Submit your content deliverables through the platform
4. **Approval**: Sponsor reviews and approves the deliverables
5. **Payment Release**: Funds are released to your Blitz balance
6. **Withdrawal**: Transfer funds to your connected bank account or PayPal

## Setting Up Payment Methods

Before receiving payments, you need to set up your payment information:
1. Go to [Payments](/dashboard/payments)
2. Click "Add Payment Method"
3. Choose bank transfer or PayPal
4. Complete the required information
5. Verify your payment method

## Payment Terms

- **Standard Release**: Payments are typically released within 7 days of deliverable approval
- **Milestone Payments**: Released upon completion of each milestone
- **Escrow Protection**: Funds are held in escrow until deliverables are approved
- **Platform Fee**: Blitz charges a 2% platform fee on all transactions
- **Payment Processing Fee**: Standard 3% payment processing fee applies

## Invoicing

Blitz automatically generates invoices for all completed sponsorships. You can:
- Download invoices for your records
- Set up automatic invoicing for recurring partnerships
- Customize invoice details with your business information

## Tax Information

- You're responsible for reporting income earned through Blitz
- For US-based creators, you'll receive a 1099 form if you earn over $600 in a calendar year
- International creators should consult local tax regulations
- You can add your tax ID in the payment settings

## Payment Protection

Blitz offers protection for creators:
- Funds are verified before you begin work
- Dispute resolution process for payment issues
- Clear contract terms for each sponsorship
- Mediation services if needed

[Manage Your Payments](/dashboard/payments)
        `,
      },
    ],
  },
  {
    id: 'for-sponsors',
    title: 'For Sponsors',
    icon: BuildingOfficeIcon,
    color: 'bg-purple-100 text-purple-800',
    articles: [
      {
        id: 'creating-listings',
        title: 'Creating Effective Listings',
        content: `
# Creating Effective Sponsorship Listings

Well-crafted sponsorship listings attract the right creators and set clear expectations for successful partnerships.

## Listing Components

### Essential Elements
1. **Title**: Clear, specific title describing the opportunity
2. **Description**: Detailed overview of the sponsorship
3. **Requirements**: Specific deliverables and expectations
4. **Budget**: Clear compensation information
5. **Timeline**: Application deadline and project duration
6. **Brand Information**: Company details and values
7. **Target Audience**: Who you want to reach

## Creating a New Listing

1. Navigate to [Create New Listing](/dashboard/my-listings/create)
2. Fill out all required fields
3. Add any supplementary materials (brand guidelines, examples)
4. Set visibility options (public or private)
5. Publish your listing

## Optimization Tips

### Be Specific About Deliverables
- Exactly what content do you want? (number of posts, videos, etc.)
- What platforms should the content appear on?
- Any specific messaging requirements?
- Usage rights and exclusivity terms

### Set Clear Expectations
- Timeline for deliverables
- Approval process
- Payment terms
- Reporting requirements

### Highlight Value for Creators
- Why should creators want to work with your brand?
- Any perks beyond monetary compensation?
- Potential for ongoing partnership?
- Exposure or cross-promotion opportunities?

### Target the Right Creators
- Specify audience demographics you want to reach
- Note any content style preferences
- Mention ideal follower count or engagement rates
- List any industry-specific requirements

## Managing Active Listings

From the [My Listings](/dashboard/my-listings) section, you can:
- Edit existing listings
- Pause or unpause listings
- Duplicate successful listings
- Archive completed opportunities
- View application statistics

## Listing Visibility

- **Public Listings**: Visible to all creators and included in search results
- **Private Listings**: Only visible to creators you specifically invite
- **Featured Listings**: Premium placement in search results (additional fee)

[Create a New Listing](/dashboard/my-listings/create)
        `,
      },
      {
        id: 'finding-creators',
        title: 'Finding the Right Creators',
        content: `
# Finding the Right Creators

Blitz offers multiple ways to discover creators who align with your brand values and can reach your target audience.

## AI-Matched Recommendations

Our AI matching system analyzes creator profiles, content quality, audience demographics, and engagement metrics to recommend creators who are likely to be a good fit for your brand.

- **Match Score**: Each recommendation includes a match percentage indicating compatibility
- **Factors Considered**: Content quality, audience alignment, engagement rates, previous work
- **Personalization**: Recommendations improve as you use the platform and complete more sponsorships

[View Your Matches](/dashboard/matched-creators)

## Browsing Creator Profiles

You can also manually browse and search for creators:

1. Navigate to [Browse Creators](/dashboard/browse)
2. Use filters to narrow down by:
   - Content category/niche
   - Audience size
   - Audience demographics
   - Location
   - Platform specialization

## Search Functionality

Use the search bar to find specific:
- Creator names or handles
- Content niches
- Keywords related to your brand

## Creator Profile Details

Each creator profile includes:
- Content samples and portfolio
- Audience demographics and size
- Engagement metrics
- Previous brand collaborations
- Verification status
- Rate information
- Match score with your brand

## Inviting Creators

When you find a creator you're interested in working with:
1. Click "View Profile" to see their full information
2. Review their work and metrics carefully
3. Click "Contact Creator" to start a conversation
4. Alternatively, click "Invite to Listing" to invite them to apply to a specific opportunity

## Saved Creators

You can save creators to lists for future reference:
- Create custom lists (e.g., "Tech Reviewers," "Local Influencers")
- Add notes to saved profiles
- Receive notifications when saved creators update their profiles

[Browse Creators](/dashboard/browse)
        `,
      },
      {
        id: 'managing-applications',
        title: 'Managing Applications',
        content: `
# Managing Creator Applications

Efficiently reviewing and responding to applications is key to finding the right creators for your sponsorships.

## Application Review Process

1. Navigate to [Applications](/dashboard/applications)
2. View all applications organized by listing
3. Filter applications by status (new, under review, accepted, rejected)
4. Review each application's details:
   - Creator profile and metrics
   - Application message
   - Match score
   - Proposed deliverables and timeline

## Evaluating Applications

When reviewing applications, consider:
- **Content Quality**: Review the creator's portfolio and previous work
- **Audience Alignment**: Check if their audience matches your target demographic
- **Engagement Metrics**: Look at engagement rates, not just follower count
- **Communication Style**: Assess professionalism and clarity in their application
- **Value Proposition**: Evaluate if their proposed approach aligns with your goals

## Application Actions

For each application, you can:
- **Accept**: Approve the application and move forward with the partnership
- **Reject**: Decline the application with optional feedback
- **Request More Info**: Ask for additional details before making a decision
- **Negotiate**: Propose different terms or deliverables
- **Save for Later**: Flag applications for further consideration

## After Acceptance

Once you accept an application:
1. The creator is notified and must confirm acceptance
2. A contract is generated based on the listing terms
3. Both parties review and sign the digital contract
4. Project milestones and payment terms are established
5. Communication moves to the messaging system for project management

## Bulk Actions

For listings with many applications:
- Sort by match score or other metrics
- Use batch actions to process multiple applications
- Save application templates for common responses

## Application Insights

The Applications dashboard provides analytics on:
- Application volume over time
- Acceptance and rejection rates
- Creator demographics
- Common application sources

[Review Applications](/dashboard/applications)
        `,
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    icon: CreditCardIcon,
    color: 'bg-yellow-100 text-yellow-800',
    articles: [
      {
        id: 'payment-system',
        title: 'Understanding the Payment System',
        content: `
# Understanding the Blitz Payment System

Blitz provides a secure, transparent payment system for all transactions between creators and sponsors.

## Payment Flow Overview

1. **Agreement**: Payment terms are established in the sponsorship contract
2. **Funding**: Sponsor funds the project (held in escrow)
3. **Deliverables**: Creator submits content deliverables
4. **Approval**: Sponsor reviews and approves the deliverables
5. **Release**: Funds are released to the creator's Blitz balance
6. **Withdrawal**: Creator transfers funds to their bank account or PayPal

## Payment Methods

### For Sponsors (Sending Payments)
- Credit/debit cards
- Bank transfers (ACH/wire)
- PayPal

### For Creators (Receiving Payments)
- Bank deposit (direct deposit)
- PayPal
- Check (US only, additional fee applies)

## Fee Structure

Blitz charges the following fees:
- **Platform Fee**: 2% on all transactions
- **Payment Processing Fee**: 3% standard payment processing fee
- **Currency Conversion**: Variable rate if applicable

## Milestone Payments

For larger projects, payments can be structured as milestones:
1. Define specific deliverables for each milestone
2. Set payment amount for each milestone
3. Release funds as each milestone is completed and approved

## Invoicing and Receipts

- Automatic invoice generation for all transactions
- Downloadable receipts for accounting purposes
- Monthly statements available for both creators and sponsors
- Integration with common accounting software

## Tax Information

- 1099 forms provided for US-based creators earning over $600/year
- W-8BEN forms required for international creators
- Tax ID collection for proper reporting
- Consult with a tax professional for specific advice

## Payment Protection

Blitz offers protection for both parties:
- **For Creators**: Verified funds in escrow before work begins
- **For Sponsors**: Funds only released when deliverables are approved
- **Dispute Resolution**: Mediation process for payment disagreements
- **Refund Policy**: Clear terms for when refunds are applicable

## Payment Timeline

- Standard payment processing within 7 business days
- Expedited payments available for premium accounts
- Regular payment schedule options for ongoing partnerships

[Manage Payments](/dashboard/payments)
        `,
      },
      {
        id: 'sponsor-billing',
        title: 'Sponsor Billing Guide',
        content: `
# Sponsor Billing Guide

This guide covers everything sponsors need to know about billing, payments, and financial management on Blitz.

## Setting Up Billing

Before creating sponsorship listings, set up your billing information:
1. Navigate to [Payments](/dashboard/payments)
2. Click "Add Payment Method"
3. Enter your credit card or bank account information
4. Add your company's billing address and tax information

## Payment Methods

Blitz accepts the following payment methods:
- Major credit and debit cards (Visa, Mastercard, American Express, Discover)
- Bank transfers (ACH for US accounts, SEPA for EU, wire transfers)
- PayPal business accounts

## Funding Sponsorships

When a creator accepts your sponsorship offer:
1. You'll receive a notification to fund the project
2. Review the contract terms and deliverables
3. Approve the payment amount
4. Funds are held in escrow until deliverables are approved

## Payment Release Process

1. Creator submits deliverables through the platform
2. You review the submitted content
3. Approve the deliverables or request revisions
4. Upon approval, payment is automatically released
5. For milestone-based projects, repeat for each milestone

## Managing Your Budget

Blitz provides tools to help manage your sponsorship budget:
- Set monthly or quarterly spending limits
- Track expenditures by campaign or category
- Generate spending reports
- Forecast future sponsorship costs

## Subscription Options

Blitz offers several subscription tiers for sponsors:
- **Basic**: Free tier with standard features
- **Business**: Enhanced features, reduced fees, priority support
- **Enterprise**: Custom solutions for large brands, dedicated account manager

[View Subscription Options](/dashboard/settings/subscription)

## Invoicing and Reporting

- Download invoices for all transactions
- Generate custom financial reports
- Export data for accounting purposes
- Schedule automatic reports

## Tax Information

- Tax receipts provided for all transactions
- Business expense categorization
- International tax considerations
- Consult with your accountant for specific advice

[Manage Billing](/dashboard/payments)
        `,
      },
      {
        id: 'creator-payments',
        title: 'Creator Payment Guide',
        content: `
# Creator Payment Guide

This guide covers everything creators need to know about receiving payments, managing earnings, and financial planning on Blitz.

## Setting Up Payment Methods

Before accepting sponsorship offers, set up your payment information:
1. Navigate to [Payments](/dashboard/payments)
2. Click "Add Payment Method"
3. Choose your preferred payment method (bank account or PayPal)
4. Complete the verification process

## Receiving Payments

When a sponsor approves your deliverables:
1. Payment is released to your Blitz balance
2. You'll receive a notification of payment
3. Funds are available in your balance immediately
4. Withdraw to your bank account or PayPal

## Withdrawal Options

- **Bank Transfer**: 1-3 business days processing time (no fee)
- **PayPal**: Same-day processing (subject to PayPal fees)
- **Automatic Withdrawals**: Set up recurring transfers when your balance reaches a certain threshold

## Payment Schedule

- Standard payments processed within 7 business days of approval
- Milestone payments released upon completion of each milestone
- Recurring partnerships can be set up with regular payment schedules

## Managing Your Earnings

Blitz provides tools to help manage your sponsorship income:
- Track pending and completed payments
- View earnings by sponsor or time period
- Generate income reports
- Set earnings goals

## Fee Structure

Be aware of the following fees:
- **Platform Fee**: 2% on all transactions
- **Payment Processing Fee**: 3% standard payment processing fee
- **Currency Conversion**: Variable rate if applicable
- **Expedited Withdrawal**: Additional fee for same-day processing

## Tax Considerations

- You're responsible for reporting income earned through Blitz
- For US-based creators, you'll receive a 1099 form if you earn over $600 in a calendar year
- International creators should consult local tax regulations
- Consider setting aside a portion of earnings for taxes
- Track business expenses related to creating sponsored content

## Income Verification

If you need income verification for loans or other purposes:
1. Go to [Payments](/dashboard/payments)
2. Click "Income Verification"
3. Select the time period
4. Generate an official income report

[Manage Payments](/dashboard/payments)
        `,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: ShieldCheckIcon,
    color: 'bg-red-100 text-red-800',
    articles: [
      {
        id: 'account-security',
        title: 'Account Security Best Practices',
        content: `
# Account Security Best Practices

Protecting your Blitz account is essential for maintaining your professional reputation and securing your earnings.

## Strong Authentication

### Password Security
- Use a unique, strong password (12+ characters with a mix of letters, numbers, and symbols)
- Never reuse passwords from other sites
- Change your password regularly (at least every 6 months)
- Never share your password with anyone, including Blitz support (we'll never ask for it)

### Two-Factor Authentication (2FA)
- Enable 2FA in your [Security Settings](/dashboard/settings/security)
- Options include:
  - SMS verification
  - Authenticator app (recommended)
  - Email verification
  - Security key (YubiKey, etc.)

## Account Monitoring

- Review your account activity regularly
- Check for unfamiliar logins or devices
- Enable login notifications
- Review connected applications and revoke access for unused services

## Phishing Protection

- Verify emails claiming to be from Blitz (we'll never ask for your password)
- Check the sender's email address carefully
- Don't click on suspicious links
- Access Blitz directly through your browser, not email links
- Report suspicious emails to support@blitz.example.com

## Device Security

- Log out when using shared or public computers
- Keep your devices updated with the latest security patches
- Use antivirus/anti-malware software
- Enable device encryption when possible

## Payment Security

- Verify payment details before confirming transactions
- Monitor your payment activity regularly
- Use secure, verified payment methods
- Never share payment details via email or messaging

## Recovery Options

- Keep your recovery email and phone number updated
- Set up emergency contacts for account recovery
- Store recovery codes in a secure location

## Reporting Security Issues

If you suspect your account has been compromised:
1. Change your password immediately
2. Enable 2FA if not already active
3. Contact support through the [Help Center](/help)
4. Review recent account activity
5. Check and secure any connected accounts

[Update Security Settings](/dashboard/settings/security)
        `,
      },
      {
        id: 'privacy-controls',
        title: 'Privacy Controls & Data Management',
        content: `
# Privacy Controls & Data Management

Blitz gives you control over your personal information and how it's used on the platform.

## Privacy Settings

Access your privacy settings at [Privacy Settings](/dashboard/settings/privacy) to control:

### Profile Visibility
- **Public Profile**: Visible to all Blitz users
- **Limited Profile**: Only visible to verified sponsors/creators
- **Private Profile**: Only visible to users you've connected with
- **Custom Visibility**: Control which profile elements are public

### Contact Preferences
- Who can send you messages
- Who can see your contact information
- Email and notification preferences

### Content Sharing
- Portfolio visibility settings
- Case study participation
- Testimonial usage

## Data Collection & Usage

Blitz collects the following types of data:
- Profile information you provide
- Platform usage and activity
- Content metrics and performance
- Payment and transaction information

This data is used to:
- Match you with relevant opportunities or creators
- Improve platform functionality
- Ensure secure transactions
- Comply with legal requirements

## Your Data Rights

You have the right to:
- **Access**: Download a copy of your data
- **Correct**: Update inaccurate information
- **Delete**: Request deletion of your data
- **Restrict**: Limit how your data is used
- **Object**: Opt out of certain data processing
- **Portability**: Transfer your data to another service

## Data Retention

- Active account data is retained while your account is active
- Deleted account data is removed within 30 days
- Transaction records are kept for legal compliance (typically 7 years)
- Backup data is retained for disaster recovery purposes

## Third-Party Sharing

Blitz shares limited data with:
- Payment processors (for transaction processing)
- Analytics providers (in anonymized form)
- Legal authorities (when legally required)

We never sell your personal data to third parties.

## Cookie Policy

Blitz uses cookies for:
- Essential functionality
- Authentication
- Preferences
- Analytics

You can manage cookie preferences in your browser settings.

## Children's Privacy

Blitz is not intended for users under 18 years of age. We do not knowingly collect information from children.

[Manage Privacy Settings](/dashboard/settings/privacy)
        `,
      },
      {
        id: 'content-rights',
        title: 'Content Rights & Ownership',
        content: `
# Content Rights & Ownership

Understanding content rights is crucial for both creators and sponsors when forming partnerships on Blitz.

## Creator Content Ownership

As a creator, you retain ownership of your original content unless explicitly transferred through a contract. However, when you accept a sponsorship, you typically grant certain usage rights to the sponsor.

### Standard Rights Granted to Sponsors
- Right to repost/share the sponsored content
- Right to use content in their own marketing
- Right to feature the content on their website
- Right to use your name and likeness in relation to the content

### Rights Typically Retained by Creators
- Copyright ownership of the original content
- Right to keep content on your platforms
- Right to include content in your portfolio
- Right to modify or remove content after agreed period

## Sponsorship Agreements

All sponsorships on Blitz include a content rights section that specifies:
- **Usage Rights**: How the sponsor can use the content
- **Exclusivity**: Whether you can work with competitors
- **Duration**: How long the rights are granted for
- **Attribution**: Requirements for crediting the creator
- **Modifications**: Whether the sponsor can edit the content
- **Territories**: Geographic limitations on usage

## Platform Content

Content you upload to Blitz (profile information, portfolio examples, etc.) remains your property, but you grant Blitz limited rights to display and promote this content on the platform.

## Intellectual Property Protection

- **Watermarking**: Consider watermarking preview content
- **Contracts**: Always have clear written agreements before creating content
- **Portfolio Usage**: Specify how sponsors can feature you in their portfolio
- **Dispute Resolution**: Blitz offers mediation for content rights disputes

## Content Removal

You can request content removal from Blitz in these circumstances:
- Contract violation by a sponsor
- Unauthorized usage beyond agreed terms
- Misrepresentation of your work
- Privacy concerns

## Best Practices

### For Creators
- Read contracts carefully before accepting
- Negotiate terms that protect your creative rights
- Keep records of all agreements
- Specify usage limitations clearly

### For Sponsors
- Respect creator ownership
- Be specific about your usage needs
- Consider fair compensation for extended rights
- Obtain written permission for usage beyond initial agreement

[Learn More About Content Rights](/docs/legal/content-rights)
        `,
      },
    ],
  },
];

interface Article {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  color: string;
  articles: Article[];
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [activeArticle, setActiveArticle] = useState<string>(sections[0].articles[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    sectionId: string;
    articleId: string;
    sectionTitle: string;
    articleTitle: string;
    snippet: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentSection = sections.find(s => s.id === activeSection);
  const currentArticle = currentSection?.articles.find(a => a.id === activeArticle);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // In a real app, this would be an API call
    // Simulating search results by looking through all article content
    const results = sections.flatMap((section) =>
      section.articles
        .filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((article) => ({
          sectionId: section.id,
          sectionTitle: section.title,
          articleId: article.id,
          articleTitle: article.title,
          // Extract a snippet of content around the search term
          snippet: article.content
            .split('\n')
            .find((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
            ?.replace(
              new RegExp(`(${searchQuery})`, 'gi'),
              '<mark>$1</mark>'
            ) || 'No preview available...',
        }))
    );

    setSearchResults(results);
    setIsSearching(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Navigate to search result
  const navigateToResult = (sectionId: string, articleId: string) => {
    setActiveSection(sectionId);
    setActiveArticle(articleId);
    clearSearch();
  };

  // Format markdown content (in a real app, use a markdown parser)
  const formatContent = (content: string) => {
    // Very basic markdown formatting for headings and lists
    return content
      .split('\n')
      .map((line) => {
        if (line.startsWith('# ')) {
          return `<h1 class="text-2xl font-bold mb-4 mt-6">${line.substring(2)}</h1>`;
        } else if (line.startsWith('## ')) {
          return `<h2 class="text-xl font-semibold mb-3 mt-5">${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
          return `<h3 class="text-lg font-medium mb-2 mt-4">${line.substring(4)}</h3>`;
        } else if (line.startsWith('- ')) {
          return `<li class="ml-4 mb-1">${line.substring(2)}</li>`;
        } else if (line.match(/^\d+\. /)) {
          return `<li class="ml-4 mb-1">${line.substring(line.indexOf('. ') + 2)}</li>`;
        } else if (line.startsWith('- [ ] ')) {
          return `<div class="flex items-start mb-1"><input type="checkbox" class="mt-1 mr-2" disabled /><span>${line.substring(6)}</span></div>`;
        } else if (line.startsWith('- [x] ')) {
          return `<div class="flex items-start mb-1"><input type="checkbox" class="mt-1 mr-2" checked disabled /><span>${line.substring(6)}</span></div>`;
        } else if (line === '') {
          return '<p class="mb-4"></p>';
        } else if (line.startsWith('[') && line.includes('](/')) {
          // Very basic link handling
          const linkText = line.substring(1, line.indexOf(']'));
          const linkUrl = line.substring(line.indexOf('](') + 2, line.indexOf(')'));
          return `<a href="${linkUrl}" class="text-blue-600 hover:underline">${linkText}</a>`;
        } else {
          return `<p class="mb-4">${line}</p>`;
        }
      })
      .join('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background-light)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Documentation</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 text-gray-700 hover:text-gray-900"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-10">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <button
                      onClick={() => navigateToResult(result.sectionId, result.articleId)}
                      className="text-left w-full"
                    >
                      <h3 className="font-medium text-blue-600 hover:underline">
                        {result.articleTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {result.sectionTitle}
                      </p>
                      <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      ></p>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 mb-8 lg:mb-0 lg:mr-8">
            <nav className="sticky top-8">
              <div className="space-y-1">
                {sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <button
                      onClick={() => {
                        setActiveSection(section.id);
                        setActiveArticle(section.articles[0].id);
                      }}
                      className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === section.id
                          ? `${section.color}`
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <section.icon className="mr-3 h-5 w-5" />
                      {section.title}
                    </button>
                    {activeSection === section.id && (
                      <div className="mt-1 ml-8 space-y-1">
                        {section.articles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => setActiveArticle(article.id)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                              activeArticle === article.id
                                ? 'font-medium text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {article.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Need more help?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Can't find what you're looking for in our documentation?
                </p>
                <Link
                  href="/help"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                  Contact Support
                </Link>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            {currentArticle ? (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">{currentArticle.title}</h1>
                  <div className="flex space-x-2">
                    {currentSection && currentSection.articles.findIndex((a) => a.id === activeArticle) > 0 && (
                      <button
                        onClick={() => {
                          const currentIndex = currentSection.articles.findIndex(
                            (a) => a.id === activeArticle
                          );
                          if (currentIndex > 0) {
                            setActiveArticle(currentSection.articles[currentIndex - 1].id);
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                    )}
                    {currentSection && currentSection.articles.findIndex((a) => a.id === activeArticle) < currentSection.articles.length - 1 && (
                      <button
                        onClick={() => {
                          const currentIndex = currentSection.articles.findIndex(
                            (a) => a.id === activeArticle
                          );
                          if (currentIndex < currentSection.articles.length - 1) {
                            setActiveArticle(currentSection.articles[currentIndex + 1].id);
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Next
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatContent(currentArticle.content) }}
                ></div>
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Was this helpful?</h3>
                      <div className="mt-1 flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                          Yes
                        </button>
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                          No
                        </button>
                      </div>
                    </div>
                    <Link
                      href="/help"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                      Still need help?
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p>Select an article from the sidebar to view documentation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

