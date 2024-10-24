// components/EnrichmentResultPopup.js

import { useState } from 'react';

export default function EnrichmentResultPopup({ onClose, formData }) {
  const handleCreateAccount = () => {
    window.open('https://app.dataforge.so', '_blank');
  };

  const blurredEmail = 'user@example.com';
  const blurredPhone = '+1 (555) 123-4567';
  const blurredLinkedIn = 'LinkedIn profile enriched with 20+ data points';
  const blurredCompanyEmails = '5 company email formats found';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-daring-indigo">Enrichment Results</h2>
        <div className="mb-4">
          <p className="font-semibold">Enriched data for: {formData.firstName} {formData.lastName}</p>
          <p className="text-sm text-gray-600">Company: {formData.companyDomain}</p>
        </div>
        <div className="mb-6">
          <p className="font-semibold mb-2">Results:</p>
          <div className="space-y-2">
            {formData.findEmail && (
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="blur-sm select-none">{blurredEmail}</span>
              </div>
            )}
            {formData.findPhone && (
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span className="blur-sm select-none">{blurredPhone}</span>
              </div>
            )}
            {formData.enrichLinkedIn && (
              <div className="flex justify-between">
                <span className="font-medium">LinkedIn:</span>
                <span className="blur-sm select-none">{blurredLinkedIn}</span>
              </div>
            )}
            {formData.getCompanyEmails && (
              <div className="flex justify-between">
                <span className="font-medium">Company Emails:</span>
                <span className="blur-sm select-none">{blurredCompanyEmails}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCreateAccount}
          className="w-full bg-emerald-pool text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 mb-2"
        >
          Create Account to View Results
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}