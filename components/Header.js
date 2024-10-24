// components/Header.js

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-daring-indigo cursor-pointer">Data Forge</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="#features"><a className="text-napoleon hover:text-emerald-pool transition duration-300">Features</a></Link>
            <Link href="/blog">
                <a className="text-napoleon hover:text-emerald-pool transition duration-300">Blog</a></Link>
            <Link href="#pricing"><a className="text-napoleon hover:text-emerald-pool transition duration-300">Pricing</a></Link>
            <Link href="#testimonials"><a className="text-napoleon hover:text-emerald-pool transition duration-300">Testimonials</a></Link>
          </div>
          <button className="bg-emerald-pool text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300">
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}