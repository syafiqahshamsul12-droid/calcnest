import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import CalculatorCard from '../components/CalculatorCard';
import SEOManager from '../components/SEOManager';

export default function PrivacyPolicy() {
  const breadcrumbs = [{ label: 'Privacy Policy', path: '/privacy-policy' }];
  const canonicalUrl = `${window.location.origin}/privacy-policy`;

  const seoData = {
    title: 'Privacy Policy - CalcNest',
    description: 'Read the CalcNest privacy policy. Understand how we secure your calculator input metrics and keep processing client-side.',
    canonicalUrl,
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="privacy-breadcrumb" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Privacy <span className="text-blue-700">Policy</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Your trust is our priority. Read how CalcNest processes and protects data during computational requests.
          </p>
        </div>

        <CalculatorCard id="privacy-content" title="Privacy Policy Statement" description="Last updated: July 2026">
          <div className="prose text-gray-600 font-sans leading-relaxed space-y-6 text-sm sm:text-base">
            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">1. Client-Side Data Processing</h3>
              <p>
                Unlike traditional, heavy database sites, the majority of calculators on <strong>CalcNest</strong> execute arithmetic formulas, age calculations, loan schedules, and GPA tables <strong>entirely client-side</strong> using standard JavaScript built directly inside your browser. No figures, formulas, or raw results are submitted or stored on external cloud databases.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">2. Cookies and Log Files</h3>
              <p>
                We use standard, non-sensitive local variables or basic diagnostic log configurations. These analyze generic layout traffic patterns (e.g. tracking the total visitors per calculator tool page) to help optimize loading times, routing speed, and mobile browser compatibility.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">3. Advertising and Google AdSense</h3>
              <p>
                To provide completely free calculators, CalcNest implements Google AdSense blocks on specific pages. These vendors may place or read cookies on your browsers to deliver targeted advertisements based on previous websites you have visited. You can opt out of personalized ads by visiting your Google Ad Settings dashboard.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">4. Third-Party Link Policies</h3>
              <p>
                Some calculator pages display outbound link buttons directing users to educational references or mathematical definitions. We are not responsible for the privacy protections or policies practiced by external, third-party organizations.
              </p>
            </section>

            <section>
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-2">5. Updates and Agreement</h3>
              <p>
                CalcNest reserves the right to modify or change this policy. By continuing to use our free mathematical, scientific, and financial calculators, you agree to the conditions listed inside this statement.
              </p>
            </section>
          </div>
        </CalculatorCard>
      </div>
    </main>
  );
}
