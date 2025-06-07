'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  StarIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Listing {
  id: number;
  name: string;
  type: string;
  platform: string;
  audience: string;
  budget: number;
  requirements: string[];
  category: string;
  risk: 'Low' | 'Medium' | 'High';
  alignment: string;
  alignmentScore: 'high' | 'medium' | 'low';
  pros: string[];
  cons: string[];
  verified: boolean;
  roi: string;
  rating?: number;
  location?: string;
  date?: string;
  description?: string;
  organizer?: {
    name: string;
    logoUrl?: string;
    platform?: string;
  };
  keyActivities?: string[];
  benefits?: string[];
  audienceProfile?: string;
  frequency?: string;
  similarSponsorships?: {
    name: string;
    roi?: string;
  }[];
  keyMetrics: string;
}

interface SponsorshipDetailViewProps {
  listing: Listing;
  onClose: () => void;
  isCreatorView?: boolean;
}

export default function SponsorshipDetailView({ listing, onClose, isCreatorView = false }: SponsorshipDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [applicationText, setApplicationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationText.trim()) {
      setSubmitError('Please provide details about why you are a good fit for this opportunity.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this to your backend
      console.log('Application submitted:', {
        listingId: listing.id,
        message: applicationText
      });
      
      setSubmitSuccess(true);
      setApplicationText('');
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSponsor = async () => {
    // In a real app, this would open a message thread with the sponsor
    console.log('Contact sponsor for listing:', listing.id);
    // Redirect to messages page or open a modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {listing.name}
            {listing.verified && (
              <ShieldCheckIcon className="h-6 w-6 text-green-500 ml-2" title="Verified" />
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            {isCreatorView && (
              <button
                onClick={() => setActiveTab('apply')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'apply'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Apply
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 w-24">Organizer:</span>
                      <span className="text-sm text-gray-900">{listing.organizer?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 w-24">Type:</span>
                      <span className="text-sm text-gray-900">{listing.type}</span>
                    </div>
                    {listing.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500 w-24">Location:</span>
                        <span className="text-sm text-gray-900">{listing.location}</span>
                      </div>
                    )}
                    {listing.date && (
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500 w-24">Date:</span>
                        <span className="text-sm text-gray-900">{new Date(listing.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 w-24">Budget:</span>
                      <span className="text-sm text-gray-900">${listing.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 w-24">Audience:</span>
                      <span className="text-sm text-gray-900">{listing.audience}</span>
                    </div>
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-500 w-24">Key Metrics:</span>
                      <span className="text-sm text-gray-900">{listing.keyMetrics}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                  <p className="text-sm text-gray-600">{listing.description}</p>
                  
                  {listing.rating && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Rating</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(listing.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : i < (listing.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{listing.rating}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Brand Alignment</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.alignmentScore === 'high'
                        ? 'bg-green-100 text-green-800'
                        : listing.alignmentScore === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {listing.alignmentScore === 'high' ? 'High' : listing.alignmentScore === 'medium' ? 'Medium' : 'Low'}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{listing.alignment}</p>
                  </div>
                </div>
              </div>
              
              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pros</h3>
                  <ul className="space-y-1">
                    {listing.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cons</h3>
                  <ul className="space-y-1">
                    {listing.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Call to Action */}
              {isCreatorView ? (
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply for This Opportunity
                  </button>
                  <button
                    onClick={handleContactSponsor}
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Sponsor
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-sm text-gray-600">This is a recommended opportunity based on your profile and preferences.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Requirements */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {listing.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
              
              {/* Key Activities */}
              {listing.keyActivities && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Key Activities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {listing.keyActivities.map((activity, index) => (
                      <li key={index} className="text-sm text-gray-600">{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Benefits */}
              {listing.benefits && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {listing.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Audience Profile */}
              {listing.audienceProfile && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Audience Profile</h3>
                  <p className="text-sm text-gray-600">{listing.audienceProfile}</p>
                </div>
              )}
              
              {/* Similar Sponsorships */}
              {listing.similarSponsorships && listing.similarSponsorships.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Similar Sponsorships</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {listing.similarSponsorships.map((similar, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {similar.name} {similar.roi && `- ROI: ${similar.roi}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Risk Level:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    listing.risk === 'Low'
                      ? 'bg-green-100 text-green-800'
                      : listing.risk === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {listing.risk}
                  </span>
                </div>
              </div>
              
              {/* ROI Potential */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ROI Potential</h3>
                <p className="text-sm text-gray-600">{listing.roi}</p>
              </div>
            </div>
          )}

          {activeTab === 'apply' && isCreatorView && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Apply for "{listing.name}"</h3>
              
              {submitSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Your application has been submitted successfully! The sponsor will review your application and get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="application-text" className="block text-sm font-medium text-gray-700">
                        Why are you a good fit for this opportunity?
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="application-text"
                          name="application-text"
                          rows={6}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe why you're interested in this opportunity and what value you can provide to the sponsor. Include relevant experience, audience demographics, and any ideas you have for the collaboration."
                          value={applicationText}
                          onChange={(e) => setApplicationText(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {submitError && (
                      <div className="text-sm text-red-600">{submitError}</div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

