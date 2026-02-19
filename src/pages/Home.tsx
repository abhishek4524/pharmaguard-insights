import React, { useEffect } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Dna,
  FileText,
  Pill,
  ShieldAlert,
  Upload,
} from "lucide-react";

const Home = () => {
  useEffect(() => {
    const animatedNodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb orb-blue" />
        <div className="orb orb-teal" />
        <div className="grid-glow" />
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-gray-100/90 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
              >
                PharmaGuard
              </a>
            </div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/dashboard"
                className="group relative text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                Dashboard
                <span className="nav-underline" />
              </a>
              <a
                href="/settings"
                className="group relative text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                How It Works
                <span className="nav-underline" />
              </a>
              <a
                href="analysis"
                className="group relative text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                Analyze
                <span className="nav-underline" />
              </a>
            </div>

            {/* Get Started Button */}
            <div>
              <a
                href="/dashboard"
                className="cta-shine bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
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
          <div data-reveal className="space-y-6 reveal">
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
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                Analyze Patient
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-medium hover:shadow-md hover:-translate-y-0.5">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Illustration Placeholder */}
          <div className="hidden md:block">
            <div data-reveal className="relative h-96 w-full reveal">
              <div className="absolute inset-0 rounded-2xl shadow-xl hero-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="./hero.png" className="hero-art" alt="Medical AI Visualization" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-500">
                  Medical AI Visualization
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Advanced Features for Precision Medicine
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div data-reveal className="feature-card bg-white rounded-xl p-8 shadow-sm border border-gray-100 reveal">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-6 icon-wrap">
                <Dna className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Genetic Variant Analysis</h3>
              <p className="text-gray-500 leading-relaxed">
                Advanced genomic sequencing analysis to identify clinically significant genetic variants affecting drug response.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div
              data-reveal
              className="feature-card bg-white rounded-xl p-8 shadow-sm border border-gray-100 reveal"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-6 icon-wrap">
                <ShieldAlert className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Drug Risk Prediction</h3>
              <p className="text-gray-500 leading-relaxed">
                AI-powered algorithms predict potential adverse drug reactions based on individual genetic profiles.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div
              data-reveal
              className="feature-card bg-white rounded-xl p-8 shadow-sm border border-gray-100 reveal"
              style={{ transitionDelay: "240ms" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center mb-6 icon-wrap">
                <BrainCircuit className="w-6 h-6 text-blue-600" />
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
            <div data-reveal className="flex-1 max-w-xs text-center reveal">
              <div className="relative">
                <div className="step-chip w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload VCF File</h3>
              <p className="text-gray-500">
                Upload your genetic data in VCF format securely
              </p>
              <Upload className="mx-auto mt-4 w-5 h-5 text-blue-500/80" />
            </div>

            {/* Arrow - Hidden on mobile */}
            <div className="hidden md:block text-gray-300 step-arrow">
              <ArrowRight className="w-8 h-8" />
            </div>

            {/* Step 2 */}
            <div data-reveal className="flex-1 max-w-xs text-center reveal" style={{ transitionDelay: "120ms" }}>
              <div className="relative">
                <div className="step-chip w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-teal-600">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Select Drug</h3>
              <p className="text-gray-500">
                Choose medications from our comprehensive database
              </p>
              <Pill className="mx-auto mt-4 w-5 h-5 text-teal-500/80" />
            </div>

            {/* Arrow - Hidden on mobile */}
            <div className="hidden md:block text-gray-300 step-arrow">
              <ArrowRight className="w-8 h-8" />
            </div>

            {/* Step 3 */}
            <div data-reveal className="flex-1 max-w-xs text-center reveal" style={{ transitionDelay: "240ms" }}>
              <div className="relative">
                <div className="step-chip w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Risk Report</h3>
              <p className="text-gray-500">
                Receive comprehensive drug safety analysis report
              </p>
              <FileText className="mx-auto mt-4 w-5 h-5 text-blue-500/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            � 2026 PharmaGuard | Built for RIFT Hackathon
          </p>
        </div>
      </footer>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 620ms ease, transform 620ms ease;
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(45px);
          opacity: 0.25;
          animation: drift 15s ease-in-out infinite;
        }

        .orb-blue {
          width: 24rem;
          height: 24rem;
          top: -6rem;
          left: -7rem;
          background: #60a5fa;
        }

        .orb-teal {
          width: 23rem;
          height: 23rem;
          top: 8rem;
          right: -8rem;
          background: #2dd4bf;
          animation-delay: 2.5s;
        }

        .grid-glow {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(circle at center, black 35%, transparent 75%);
        }

        .nav-underline {
          position: absolute;
          left: 0;
          bottom: -0.2rem;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #14b8a6);
          transition: width 250ms ease;
        }

        .group:hover .nav-underline {
          width: 100%;
        }

        .cta-shine {
          position: relative;
          overflow: hidden;
        }

        .cta-shine::after {
          content: "";
          position: absolute;
          top: 0;
          left: -40%;
          width: 30%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          transform: skewX(-20deg);
        }

        .cta-shine:hover::after {
          animation: sweep 700ms ease;
        }

        .hero-card {
          background:
            radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.24), transparent 38%),
            radial-gradient(circle at 80% 10%, rgba(45, 212, 191, 0.22), transparent 40%),
            linear-gradient(145deg, #eff6ff, #f0fdfa);
          border: 1px solid rgba(148, 163, 184, 0.28);
        }

        .hero-art {
          width: min(88%, 360px);
          animation: bob 5s ease-in-out infinite;
          filter: drop-shadow(0 16px 30px rgba(15, 23, 42, 0.18));
        }

        .feature-card {
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 36px -24px rgba(2, 132, 199, 0.45);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .icon-wrap {
          transition: transform 300ms ease;
        }

        .feature-card:hover .icon-wrap {
          transform: scale(1.08) rotate(-3deg);
        }

        .step-chip {
          transition: transform 280ms ease, box-shadow 280ms ease;
        }

        .step-chip:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 22px -16px rgba(14, 116, 144, 0.7);
        }

        .step-arrow {
          animation: nudge 2s ease-in-out infinite;
        }

        @keyframes drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 18px, 0);
          }
        }

        @keyframes bob {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes nudge {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.7;
          }
          50% {
            transform: translateX(6px);
            opacity: 1;
          }
        }

        @keyframes sweep {
          from {
            left: -40%;
          }
          to {
            left: 120%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb,
          .hero-art,
          .step-arrow,
          .cta-shine:hover::after {
            animation: none !important;
          }

          .reveal {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
