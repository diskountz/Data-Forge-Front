import { useState } from 'react';
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-daring-indigo">Contact Enrichment</h2>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            placeholder="John"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            placeholder="Doe"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="companyDomain" className="block text-sm font-medium text-gray-700">Company Domain</label>
          <input
            type="text"
            id="companyDomain"
            name="companyDomain"
            value={formData.companyDomain}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            placeholder="acmeinc.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL (Required for Phone Enrichment)</label>
          <input
            type="text"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            placeholder="https://www.linkedin.com/in/username"
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-daring-indigo">Enrichment Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="findEmail"
                checked={formData.findEmail}
                onChange={handleChange}
                className="rounded text-emerald-pool focus:ring-emerald-pool"
              />
              <span className="ml-2">Find Individual Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="getCompanyEmails"
                checked={formData.getCompanyEmails}
                onChange={handleChange}
                className="rounded text-emerald-pool focus:ring-emerald-pool"
              />
              <span className="ml-2">Get Company Emails</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enrichLinkedIn"
                checked={formData.enrichLinkedIn}
                onChange={handleChange}
                className="rounded text-emerald-pool focus:ring-emerald-pool"
              />
              <span className="ml-2">Enrich LinkedIn</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="findPhone"
                checked={formData.findPhone}
                onChange={handleChange}
                className="rounded text-emerald-pool focus:ring-emerald-pool"
              />
              <span className="ml-2">Find Phone Number</span>
            </label>
          </div>
        </div>
        <button
                  type="submit"
                  className={`w-full bg-emerald-pool text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enriching Data...' : 'Enrich Data'}
                </button>
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