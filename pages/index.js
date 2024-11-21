import Head from 'next/head';
import Link from 'next/link';
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
  ArrowRight,
  Check,
  Star,
  MessageCircle,
  Sparkles,
  Target,
  Clock,
  DollarSign,
  Link as LinkIcon,
  BarChart,
  Globe
} from 'lucide-react';

export default function Home() {
  // State for interactive elements
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Enhanced SEO & Meta Tags */}
      <Head>
        <title>Data Forge | Find & Verify Business Decision Makers | 98% Accurate</title>
        <meta name="description" content="Access 200M+ verified decision-maker contacts. Get direct emails, phones & insights with 98%  deliverability. Start free - 50 monthly credits, no card needed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* OpenGraph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.dataforge.so" />
        <meta property="og:title" content="Data Forge | B2B Contact Intelligence Platform" />
        <meta property="og:description" content="Transform cold outreach into warm conversations with verified decision-maker data. 98%  deliverability." />
        <meta property="og:image" content="https://app.dataforge.so/og-image.png" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@dataforge" />

        {/* Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Data Forge",
            "description": "Access 200M+ verified business contacts with direct emails & phones. Find and connect with decision-makers instantly, backed by 98% accuracy.",
            "applicationCategory": "Business",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free plan with 50 monthly credits"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "2000"
            }
          })}
        </script>

        {/* Canonical URL */}
        <link rel="canonical" href="https://app.dataforge.so" />
      </Head>

      <Header />

      <main>
        {/* Hero Section - Problem → Solution → Action */}
        <section className="relative py-24 overflow-hidden">
          {/* Geometric Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_1px,white_1px),linear-gradient(to_bottom,transparent_1px,white_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Value Proposition */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
              >
                {/* Trust Badge - Instant Value Proposition */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  98% Deliverability
                </div>

                {/* Main Value Proposition */}
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                  Find & Connect with{' '}
                  <span className="text-emerald-600">Decision Makers</span>
                  <span className="block text-xl sm:text-2xl font-normal text-gray-600 mt-4">
                    Turn cold outreach into warm conversations with verified data
                  </span>
                </h1>

                {/* Clear Benefit Statement */}
                <p className="text-lg text-gray-600 mb-8">
                  Access 200M+ verified business contacts. Get direct dials, 
                  emails, and insights to reach the right people, right now.
                </p>

                {/* Key Benefits - Problem Solvers */}
                <div className="space-y-4 mb-8">
                  {[
                    "Find emails & phones directly from LinkedIn profiles",
                    "Enrich entire contact lists in bulk",
                    "Chrome extension for instant enrichment"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="ml-3 text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA with Value Stack */}
                <div className="space-y-4">
                  <Link href="https://app.dataforge.so">
                    <a className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition duration-150 ease-in-out shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Link>
                  <p className="text-sm text-gray-500">
                    ✨ Free forever plan includes 50 credits/month • No credit card needed
                  </p>
                </div>

              </motion.div>

              {/* Right Column - Interactive Demo */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
                  {/* Success Indicator */}
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-600 text-white text-sm font-medium">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Try it free
                    </span>
                  </div>
                  <ContactEnrichmentForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Social Proof Section */}
        <section className="py-12 border-y border-notion-border bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <div className="text-[16px] font-medium">
                     <span className="text-notion-gray ml-2">Trusted by fast-growing teams from:</span>
                </div>
              </div>

              {/* Enhanced Logo Section */}
              <div className="flex items-center space-x-12">
                {/* Added Premium Brand Logos */}
                <div className="grid grid-cols-6 gap-12">
                  {[
                    { name: "Notion", color: "text-blue-500" },
                    { name: "Figma", color: "text-red-500" },
                    { name: "Linear", color: "text-blue-600" },
                    { name: "Vercel", color: "text-red-600" },
                    { name: "Railway", color: "text-blue-700" },
                    { name: "Retool", color: "text-blue-800" }
                  ].map((company, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      <span className={`text-[18px] font-bold ${company.color}`}>
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Grid */}
        <section className="py-20 bg-notion-hover">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-[32px] font-bold tracking-tight mb-4">
                Everything you need to supercharge your outreach
              </h2>
              <p className="text-notion-gray text-[18px] max-w-2xl mx-auto">
                Get comprehensive contact data and insights to connect with 
                decision-makers at scale
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Mail,
                  title: "Smart Email Finder",
                  description: "Get verified business emails with pattern recognition & multi-source validation",
                  features: [
                    "99.9% deliverability",
                    "Format prediction",
                    "Bulk verification"
                  ]
                },
                {
                  icon: Phone,
                  title: "Direct Dial Intelligence",
                  description: "Access direct numbers and mobile phones of key decision makers",
                  features: [
                    "Mobile & direct lines",
                    "International coverage",
                    "Real-time validation"
                  ]
                },
                {
                  icon: Building2,
                  title: "Rich Company Data",
                  description: "Get comprehensive insights about target companies",
                  features: [
                    "Tech stack data",
                    "Employee counts",
                    "Revenue insights"
                  ]
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-grade security with complete data protection",
                  features: [
                    "SOC 2 Type II",
                    "GDPR compliant",
                    "Data encryption"
                  ]
                },
                {
                  icon: Database,
                  title: "Bulk Enrichment",
                  description: "Process thousands of contacts simultaneously",
                  features: [
                    "CSV upload/export",
                    "API access",
                    "Duplicate detection"
                  ]
                },
                {
                  icon: Users,
                  title: "Team Features",
                  description: "Collaborate effectively across your organization",
                  features: [
                    "Shared credits",
                    "Activity tracking",
                    "Role management"
                  ]
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-pool/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-emerald-pool" />
                  </div>

                  <h3 className="text-[20px] font-semibold mb-3 group-hover:text-emerald-pool transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-notion-gray text-[16px] mb-6">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.features.map((item, fIndex) => (
                      <li key={fIndex} className="flex items-center text-[14px] text-notion-gray">
                        <Check className="w-4 h-4 text-emerald-pool mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
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



        {/* Stats Section - Proof of Scale */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  number: "200M+",
                  label: "Verified Contacts",
                  icon: Users,
                  bgColor: "bg-emerald-pool/10",
                  textColor: "text-emerald-pool",
                  borderColor: "border-emerald-pool/20"
                },
                {
                  number: "98%",
                  label: "Deliverability Rate",
                  icon: Target,
                  bgColor: "bg-daring-indigo/10",
                  textColor: "text-daring-indigo",
                  borderColor: "border-daring-indigo/20"
                },
                {
                  number: "50+",
                  label: "Data Points per Contact",
                  icon: Database,
                  bgColor: "bg-puturple/10",
                  textColor: "text-puturple",
                  borderColor: "border-puturple/20"
                },
                {
                  number: "Real-time",
                  label: "Verification",
                  icon: Zap,
                  bgColor: "bg-parfait/10",
                  textColor: "text-parfait",
                  borderColor: "border-parfait/20"
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="text-center p-6 rounded-xl bg-white border transition-all duration-200 hover:shadow-lg">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                    </div>
                    <div className={`text-2xl md:text-3xl font-bold ${stat.textColor} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base text-napoleon">
                      {stat.label}
                    </div>
                  </div>
                  {/* Subtle border accent on hover */}
                  <div className={`absolute inset-0 rounded-xl border-2 ${stat.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* I'll continue with the features, pricing, and final CTA sections... */}

        {/* Key Benefits Section */}
                <section className="py-20 bg-gray-50">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why teams love Data Forge
                      </h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Transform your outreach workflow with powerful data enrichment tools
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        {
                          title: "Save Hours Daily",
                          description: "Stop manual research. Get verified contact data instantly for individuals or entire lists.",
                          icon: Clock,
                          benefits: [
                            "Instant LinkedIn enrichment",
                            "Bulk list processing",
                            "Browser extension"
                          ],
                          color: "emerald"
                        },
                        {
                          title: "Increase Response Rates",
                          description: "Reach the right person with accurate, verified contact information.",
                          icon: BarChart,
                          benefits: [
                            "98% email deliverability",
                            "Direct dial numbers",
                            "Role verification"
                          ],
                          color: "blue"
                        },
                        {
                          title: "Scale Your Outreach",
                          description: "Automate your prospecting workflow with powerful tools and integrations.",
                          icon: Zap,
                          benefits: [
                            "API access",
                            "CRM integration",
                            "Export capabilities"
                          ],
                          color: "purple"
                        }
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-200"
                        >
                          <div className={`w-12 h-12 rounded-lg bg-${benefit.color}-50 flex items-center justify-center mb-6`}>
                            <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {benefit.title}
                          </h3>

                          <p className="text-gray-600 mb-6">
                            {benefit.description}
                          </p>

                          <ul className="space-y-3">
                            {benefit.benefits.map((item, bIndex) => (
                              <li key={bIndex} className="flex items-center text-gray-600">
                                <Check className={`w-5 h-5 text-${benefit.color}-600 mr-2 flex-shrink-0`} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-20 bg-notion-hover">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-[32px] font-bold tracking-tight mb-4">
                Trusted by sales leaders worldwide
              </h2>
              <p className="text-notion-gray text-[18px] max-w-2xl mx-auto">
                Join thousands of teams using Data Forge to supercharge their outreach
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {[
                {
                  quote: 'Data Forge transformed our outreach strategy. We&apos;ve seen a 3x increase in response rates and saved countless hours on manual research.',
                  author: 'Sarah Chen',
                  title: 'Head of Sales',
                  company: 'TechCorp',
                  size: 'col-span-12 md:col-span-8',
                  color: 'bg-daring-indigo'
                },
                {
                  quote: 'The accuracy of the data is incredible. No more bounced emails or wrong numbers.',
                  author: 'Michael Rodriguez',
                  title: 'SDR Manager',
                  company: 'GrowthAI',
                  size: 'col-span-12 md:col-span-4',
                  color: 'bg-parfait'
                },
                {
                  quote: 'Easy to use, fantastic support, and great value. A must-have for any B2B sales team.',
                  author: 'Emma Watson',
                  title: 'Revenue Operations',
                  company: 'CloudScale',
                  size: 'col-span-12 md:col-span-4',
                  color: 'bg-puturple'
                },
                {
                  quote: 'We&apos;ve cut our prospecting time in half and improved our connection rate by 40%. The ROI is phenomenal.',
                  author: 'David Park',
                  title: 'VP Sales',
                  company: 'SalesPro',
                  size: 'col-span-12 md:col-span-8',
                  color: 'bg-emerald-pool'
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className={`${testimonial.size} group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                >
                  <div className={`h-full ${testimonial.color} rounded-xl p-8 hover:shadow-xl transition-all duration-200`}>
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <p className="text-[18px] text-white mb-6 leading-relaxed">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-lg">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-white">{testimonial.author}</p>
                            <p className="text-[14px] text-white/80">{testimonial.title}, {testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-gray-900 text-white">
                  <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get 50 free credits every month
                      </div>

                      <h2 className="text-4xl font-bold mb-6">
                        Ready to supercharge your prospecting?
                      </h2>

                      <p className="text-xl text-gray-300 mb-8">
                        Join thousands of teams using Data Forge to find and connect with decision-makers
                      </p>

                      <div className="flex flex-col items-center space-y-6">
                        <Link href="https://app.dataforge.so">
                          <a className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-lg font-medium transition-all duration-200 group">
                            Start Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Link>

                        <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Check className="w-4 h-4 text-emerald-400 mr-2" />
                            No credit card required
                          </div>
                          <div className="flex items-center">
                            <Check className="w-4 h-4 text-emerald-400 mr-2" />
                            50 free credits monthly
                          </div>
                          <div className="flex items-center">
                            <Check className="w-4 h-4 text-emerald-400 mr-2" />
                            98% accuracy 
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              </main>

              <Footer />
            </div>
          );
        }