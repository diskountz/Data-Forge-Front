// File: components/SimpleMainLayout.js
import Link from 'next/link';

export default function SimpleMainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold cursor-pointer">
                  Data Forge
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}