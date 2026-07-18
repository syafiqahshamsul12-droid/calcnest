import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import CalculatorCard from '../components/CalculatorCard';
import SEOManager from '../components/SEOManager';

export default function Disclaimer() {
  const breadcrumbs = [{ label: 'Disclaimer', path: '/disclaimer' }];
  const canonicalUrl = `${window.location.origin}/disclaimer`;

  const seoData = {
    title: 'Disclaimer - Educational & Estimates Guidance',
    description: 'Read the CalcNest legal disclaimer regarding mathematical, financial, health, and academic calculations.',
    canonicalUrl,
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="disclaimer-breadcrumb" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Legal <span className="text-blue-700">Disclaimer</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Please understand that all calculations, suggestions, and conversions on our platform are for informational and educational purposes.
          </p>
        </div>

        <CalculatorCard id="disclaimer-content" title="Liability Disclaimer" description="Estimates and approximations guidance">
          <div className="prose text-gray-600 font-sans leading-relaxed space-y-6 text-sm sm:text-base">
            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">1. No Professional Advice</h3>
              <p>
                All data, numbers, charts, and information provided on <strong>CalcNest</strong> are processed based on mathematical approximations and do not constitute professional, legal, academic, medical, or financial advice.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">2. Financial Estimates Disclaimer</h3>
              <p>
                Calculations made using our <strong>Loan Calculator</strong> or <strong>Discount Calculator</strong> are designed as planning models, not binding lending sheets. Interest compounding methods, clearing taxes, or escrow percentages vary depending on jurisdiction and commercial institutions. Always verify loan terms with an official underwriter or licensed banker.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">3. Health Metrics Disclaimer</h3>
              <p>
                Our <strong>BMI Calculator</strong> uses standard CDC/WHO height-to-weight formulas, but this is a broad index that does not account for muscle density, bone composition, or specific demographic profiles. Do not make major medical decisions, dietary changes, or physical exercise routines based solely on BMI index categories without consulting a physician.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">4. Accuracy Guarantee</h3>
              <p>
                While we continuously test, audit, and improve our codebases to align with global conventions, CalcNest makes no warranties or guarantees about the total correctness, completeness, or ongoing accuracy of the dynamic scripts.
              </p>
            </section>
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
