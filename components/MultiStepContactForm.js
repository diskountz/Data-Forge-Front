import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChevronRight, Loader, Check, Building2, Users, Briefcase, Mail, Phone, User } from 'lucide-react';

export default function MultiStepContactForm() {
  const supabase = useSupabaseClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Company Information (Step 1)
    company_size: '',
    industry: '',
    use_case: '',
    expected_users: '',

    // Personal Information (Step 2)
    first_name: '',
    last_name: '',
    work_email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStepOne = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([{
          ...formData,
          status: 'new',
          submitted_at: new Date().toISOString(),
          lead_score: calculateLeadScore(formData)
        }]);

      if (submitError) throw submitError;

      setSuccess(true);
    } catch (error) {
      setError('There was an error submitting your message. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLeadScore = (data) => {
    let score = 0;

    // Company size scoring
    const sizeTiers = {
      '1-10': 1,
      '11-50': 2,
      '51-200': 3,
      '201-1000': 4,
      '1000+': 5
    };
    score += sizeTiers[data.company_size] || 0;

    // Expected users scoring
    const userTiers = {
      '1-5': 1,
      '6-20': 2,
      '21-50': 3,
      '50+': 4
    };
    score += userTiers[data.expected_users] || 0;

    // Work email domain scoring
    if (data.work_email) {
      const domain = data.work_email.split('@')[1];
      if (domain && !domain.includes('gmail.com') && !domain.includes('yahoo.com')) {
        score += 2;
      }
    }

    return score;
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-pool/10 mb-4">
          <Check className="w-8 h-8 text-emerald-pool" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for reaching out. Our team will contact you within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 1 ? 'bg-emerald-pool text-white' : 'bg-emerald-pool/10 text-emerald-pool'
          }`}>
            1
          </div>
          <div className="w-16 h-1 mx-2 bg-gray-200">
            <div className={`h-full bg-emerald-pool transition-all ${
              step === 2 ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 2 ? 'bg-emerald-pool text-white' : 'bg-emerald-pool/10 text-emerald-pool'
          }`}>
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStepOne} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many employees work at your company? *
            </label>
            <select
              name="company_size"
              required
              value={formData.company_size}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What industry are you in? *
            </label>
            <select
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's your primary use case? *
            </label>
            <select
              name="use_case"
              required
              value={formData.use_case}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            >
              <option value="">Select use case</option>
              <option value="lead_generation">Lead Generation</option>
              <option value="sales_prospecting">Sales Prospecting</option>
              <option value="market_research">Market Research</option>
              <option value="recruitment">Recruitment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many users will need access? *
            </label>
            <select
              name="expected_users"
              required
              value={formData.expected_users}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            >
              <option value="">Select number of users</option>
              <option value="1-5">1-5 users</option>
              <option value="6-20">6-20 users</option>
              <option value="21-50">21-50 users</option>
              <option value="50+">50+ users</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90"
          >
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Email *
            </label>
            <input
              type="email"
              name="work_email"
              required
              value={formData.work_email}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How can we help? *
            </label>
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Sending...
                </>
              ) : (
                'Submit'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to previous step
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            By submitting this form, you agree to our{' '}
            <a href="/terms" className="text-emerald-pool hover:text-emerald-pool/80">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-emerald-pool hover:text-emerald-pool/80">
              Privacy Policy
            </a>
            . You can opt-out of communications at any time.
          </p>
        </form>
      )}
    </div>
  );
}