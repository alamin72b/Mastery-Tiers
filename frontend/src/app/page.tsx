'use client';

import Link from 'next/link';

export default function HomePage() {
  // Use your Render Backend URL
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mastery-tiers.onrender.com';

  const handleLogin = () => {
    // This triggers the Google OAuth flow we set up in the backend
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-blue-600">
          MasteryTiers<span className="text-gray-400">.</span>
        </div>
        <button
          onClick={handleLogin}
          className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-all shadow-md"
        >
          Sign In
        </button>
      </nav>

      {/* --- Hero Section --- */}
      <header className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Visualize Your <span className="text-blue-600">Growth</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          MasteryTiers helps you break down complex skills into manageable sub-categories and track your progress with a beautiful, tiered interface.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLogin}
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Get Started with Google
          </button>
          <Link
            href="#features"
            className="w-full md:w-auto bg-white border border-gray-200 text-gray-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
          >
            See Features
          </Link>
        </div>
      </header>

      {/* --- Feature Section --- */}
      <section id="features" className="bg-gray-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to master anything</h2>
            <p className="text-gray-500">Simple, powerful, and effective skill tracking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                📂
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Categories</h3>
              <p className="text-gray-500 leading-relaxed">
                Organize your learning path by creating main categories for different domains like Programming, Gardening, or Languages.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                🌿
              </div>
              <h3 className="text-xl font-bold mb-3">Nested Sub-categories</h3>
              <p className="text-gray-500 leading-relaxed">
                Break categories down into specific skills. Track "Tomatoes" inside Gardening or "React" inside Programming.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-2xl">
                📈
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
              <p className="text-gray-500 leading-relaxed">
                Increment your counts as you practice. Watch your "Mastery Tier" grow based on your consistent effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} MasteryTiers. Built with Next.js & NestJS.
      </footer>
    </div>
  );
}