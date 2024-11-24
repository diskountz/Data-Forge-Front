import MainLayout from '../components/MainLayout';
import ContactForm from '../components/MultiStepContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <MainLayout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-emerald-pool mt-1" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Email
                      </p>
                      <a 
                        href="mailto:contact@dataforge.so" 
                        className="text-gray-600 hover:text-emerald-pool"
                      >
                        contact@dataforge.so
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-emerald-pool mt-1" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Office
                      </p>
                      <p className="text-gray-600">
                        San Francisco, CA
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-emerald-pool mt-1" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Phone
                      </p>
                      <p className="text-gray-600">
                        Mon-Fri from 8am to 5pm PST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/blog" className="text-gray-600 hover:text-emerald-pool">
                      Visit our Blog
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-gray-600 hover:text-emerald-pool">
                      View Pricing
                    </a>
                  </li>
                  <li>
                    <a href="https://app.dataforge.so" className="text-gray-600 hover:text-emerald-pool">
                      Sign Up Free
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}