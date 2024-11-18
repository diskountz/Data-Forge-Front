// components/MainLayout.js
import Header from './Header';  // Import your existing Header
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />  {/* Use your existing Header component */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}