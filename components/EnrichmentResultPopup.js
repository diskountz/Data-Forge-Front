import { useState } from 'react';
import { ArrowRight } from 'lucide-react';  // Add this import

export default function EnrichmentResultPopup({ onClose, formData }) {
  const handleCreateAccount = () => {
    window.location.href = 'https://app.dataforge.so';
  };

  const blurredEmail = 'user@example.com';
  const blurredPhone = '+1 (555) 123-4567';
  const blurredLinkedIn = 'LinkedIn profile enriched with 20+ data points';
  const blurredCompanyEmails = '5 company email formats found';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-notion-default mb-4">Enrichment Results</h2>

        <div className="mb-4">
          <p className="font-semibold text-notion-default">
            Enriched data for: {formData.firstName} {formData.lastName}
          </p>
          <p className="text-sm text-notion-gray">
            Company: {formData.companyDomain}
          </p>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2 text-notion-default">Results:</p>
          <div className="space-y-3">
            {formData.findEmail && (
              <div className="flex justify-between items-center">
                <span className="text-notion-default">Email:</span>
                <span className="blur-sm select-none">{blurredEmail}</span>
              </div>
            )}
            {formData.findPhone && (
              <div className="flex justify-between items-center">
                <span className="text-notion-default">Phone:</span>
                <span className="blur-sm select-none">{blurredPhone}</span>
              </div>
            )}
            {formData.enrichLinkedIn && (
              <div className="flex justify-between items-center">
                <span className="text-notion-default">LinkedIn:</span>
                <span className="blur-sm select-none">{blurredLinkedIn}</span>
              </div>
            )}
            {formData.getCompanyEmails && (
              <div className="flex justify-between items-center">
                <span className="text-notion-default">Company Emails:</span>
                <span className="blur-sm select-none">{blurredCompanyEmails}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCreateAccount}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-emerald-pool hover:bg-emerald-pool/90 text-white rounded-lg text-[16px] font-medium transition-colors group"
          >
            Register to View Results
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-notion-hover hover:bg-notion-border text-napoleon rounded-lg font-medium text-[14px] transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}