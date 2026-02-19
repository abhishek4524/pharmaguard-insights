import React from 'react';

const PharmaGuardHome = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                PharmaGuard
              </a>
            </div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Dashboard
              </a>
              <a href="/settings" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                How It Works
              </a>
              <a href="analysis" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                Analyze
              </a>
            </div>

            {/* Get Started Button */}
            <div>
              <a href="/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              AI-Powered Precision Medicine
            </h1>
            <p className="text-xl text-gray-600">
              Personalized Drug Safety Based on Genetic Insights
            </p>
            <p className="text-gray-500 max-w-lg">
              Transform patient care with advanced genomic analysis and AI-driven 
              drug safety recommendations for optimal treatment outcomes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow">
                Analyze Patient
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Illustration Placeholder */}
          <div className="hidden md:block">
            <div className="relative h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="./hero.png"/>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-400">
                  Medical AI Visualization
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Advanced Features for Precision Medicine
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Genetic Variant Analysis</h3>
              <p className="text-gray-500 leading-relaxed">
                Advanced genomic sequencing analysis to identify clinically significant genetic variants affecting drug response.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Drug Risk Prediction</h3>
              <p className="text-gray-500 leading-relaxed">
                AI-powered algorithms predict potential adverse drug reactions based on individual genetic profiles.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Explainable AI Recommendations</h3>
              <p className="text-gray-500 leading-relaxed">
                Transparent AI decision-making with clear explanations for each drug safety recommendation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex-1 max-w-xs text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload VCF File</h3>
              <p className="text-gray-500">
                Upload your genetic data in VCF format securely
              </p>
            </div>

            {/* Arrow - Hidden on mobile */}
            <div className="hidden md:block text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex-1 max-w-xs text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-teal-600">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Drug</h3>
              <p className="text-gray-500">
                Choose medications from our comprehensive database
              </p>
            </div>

            {/* Arrow - Hidden on mobile */}
            <div className="hidden md:block text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex-1 max-w-xs text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Risk Report</h3>
              <p className="text-gray-500">
                Receive comprehensive drug safety analysis report
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 PharmaGuard | Built for RIFT Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PharmaGuardHome;