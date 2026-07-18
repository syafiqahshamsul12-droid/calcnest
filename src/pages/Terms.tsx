import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import CalculatorCard from '../components/CalculatorCard';
import SEOManager from '../components/SEOManager';

export default function Terms() {
  const breadcrumbs = [{ label: 'Terms of Use', path: '/terms' }];
  const canonicalUrl = `${window.location.origin}/terms`;

  const seoData = {
    title: 'Terms of Use - CalcNest Terms of Service',
    description: 'Read the terms of use governing the use of CalcNest free math and finance calculators.',
    canonicalUrl,
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="terms-breadcrumb" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Terms of <span className="text-blue-700">Use</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Please read these terms of service carefully before accessing our free educational calculators.
          </p>
        </div>

        <CalculatorCard id="terms-content" title="Terms of Service Agreement" description="Last updated: July 2026">
          <div className="prose text-gray-600 font-sans leading-relaxed space-y-6 text-sm sm:text-base">
            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing, using, or clicking through <strong>CalcNest</strong> (hereinafter, "this Website" or "our Platform"), you agree to be legally bound by these terms. If you do not agree to all guidelines, you must immediately cease accessing our services.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">2. Usage Rights and Restrictions</h3>
              <p>
                CalcNest grants a limited, non-transferable, revocable license to access our math, GPA, health, and loan calculations for educational, student, business, or individual purposes. Scraping code, trying to reverse engineer the mathematical state scripts, or running automated API parsers to query our tools is strictly prohibited.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">3. Accuracy of Solutions</h3>
              <p>
                While our engineers design and test all formulas against official industry references (e.g. PEMDAS rules, Standard BMI metrics, US interest rates), CalcNest is not responsible for computational variance or mistakes. Results are estimates and must be verified separately before making major financial, legal, academic, or medical decisions.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">4. Disruption of Web Assets</h3>
              <p>
                You agree not to upload scripts or execute commands that could degrade site stability, block standard ad rendering systems, or crash client processes.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">5. Indemnification</h3>
              <p>
                Under no circumstances shall CalcNest or its developers be held liable for any damages, errors, or financial losses stemming from the application of formulas or values computed by this Platform.
              </p>
            </section>
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
