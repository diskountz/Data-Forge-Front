// File: pages/pricing.js
import { useState } from 'react';
import { Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: 0,
      credits: 50,
      description: 'Perfect for trying out Data Forge',
      features: [
        'Email Finder',
        'Email Verification',
        'Domain Search',
        'LinkedIn Profile Enrichment',
        'Phone Number Lookup',
        'Basic Support'
      ]
    },
    {
      name: 'Starter',
      price: 39,
      credits: 1000,
      description: 'Great for small teams and startups',
      features: [
        'Everything in Free, plus:',
        'Bulk Email Processing',
        'Company Email Pattern Detection',
        'API Access',
        'Priority Support'
      ]
    },
    {
      name: 'Pro',
      price: 79,
      credits: 2500,
      description: 'For growing businesses',
      features: [
        'Everything in Starter, plus:',
        'Higher API Rate Limits',
        'Dedicated Account Manager',
        'Custom Contracts Available'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do credits work?',
      answer: 'Credits are consumed when you perform actions like email finding or verification. Different actions consume different amounts of credits. Unused credits roll over to the next month.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: "Yes, you can change your plan at any time. When upgrading, you'll be prorated for the remainder of the billing cycle. When downgrading, the new rate will apply to your next billing cycle."
    },
    {
      question: 'Do credits expire?',
      answer: 'Credits roll over month to month as long as you maintain an active paid subscription. Free plan credits expire at the end of each month.'
    },
    {
      question: 'What happens if I run out of credits?',
      answer: 'You can purchase additional credits at any time, or upgrade to a higher plan with more credits included.'
    }
  ];

  const testimonials = [
    {
      quote: "Data Forge has transformed how we find and verify prospect information. The accuracy is incredible.",
      author: "Sarah Chen",
      title: "Head of Sales, TechCorp",
      company: "TechCorp"
    },
    {
      quote: "The credit system is transparent and fair. We always know exactly what we're using and why.",
      author: "Michael Rodriguez",
      title: "Growth Manager",
      company: "SalesFlow Inc"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-20">
        {/* Pricing Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-daring-indigo mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-napoleon">Choose the plan that's right for you</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'monthly' 
                  ? 'bg-white shadow-sm text-emerald-pool' 
                  : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'annual' 
                  ? 'bg-white shadow-sm text-emerald-pool' 
                  : 'text-gray-500'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`${
                  plan.name === 'Pro' 
                    ? 'bg-gradient-to-b from-emerald-pool/5 to-white border-emerald-pool transform -translate-y-4 scale-105 z-10 mt-6' // Added mt-6 for extra space at top
                    : 'bg-white border-gray-200'
                } rounded-lg shadow-lg overflow-visible border relative transition-all duration-300 hover:shadow-xl`} // Changed overflow-hidden to overflow-visible
              >
                {plan.name === 'Pro' && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-pool text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`p-8 ${plan.name === 'Pro' ? 'pt-10' : 'pb-8'}`}> {/* Added more top padding for Pro plan */}
                  <h2 className="text-2xl font-bold text-daring-indigo">{plan.name}</h2>
                  <p className="text-napoleon mt-2 min-h-[48px]">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-daring-indigo">
                      ${billingCycle === 'annual' ? Math.floor(plan.price * 0.8) : plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-napoleon">
                        /month
                        {billingCycle === 'annual' && (
                          <span className="text-emerald-pool ml-2 text-sm">
                            (20% off)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-pool font-semibold mt-2">
                    {plan.credits.toLocaleString()} credits/month
                  </p>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${
                          plan.name === 'Pro' ? 'text-emerald-pool' : 'text-emerald-pool/80'
                        }`} />
                        <span className="text-napoleon">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => window.location.href = 'https://app.dataforge.so'}
                    className={`mt-8 w-full py-3 px-4 rounded-lg transition duration-300 ${
                      plan.name === 'Pro'
                        ? 'bg-emerald-pool text-white hover:bg-emerald-pool/90 shadow-lg hover:shadow-xl'
                        : 'bg-emerald-pool/90 text-white hover:bg-emerald-pool'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}

            {/* Custom Plan Card */}
            <div className="md:col-span-3 bg-gradient-to-r from-emerald-pool to-daring-indigo text-white rounded-lg shadow-lg p-8 mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Enterprise Custom Plan</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                  Need more credits or custom features? Let's talk about a plan that's perfect for your business.
                </p>
                <button 
                  onClick={() => window.location.href = 'https://app.dataforge.so'}
                  className="bg-white text-emerald-pool py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Credit System */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-3xl font-bold text-center text-daring-indigo mb-12">How Credits Work</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid gap-6">
              {[
                {
                  action: "Verified Email (Individual)",
                  credits: "2 credits",
                  description: "Find & verify individual email addresses"
                },
                {
                  action: "Verified Company Domain Emails",
                  credits: "2 credits each",
                  description: "Get verified email patterns for a company domain"
                },
                {
                  action: "LinkedIn Profile Enrichment",
                  credits: "1 credit",
                  description: "Enrich your data with LinkedIn information"
                },
                {
                  action: "Phone Number",
                  credits: "15 credits",
                  description: "Find verified phone numbers"
                },
                {
                  action: "Catch-all and Unverified Emails",
                  credits: "0 credits",
                  description: "Additional potential email formats"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg transition-all ${
                    item.credits === "0 credits" 
                      ? "bg-gray-50"
                      : "bg-emerald-pool/5 hover:bg-emerald-pool/10"
                  }`}
                >
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-daring-indigo mb-1">
                      {item.action}
                    </h3>
                    <p className="text-napoleon text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className={`mt-4 md:mt-0 md:ml-8 ${
                    item.credits === "0 credits"
                      ? "text-napoleon"
                      : "text-emerald-pool font-semibold"
                  }`}>
                    {item.credits}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Updated Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-3xl font-bold text-center text-daring-indigo mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-12 gap-6">
            {[
              {
                quote: "Data Forge has transformed our lead generation process. The accuracy of the data is impressive, and the credit system is straightforward.",
                author: "Sarah Chen",
                title: "Head of Sales",
                company: "TechCorp",
                size: "col-span-12 md:col-span-8",
                color: "from-emerald-pool to-daring-indigo"
              },
              {
                quote: "The API integration was seamless, and the support team is incredibly responsive.",
                author: "Michael Rodriguez",
                title: "Growth Manager",
                company: "SalesFlow Inc",
                size: "col-span-12 md:col-span-4",
                color: "from-parfait to-puturple"
              },
              {
                quote: "We've seen a 40% improvement in our email campaign performance since using Data Forge.",
                author: "Emily Watson",
                title: "Marketing Director",
                company: "GrowthX",
                size: "col-span-12 md:col-span-4",
                color: "from-emerald-pool to-parfait"
              },
              {
                quote: "The LinkedIn enrichment feature has been a game-changer for our sales team's prospecting efforts.",
                author: "David Park",
                title: "Sales Operations",
                company: "ScaleUp Solutions",
                size: "col-span-12 md:col-span-8",
                color: "from-puturple to-daring-indigo"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className={`${testimonial.size} group`}
              >
                <div className={`h-full bg-gradient-to-br ${testimonial.color} rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-1`}>
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <div className="text-4xl text-white/20 font-serif mb-4">"</div>
                      <p className="text-lg text-white leading-relaxed">
                        {testimonial.quote}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-white">{testimonial.author}</p>
                          <p className="text-sm text-white/80">{testimonial.title}, {testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-3xl font-bold text-center text-daring-indigo mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-daring-indigo mb-2">{faq.question}</h3>
                <p className="text-napoleon">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}