import React from 'react';
import { Sparkles, Info, ShieldCheck, Cpu } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import CalculatorCard from '../components/CalculatorCard';
import SEOManager from '../components/SEOManager';

export default function About() {
  const breadcrumbs = [{ label: 'About Us', path: '/about' }];
  const canonicalUrl = `${window.location.origin}/about`;

  const seoData = {
    title: 'About Us - CalcNest',
    description: 'Learn about CalcNest - our mission to provide high-precision, user-friendly, and completely free online mathematical, financial, and physical calculators.',
    canonicalUrl,
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="about-breadcrumb" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            About <span className="text-blue-700">CalcNest</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover our mission to design modern, distraction-free, and high-precision calculated tools for students, engineers, and professionals.
          </p>
        </div>

        <div className="space-y-8">
          <CalculatorCard id="about-mission" title="Our Mission" description="Why we build free, beautiful math utilities.">
            <div className="prose text-gray-600 font-sans leading-relaxed space-y-4 text-sm sm:text-base">
              <p>
                At <strong>CalcNest</strong>, we believe that math, financial planning, and unit conversions should be easy, accessible, and delightful to interact with. Too many calculators online are cluttered with heavy pop-ups, slow layouts, and confusing controls.
              </p>
              <p>
                We engineered CalcNest to be a lightning-fast, modern, mobile-friendly platform where math operations are solved in real-time. Everything is built with responsive Tailwind CSS, high performance layouts, and an accessible aesthetic.
              </p>
            </div>
          </CalculatorCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50">
              <Cpu className="h-8 w-8 text-blue-700 mb-3" />
              <h3 className="font-sans font-bold text-blue-800 text-base mb-2">High Precision</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Calculations are powered by robust mathematical algorithms to prevent rounding errors and floating decimals.
              </p>
            </div>
            <div className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50">
              <ShieldCheck className="h-8 w-8 text-blue-700 mb-3" />
              <h3 className="font-sans font-bold text-blue-800 text-base mb-2">Privacy First</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                We do not track your input figures or sell custom data. All base solutions run client-side inside your own browser window.
              </p>
            </div>
            <div className="border border-gray-100 p-6 rounded-2xl bg-gray-50/50">
              <Sparkles className="h-8 w-8 text-blue-700 mb-3" />
              <h3 className="font-sans font-bold text-blue-800 text-base mb-2">Zero Friction</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                No sign-ups, no monthly subscriptions, and no intrusive pop-up blockers. Simply select a tool and begin calculating.
              </p>
            </div>
          </div>

          <CalculatorCard id="about-team" title="Technology & Craftsmanship" description="Built with modern web standards.">
            <div className="prose text-gray-600 font-sans leading-relaxed text-sm sm:text-base">
              <p>
                CalcNest is crafted using React 18, Vite, Tailwind CSS, and high-quality utility icons. Our code structures are optimized for SEO schemas, enabling students and professionals worldwide to search, retrieve, and execute calculation ledgers smoothly on any device.
              </p>
            </div>
          </CalculatorCard>
        </div>
      </div>
    </main>
  );
}
