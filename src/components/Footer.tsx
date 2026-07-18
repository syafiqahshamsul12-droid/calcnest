import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Logo & Brand Pitch */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
                <Calculator className="h-4 w-4 text-white" />
              </div>
              <span className="font-sans text-md font-bold tracking-tight text-blue-700">
                Calc<span className="text-blue-900 font-extrabold">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs font-sans">
              Precision-engineered calculator tools designed for lightning-fast answers. Completely free, highly accessible, and privacy-first.
            </p>
          </div>

          {/* Navigation Links for SEO */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-blue-700 tracking-wider uppercase font-sans">
                Calculators
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <ul className="space-y-2" aria-label="Footer Calculator Column 1">
                    <li>
                      <Link
                        to="/age-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Age Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/percentage-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Percentage Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/bmi-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        BMI Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/days-between-dates"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Days Spacing
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/discount-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Discount Calculator
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2" aria-label="Footer Calculator Column 2">
                    <li>
                      <Link
                        to="/loan-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Loan Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/average-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Average Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/unit-converter"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Unit Converter
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/gpa-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        GPA Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/scientific-calculator"
                        className="text-sm text-gray-500 hover:text-blue-700 transition-colors font-sans"
                      >
                        Scientific Calculator
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-700 tracking-wider uppercase font-sans">
                Corporate & Safety
              </h3>
              <p className="mt-4 text-xs text-gray-500 leading-relaxed font-sans">
                <strong>Disclaimer:</strong> CalcNest provides calculations for informational purposes only. Information generated is not intended as medical, financial, or professional advice. Always consult certified specialists for specific requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-sans">
            &copy; {currentYear} CalcNest. All rights reserved. Made with love for premium performance.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link to="/" className="hover:text-blue-700 font-sans">Privacy Policy</Link>
            <Link to="/" className="hover:text-blue-700 font-sans">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
