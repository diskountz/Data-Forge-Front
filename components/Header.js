// File: components/Header.js
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md pt-4">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Data Forge"
                width={150}
                height={45}
                className="w-auto h-auto"
                priority
              />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/features" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Features
            </Link>
            <Link href="/blog" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Blog
            </Link>
            <Link href="/pricing" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Pricing
            </Link>
            <Link href="/testimonials" className="text-napoleon hover:text-emerald-pool transition duration-300">
              Testimonials
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="https://app.dataforge.so"
              className="text-napoleon hover:text-emerald-pool transition duration-300"
            >
              Login
            </Link>
            <button
              onClick={() => window.location.href = 'https://app.dataforge.so'}
              className="bg-emerald-pool text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}