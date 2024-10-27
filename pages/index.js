import Head from 'next/head';
import Link from 'next/link'; // Add this import
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactEnrichmentForm from '../components/ContactEnrichmentForm';
import { 
  Search, 
  Zap, 
  Shield, 
  Database,
  Users,
  Mail,
  Phone,
  Building2,
  ArrowRight,  // Make sure this is included
  Check,
  Star,
  MessageCircle
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [activeMethod, setActiveMethod] = useState('individual');

  return (
    <div className="min-h-screen bg-white font-sans text-notion-default">
      <Head>
        <title>Data Forge - Enhance Your B2B Contact Information</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      <main>
        {/* Hero Section - Now side by side */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Text */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="pl-8 md:pl-12"
              >
                <h1 className="text-[44px] font-bold tracking-tighter mb-6">
                  Find anyone's business contact{' '}
                  <span className="inline-block relative">
                    information
                    <svg
                      className="absolute bottom-2 left-0 w-full h-3 text-emerald-pool"
                      preserveAspectRatio="none"
                      viewBox="0 0 230 8"
                      style={{ opacity: 0.8 }}  // Made more prominent
                    >
                      <path
                        d="M2,5 C50,0 150,0 228,5"
                        fill="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="text-[20px] text-notion-gray mb-8">
                  Access accurate B2B contact data instantly. 
                  Verify emails, find phone numbers, and enrich your database.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "99.9% Accuracy Guarantee",
                    "GDPR & CCPA Compliant",
                    "Real-time Verification"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-primary-green mr-2" />
                      <span className="text-[16px] text-notion-gray">{feature}</span>
                    </div>
                  ))}
                </div>
                {/* Added CTA button */}
                <motion.button
                  className="inline-flex items-center px-6 py-3 bg-emerald-pool hover:bg-emerald-pool/90 text-white rounded-lg text-[16px] font-medium transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
                </motion.button>
              </motion.div>

              {/* Right side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <ContactEnrichmentForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section - Minimal Style */}
        <section className="py-12 border-y border-notion-border bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Trusted By Text */}
              <div className="text-[16px] font-medium text-napoleon/80 whitespace-nowrap min-w-fit">
                Trusted by 2000+ companies
              </div>

              {/* Logo Marquee */}
              <div className="w-full overflow-hidden">
                <div className="flex items-center justify-between gap-x-16 animate-marquee">
                  {[
                    {
                      name: "Rhonn",
                      logo: (
                        <svg viewBox="0 0 80 24" className="h-6 text-emerald-pool/70">
                          <path d="M12.63 0C5.66 0 0 5.66 0 12.63s5.66 12.63 12.63 12.63 12.63-5.66 12.63-12.63S19.6 0 12.63 0zm0 18.94c-3.47 0-6.31-2.84-6.31-6.31s2.84-6.31 6.31-6.31 6.31 2.84 6.31 6.31-2.84 6.31-6.31 6.31z" fill="currentColor"/>
                        </svg>
                      )
                    },
                    {
                      name: "Google",
                      logo: (
                        <svg viewBox="0 0 80 24" className="h-6 text-puturple/70">
                          <path d="M40.53 11.36c0-5.46-4.17-9.64-9.62-9.64s-9.62 4.18-9.62 9.64c0 5.46 4.17 9.64 9.62 9.64s9.62-4.18 9.62-9.64z" fill="currentColor"/>
                        </svg>
                      )
                    },
                    {
                      name: "Circle",
                      logo: (
                        <svg viewBox="0 0 24 24" className="h-6 text-daring-indigo/70">
                          <circle cx="12" cy="12" r="11" stroke="currentColor" fill="none" strokeWidth="2"/>
                        </svg>
                      )
                    },
                    {
                      name: "VVV",
                      logo: (
                        <svg viewBox="0 0 80 24" className="h-6 text-emerald-pool/70">
                          <path d="M0 24L13.33 0h2.67L29.33 24h-3.33L13.33 4 0 24z" fill="currentColor"/>
                        </svg>
                      )
                    },
                    {
                      name: "X",
                      logo: (
                        <svg viewBox="0 0 24 24" className="h-6 text-parfait/70">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      )
                    },
                    {
                      name: "Circle",
                      logo: (
                        <svg viewBox="0 0 24 24" className="h-6 text-puturple/70">
                          <circle cx="12" cy="12" r="11" fill="currentColor"/>
                        </svg>
                      )
                    }
                  ].map((company, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      {company.logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-notion-hover">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-[32px] font-bold tracking-tight text-center mb-16">
              Everything you need for contact enrichment
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Mail,
                  title: "Email Finder",
                  description: "Find verified business email addresses with high accuracy"
                },
                {
                  icon: Phone,
                  title: "Phone Numbers",
                  description: "Get direct dial and mobile numbers for decision makers"
                },
                {
                  icon: Building2,
                  title: "Company Data",
                  description: "Enrich your data with company information and insights"
                },
                {
                  icon: Shield,
                  title: "Data Protection",
                  description: "Enterprise-grade security and GDPR compliance"
                },
                {
                  icon: Database,
                  title: "Bulk Processing",
                  description: "Enrich thousands of contacts simultaneously"
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Share data and insights across your organization"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  className="bg-white p-6 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <feature.icon className="w-8 h-8 text-primary-blue mb-4" />
                  <h3 className="text-[18px] font-semibold mb-2">{feature.title}</h3>
                  <p className="text-notion-gray text-[14px]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Large transparent background numbers */}
          <div className="absolute inset-0 flex justify-between items-center px-20 pointer-events-none">
            {['01', '02', '03'].map((num, index) => (
              <span 
                key={num}
                className="text-[200px] font-bold text-emerald-pool/5 select-none"
                style={{
                  transform: `translateX(${(index - 1) * 20}px)`,
                }}
              >
                {num}
              </span>
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-[32px] font-bold tracking-tight mb-4">
                How Data Forge Works
              </h2>
              <p className="text-notion-gray text-[18px] max-w-2xl mx-auto">
                Get started with our simple three-step process to enhance your contact data
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Input Your Data",
                  description: "Enter the information you have about your contacts or target companies.",
                  icon: Search,
                  color: "bg-daring-indigo",
                  features: [
                    "Single contact lookup",
                    "Bulk upload via CSV",
                    "API integration"
                  ]
                },
                {
                  number: "02",
                  title: "We Enrich Your Data",
                  description: "Our system searches multiple reliable sources to find and verify contact information.",
                  icon: Database,
                  color: "bg-parfait",
                  features: [
                    "Real-time verification",
                    "Multi-source validation",
                    "AI-powered matching"
                  ]
                },
                {
                  number: "03",
                  title: "Get Updated Results",
                  description: "Receive accurate, up-to-date contact details ready for your outreach campaigns.",
                  icon: Check,
                  color: "bg-emerald-pool",
                  features: [
                    "Verified email addresses",
                    "Direct phone numbers",
                    "Company insights"
                  ]
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  className="relative"
                >
                  {/* Card */}
                  <div className="bg-white rounded-lg border border-notion-border p-8 h-full hover:shadow-lg transition-all duration-200 group">
                    {/* Step Number */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 rounded-lg ${step.color} bg-opacity-10 flex items-center justify-center`}>
                        <span className={`text-xl font-bold ${step.color.replace('bg-', 'text-')}`}>
                          {step.number}
                        </span>
                      </div>
                      <step.icon className={`w-6 h-6 ${step.color.replace('bg-', 'text-')}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-[20px] font-semibold mb-3 group-hover:text-emerald-pool transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-notion-gray text-[16px] mb-6">
                      {step.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3">
                      {step.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-[14px] text-notion-gray">
                          <Check className="w-4 h-4 text-emerald-pool mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Connect lines between cards on desktop */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-notion-border" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <motion.button
                className="inline-flex items-center px-6 py-3 bg-emerald-pool hover:bg-emerald-pool/90 text-white rounded-lg text-[16px] font-medium transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Enriching Your Data
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-notion-hover">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-[32px] font-bold tracking-tight text-center mb-12">
              Loved by closers
            </h2>
            <div className="grid grid-cols-12 gap-6">
              {[
                {
                  quote: "We're here to build relationships and Data Forge is the only way for us to keep track of a large volume of people without relying on impersonal automations.",
                  author: "Morgan",
                  title: "Founder",
                  company: "Sparkmate, venture studio",
                  size: "col-span-12 md:col-span-8",
                  color: "bg-daring-indigo",
                  type: "investors"
                },
                {
                  quote: "It's so easy for me to keep track, and I make sure to set reminders to follow up with prospective partners so they don't fall through the cracks.",
                  author: "Elisa",
                  title: "Partnerships",
                  company: "Slite, B2B Startup",
                  size: "col-span-12 md:col-span-4",
                  color: "bg-parfait",
                  type: "partnerships"
                },
                {
                  quote: "Prospecting takes multiple forms: reach out to someone, meet at an event, get introduced, word of mouth... Data Forge helps us capture all of this.",
                  author: "Hugo",
                  title: "CEO",
                  company: "Nextra, consulting firm",
                  size: "col-span-12 md:col-span-4",
                  color: "bg-puturple",
                  type: "sales"
                },
                {
                  quote: "We're wearing a lot of hats and, at our agency, we need to. My CRM organization needs to be streamlined and easy to use.",
                  author: "Olivier",
                  title: "Founder",
                  company: "Pingfluence",
                  size: "col-span-12 md:col-span-8",
                  color: "bg-emerald-pool",
                  type: "agencies"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className={`${testimonial.size} group`}
                >
                  <div 
                    className={`h-full ${testimonial.color} hover:opacity-95 rounded-lg transition-all duration-200 p-8`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <p className="text-[16px] text-white mb-6">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                              {testimonial.author.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-white">{testimonial.author}</p>
                              <p className="text-[14px] text-white/80">{testimonial.title}, {testimonial.company}</p>
                            </div>
                          </div>
                          <Link href={`/use-cases/${testimonial.type}`}>
                            <a className="flex items-center text-[14px] text-white group-hover:underline">
                              Data Forge for {testimonial.type}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#000000] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-[32px] font-bold tracking-tight mb-6">
              Ready to enhance your contact data?
            </h2>
            <p className="text-gray-300 text-[18px] mb-8">
              Start improving your outreach effectiveness today.
            </p>
            <motion.button 
              className="inline-flex items-center px-6 py-3 bg-emerald-pool hover:bg-emerald-pool/90 text-white rounded-lg text-[16px] font-medium transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <p className="mt-4 text-[14px] text-gray-400">
              No credit card required. 7-day free trial with 100 lookups.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}