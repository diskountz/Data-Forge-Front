import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactEnrichmentForm from '../components/ContactEnrichmentForm';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const enrichmentMethods = [
  {
    id: 'individual',
    title: 'Individual Enrichment',
    benefit: 'Get detailed insights on key decision-makers',
    description: 'Enhance your understanding of individual prospects with comprehensive data points including job history, skills, and social media presence. This deep insight allows for highly personalized outreach, increasing your chances of making meaningful connections.',
  },
  {
    id: 'bulk',
    title: 'Bulk Enrichment',
    benefit: 'Scale your outreach efforts efficiently',
    description: 'Upload and enrich thousands of contacts simultaneously, saving countless hours of manual research. Our bulk enrichment process maintains high accuracy while dramatically reducing the time needed to prepare for large-scale marketing or sales campaigns.',
  },
  {
    id: 'extension',
    title: 'Chrome Extension',
    benefit: 'Enrich on-the-go while browsing',
    description: 'Our Chrome extension seamlessly integrates with your workflow, allowing you to enrich contact data directly from LinkedIn profiles or company websites. This real-time enrichment capability ensures you always have the most up-to-date information at your fingertips during your research process.',
  },
  {
    id: 'api',
    title: 'API Integration',
    benefit: 'Automate your data enrichment process',
    description: 'Integrate our powerful enrichment capabilities directly into your existing tools and workflows. With our robust API, you can automate the enrichment process, ensuring your CRM or marketing platform always has the freshest, most accurate data without manual intervention.',
  },
];

const EnrichmentMethod = ({ method, isActive, onClick, isMobile }) => (
  <div className={`${isMobile ? 'mb-4' : ''}`}>
    <motion.div
      className={`cursor-pointer p-4 rounded-lg ${isActive ? 'bg-emerald-pool text-white' : 'bg-white hover:bg-puturple/30'}`}
      onClick={() => onClick(method.id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h3 className={`text-xl font-semibold mb-2 ${isActive ? 'text-white' : 'text-daring-indigo'}`}>{method.title}</h3>
      <p className={`text-sm ${isActive ? 'text-white' : 'text-napoleon'}`}>{method.benefit}</p>
    </motion.div>
    {isMobile && isActive && (
      <AnimatePresence>
        <motion.div
          key={method.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-lg mt-2 shadow-md"
        >
          <p className="text-napoleon">{method.description}</p>
        </motion.div>
      </AnimatePresence>
    )}
  </div>
);

const FlexibleEnrichmentMethods = () => {
  const [activeMethod, setActiveMethod] = useState(enrichmentMethods[0].id);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-puturple/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 className="text-3xl font-bold text-center mb-12 text-daring-indigo" {...fadeIn}>
          Flexible Enrichment Methods
        </motion.h2>
        <div className={`${isMobile ? 'flex flex-col' : 'flex flex-col md:flex-row gap-8'}`}>
          <div className={`${isMobile ? 'w-full' : 'md:w-1/2'} space-y-4`}>
            {enrichmentMethods.map((method) => (
              <EnrichmentMethod
                key={method.id}
                method={method}
                isActive={activeMethod === method.id}
                onClick={setActiveMethod}
                isMobile={isMobile}
              />
            ))}
          </div>
          {!isMobile && (
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-lg h-[400px] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMethod}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-6 overflow-y-auto"
                  >
                    <h3 className="text-2xl font-semibold mb-4 text-daring-indigo">
                      {enrichmentMethods.find(m => m.id === activeMethod).title}
                    </h3>
                    <p className="text-napoleon">
                      {enrichmentMethods.find(m => m.id === activeMethod).description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-napoleon font-sans">
      <Head>
        <title>Data Forge - Enhance Your B2B Contact Information</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero Section with Contact Enrichment Form */}
        <section className="bg-gradient-to-b from-white via-puturple/30 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div className="md:w-1/2 mb-10 md:mb-0" {...fadeIn}>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-daring-indigo">Enhance Your B2B Contact Information</h1>
                <p className="text-xl mb-8 text-napoleon">Get accurate, up-to-date contact details for your prospects and customers.</p>
                <ul className="mb-8">
                  <li className="flex items-center mb-2">
                    <span className="mr-2">✓</span>
                    <span>Verify and update existing contacts</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="mr-2">✓</span>
                    <span>Find new decision-makers in target companies</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Improve your outreach success rate</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div className="md:w-1/2 md:pl-10" {...fadeIn}>
                <ContactEnrichmentForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-3xl font-bold text-center mb-16 text-daring-indigo" {...fadeIn}>
              How Data Forge Works
            </motion.h2>
            <div className="flex flex-col md:flex-row justify-between items-start space-y-12 md:space-y-0 md:space-x-8">
              {[
                { number: 1, title: "Input Your Data", description: "Enter the information you have about your contacts or target companies." },
                { number: 2, title: "We Enrich Your Data", description: "Our system searches multiple reliable sources to find and verify contact information." },
                { number: 3, title: "Get Updated Results", description: "Receive accurate, up-to-date contact details ready for your outreach campaigns." }
              ].map((step, index) => (
                <motion.div key={index} className="w-full md:w-1/3" {...fadeIn}>
                  <div className="bg-emerald-pool text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-daring-indigo">{step.title}</h3>
                  <p className="text-napoleon">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-parfait bg-opacity-20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-3xl font-bold text-center mb-16 text-daring-indigo" {...fadeIn}>
              Key Features
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Fast Processing", description: "Get results within minutes, not hours or days." },
                { title: "High Accuracy", description: "Our data is verified from multiple sources for reliability." },
                { title: "Comprehensive Results", description: "Get emails, phone numbers, job titles, and more." },
                { title: "Data Protection", description: "Your data and searches are kept private and secure." },
                { title: "Easy Integration", description: "Works with popular CRMs and sales tools." },
                { title: "Regular Updates", description: "Our database is constantly refreshed for the latest information." }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                  whileHover={{ y: -5 }}
                  {...fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-2 text-daring-indigo">{feature.title}</h3>
                  <p className="text-napoleon">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Flexible Enrichment Methods Section */}
        <FlexibleEnrichmentMethods />

        {/* Testimonials */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-3xl font-bold text-center mb-16 text-daring-indigo" {...fadeIn}>
              What Our Clients Say
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { quote: "Data Forge has significantly improved our outreach success rate. We're now connecting with the right people more often.", name: "Sarah Johnson", title: "Sales Manager, TechCorp", image: "/api/placeholder/60/60" },
                { quote: "The accuracy of the contact information has saved us countless hours of manual research and verification.", name: "Michael Lee", title: "Marketing Director, GrowthSolutions", image: "/api/placeholder/60/60" }
              ].map((testimonial, index) => (
                <motion.div key={index} className="bg-white p-8 rounded-lg shadow-lg" {...fadeIn}>
                  <p className="text-napoleon mb-6 text-lg italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-daring-indigo">{testimonial.name}</p>
                      <p className="text-sm text-napoleon">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 className="text-3xl font-bold text-center mb-12 text-daring-indigo" {...fadeIn}>
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-8">
              {[
                { question: "How accurate is the enriched data?", answer: "Our data is highly accurate, with a 95% match rate for email addresses and 90% for phone numbers." },
                { question: "Is my data safe with Data Forge?", answer: "Absolutely. We prioritize data security and comply with GDPR and other data protection regulations." },
                { question: "How often is your database updated?", answer: "Our database is updated daily to ensure you always have access to the most current information." },
                { question: "Can I integrate Data Forge with my CRM?", answer: "Yes, we offer integrations with popular CRMs like Salesforce, HubSpot, and more." },
              ].map((faq, index) => (
                <motion.div key={index} className="bg-white p-6 rounded-lg shadow-lg" {...fadeIn}>
                  <h3 className="text-lg font-semibold mb-2 text-daring-indigo">{faq.question}</h3>
                  <p className="text-napoleon">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-daring-indigo text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 className="text-4xl font-bold mb-6" {...fadeIn}>
              Ready to Enhance Your Contact Data?
            </motion.h2>
            <motion.p className="text-xl mb-12" {...fadeIn}>
              Start improving your outreach effectiveness today.
            </motion.p>
            <motion.button 
              className="bg-emerald-pool text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
            </motion.button>
            <p className="mt-4 text-sm">No credit card required. 7-day free trial with 100 lookups.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}