import { useState } from 'react';
import { ArrowRight } from 'lucide-react';  // Add this import
import EnrichmentResultPopup from './EnrichmentResultPopup';

export default function ContactEnrichmentForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyDomain: '',
    linkedinUrl: '',
    findEmail: false,
    getCompanyEmails: false,
    enrichLinkedIn: false,
    findPhone: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowPopup(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <h2 className="text-[20px] font-semibold tracking-tight text-notion-default mb-4">Try Data Enrichment</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[14px] font-medium text-notion-default mb-1.5">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-[14px] placeholder-notion-gray/50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-[14px] font-medium text-notion-default mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-[14px] placeholder-notion-gray/50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="companyDomain" className="block text-[14px] font-medium text-notion-default mb-1.5">
              Company Domain
            </label>
            <input
              type="text"
              id="companyDomain"
              name="companyDomain"
              value={formData.companyDomain}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-[14px] placeholder-notion-gray/50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
              placeholder="acmeinc.com"
            />
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-[14px] font-medium text-notion-default mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="text"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-notion-hover border border-notion-border rounded-lg text-[14px] placeholder-notion-gray/50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[14px] font-medium text-notion-default">Enrichment Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="findEmail"
                checked={formData.findEmail}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue rounded border-notion-border focus:ring-primary-blue/20"
              />
              <span className="ml-2 text-[14px] text-notion-default">Find Individual Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="getCompanyEmails"
                checked={formData.getCompanyEmails}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue rounded border-notion-border focus:ring-primary-blue/20"
              />
              <span className="ml-2 text-[14px] text-notion-default">Get Company Emails</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enrichLinkedIn"
                checked={formData.enrichLinkedIn}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue rounded border-notion-border focus:ring-primary-blue/20"
              />
              <span className="ml-2 text-[14px] text-notion-default">Enrich LinkedIn</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="findPhone"
                checked={formData.findPhone}
                onChange={handleChange}
                className="w-4 h-4 text-primary-blue rounded border-notion-border focus:ring-primary-blue/20"
              />
              <span className="ml-2 text-[14px] text-notion-default">Find Phone Number</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-napoleon hover:bg-napoleon/90 text-white rounded-lg font-medium text-[14px] flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Enriching Data...</span>
            </>
          ) : (
            <>
              <span>Enrich Data</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[12px] text-notion-gray text-center mt-4">
          Try our data enrichment tool with sample data
        </p>
      </form>

      {showPopup && (
        <EnrichmentResultPopup
          onClose={() => setShowPopup(false)}
          formData={formData}
        />
      )}
    </>
  );
}