// components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-parfait bg-opacity-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-daring-indigo mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Features</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Pricing</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-daring-indigo mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">About Us</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Careers</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-daring-indigo mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Blog</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Help Center</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-daring-indigo mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-napoleon hover:text-emerald-pool transition duration-300">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-napoleon">&copy; {new Date().getFullYear()} Data Forge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}