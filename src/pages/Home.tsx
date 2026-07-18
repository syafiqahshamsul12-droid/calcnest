import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Percent, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CalendarRange, 
  Tag, 
  Coins, 
  Hash, 
  Scale, 
  GraduationCap, 
  Binary,
  Search,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata, FAQItem } from '../types';

export default function Home() {
  const currentUrl = window.location.origin;

  // State for search filter
  const [searchQuery, setSearchQuery] = useState('');
  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const homepageSEO: SEOMetadata = {
    title: 'Free Online Calculators - Precision Solvers by CalcNest',
    description: 'CalcNest offers a modern, high-precision suite of online calculators. Compute weighted GPA, loan amortization sheets, exact date intervals, percentage differences, and more.',
    canonicalUrl: currentUrl,
    ogType: 'website',
    faqSchema: [
      {
        question: 'What is CalcNest and how can it help me?',
        answer: 'Think of CalcNest as your friendly digital helper for all kinds of daily calculations! We’ve compiled a suite of ten highly accurate, easy-to-use calculators—covering everything from scholastic GPAs and personal finance to wellness metrics like BMI and calendar intervals. We want to make math completely stress-free and accessible on any device you use.',
      },
      {
        question: 'Is my personal data safe when I perform calculations here?',
        answer: 'Your privacy is incredibly important to us. All the mathematical scripts and calculations run entirely inside your own web browser window (client-side). This means none of your inputs, dates of birth, financial figures, or personal measurements are ever sent to our servers or saved anywhere. Your information stays exactly where it belongs: with you.',
      },
      {
        question: 'Are the calculations verified and accurate?',
        answer: 'Yes, absolutely. We design our formulas to align precisely with official scholastic, medical, and financial standards. For example, our BMI calculations follow World Health Organization thresholds, our academic calculators support weighted criteria, and our loan amortization calculations utilize industry-standard compounding logic.',
      },
      {
        question: 'Does CalcNest work on mobile devices?',
        answer: 'Yes! We believe you should be able to run precise calculations on the go. Every button, input form, and responsive panel is carefully styled and optimized for a fluid mobile touch experience, while remaining beautifully clear on larger desktop screens.',
      },
      {
        question: 'How can I share my calculation results?',
        answer: 'Sharing is simple and built right in. On pages like the Age, Percentage, and BMI calculators, we’ve included a quick Copy button. With one tap, you can copy a cleanly formatted summary of your mathematical results directly to your clipboard to send to colleagues, friends, or save in your notes.',
      },
      {
        question: 'Do you charge any fees to use CalcNest?',
        answer: 'Not at all! CalcNest is completely free to use. We support our ongoing design, development, and hosting costs by placing unobtrusive sponsor banners in safe, non-blocking areas of the layout. We aim to keep your workspace clean and premium without any paywalls.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'CalcNest',
      'url': currentUrl,
      'description': 'A modern suite of precision educational, financial, health, and general mathematical calculators.',
      'applicationCategory': 'EducationalApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const calculatorList = [
    {
      name: 'Age Calculator',
      description: 'Find your chronological age in years, months, days, hours, and plan for your next birthday countdown.',
      path: '/age-calculator',
      icon: <Calendar className="h-6 w-6 text-blue-700" />,
      tag: 'Popular',
      category: 'General',
    },
    {
      name: 'Percentage Calculator',
      description: 'Determine rates of change, percentage increases or decreases, proportional fractions, and fractional splits.',
      path: '/percentage-calculator',
      icon: <Percent className="h-6 w-6 text-blue-700" />,
      tag: 'Popular',
      category: 'Math',
    },
    {
      name: 'BMI Calculator',
      description: 'Check BMI ranges using Metric or Imperial systems. Includes complete World Health Organization indicators.',
      path: '/bmi-calculator',
      icon: <Activity className="h-6 w-6 text-blue-700" />,
      tag: 'Popular',
      category: 'Health',
    },
    {
      name: 'Days Between Dates Calculator',
      description: 'Calculate the exact number of days, business days, holidays, or weeks separating any two calendar dates.',
      path: '/days-between-dates',
      icon: <CalendarRange className="h-6 w-6 text-blue-700" />,
      tag: 'New',
      category: 'General',
    },
    {
      name: 'Discount Calculator',
      description: 'Estimate net prices, percentage savings, sales tax additions, and sequential double markdowns.',
      path: '/discount-calculator',
      icon: <Tag className="h-6 w-6 text-blue-700" />,
      tag: 'Financial',
      category: 'Financial',
    },
    {
      name: 'Loan Calculator',
      description: 'Formulate monthly amortization payments, total interest bills, and optimize schedules with extra payments.',
      path: '/loan-calculator',
      icon: <Coins className="h-6 w-6 text-blue-700" />,
      tag: 'Financial',
      category: 'Financial',
    },
    {
      name: 'Average Calculator',
      description: 'Find the statistical Mean, Median, Mode, standard deviation, and ranges of a custom list of values.',
      path: '/average-calculator',
      icon: <Hash className="h-6 w-6 text-blue-700" />,
      tag: 'Math',
      category: 'Math',
    },
    {
      name: 'Unit Converter',
      description: 'Convert global systems of measurement for Length, Weight, Area, Volume, and Temperature dynamically.',
      path: '/unit-converter',
      icon: <Scale className="h-6 w-6 text-blue-700" />,
      tag: 'Utility',
      category: 'Utility',
    },
    {
      name: 'GPA Calculator',
      description: 'Track academic semesters. Input credit weights and letter marks to solve cumulative grade averages.',
      path: '/gpa-calculator',
      icon: <GraduationCap className="h-6 w-6 text-blue-700" />,
      tag: 'Education',
      category: 'Education',
    },
    {
      name: 'Scientific Calculator',
      description: 'Utilize high precision trigonometric functions, powers, logarithms, brackets, and full order of operations.',
      path: '/scientific-calculator',
      icon: <Binary className="h-6 w-6 text-blue-700" />,
      tag: 'Math',
      category: 'Math',
    },
  ];

  // Filter list by query
  const filteredCalculators = calculatorList.filter(
    calc => 
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Popular calculators are specifically tagged or pre-selected
  const popularCalculators = calculatorList.filter(calc => calc.tag === 'Popular');

  return (
    <main className="min-h-screen bg-white py-12">
      <SEOManager metadata={homepageSEO} />

      {/* Global Top Banner Ad */}
      <AdSensePlaceholder type="top-banner" id="home-top-ad" />

      {/* Hero Header */}
      <section className="relative px-4 pt-12 pb-6 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight text-blue-800 leading-tight">
          Precision Calculators, <span className="text-blue-700">Nested in One Place.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-sans leading-relaxed">
          Lightning-fast, mobile-friendly mathematical tools built with elegant typography, complete privacy, and standard scholastic accuracy.
        </p>
      </section>

      {/* 1. SEARCH CALCULATOR SECTION */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto" id="home-search-section">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="home-calculator-search"
            type="text"
            placeholder="Search for a calculator... (e.g. Loan, GPA, Age)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white text-gray-900 font-sans shadow-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-700 outline-hidden transition-all text-sm sm:text-base placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-gray-400 hover:text-blue-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* 2. POPULAR CALCULATOR SECTION */}
      {!searchQuery && (
        <section className="px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="popular-calculators">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl sm:text-2xl font-sans font-extrabold text-blue-800">
              Popular Calculators
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularCalculators.map((calc, idx) => (
              <div
                key={calc.path}
                className="group relative rounded-2xl border border-blue-100/60 bg-blue-50/10 p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:border-blue-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50">
                      {calc.icon}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100/30">
                      Popular Choice
                    </span>
                  </div>
                  <h3 className="text-base font-sans font-extrabold text-blue-800 mb-1.5">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed mb-6">
                    {calc.description}
                  </p>
                </div>
                <Link
                  id={`popular-link-${idx}`}
                  to={calc.path}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors group-hover:translate-x-0.5 duration-150"
                >
                  Open Calculator &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. ALL CALCULATORS SECTION */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="all-calculators">
        <div className="space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-sans font-extrabold text-blue-800">
              {searchQuery ? `Search Results (${filteredCalculators.length})` : 'All Available Calculators'}
            </h2>
            <span className="text-xs font-mono font-bold text-gray-400">
              {filteredCalculators.length} Tools
            </span>
          </div>

          {filteredCalculators.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCalculators.map((calc, idx) => (
                <CalculatorCard key={calc.path} id={`all-calc-card-${idx}`} className="flex flex-col justify-between h-full p-5 hover:border-blue-100 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 border border-gray-150">
                        {calc.icon}
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-150/50">
                        {calc.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-sans font-bold text-blue-800 mb-1.5">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                      {calc.description}
                    </p>
                  </div>
                  <Link
                    id={`all-launch-${idx}`}
                    to={calc.path}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    Launch Calculator &rarr;
                  </Link>
                </CalculatorCard>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
              <HelpCircle className="h-10 w-10 text-gray-300 mx-auto mb-2 animate-pulse" />
              <h3 className="text-sm font-sans font-semibold text-blue-800">No calculators found</h3>
              <p className="text-xs text-gray-400 font-sans mt-1">Try adjusting your keyword or clear the search query.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Inline Ad Banner before Why Choose CalcNest? */}
      <AdSensePlaceholder type="top-banner" id="home-pre-whychoose-ad" />

      {/* 4. WHY CHOOSE CALCNEST SECTION */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100 mt-12 bg-gray-50/30 rounded-3xl" id="why-choose-us">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-700 uppercase">
            Platform Benchmarks
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-blue-800 mt-2">
            Why Choose CalcNest?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mt-2">
            A fresh approach to digital computations. Optimized for speed, reliability, and clean execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
            <Shield className="h-8 w-8 text-blue-700 mb-4" />
            <h3 className="font-sans font-bold text-blue-800 text-base mb-2">100% Client-Side Privacy</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              No input logs or values are submitted to high-latency servers. All code processes and triggers occur in real-time inside your browser's lightweight virtual environment.
            </p>
          </div>
          
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
            <Zap className="h-8 w-8 text-blue-700 mb-4" />
            <h3 className="font-sans font-bold text-blue-800 text-base mb-2">Ultra Fast Response</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              By removing bulky frameworks, tracking scripts, and infinite wrappers, the calculator engines compile math results instantly upon typing.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs sm:col-span-2 lg:col-span-1">
            <CheckCircle2 className="h-8 w-8 text-blue-700 mb-4" />
            <h3 className="font-sans font-bold text-blue-800 text-base mb-2">Verified Mathematical Standards</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              From correct BMI thresholds aligned with the WHO to academic GPA weightings and financial compounding rules, CalcNest conforms to official specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Inline Ad Banner before FAQ */}
      <AdSensePlaceholder type="in-content" id="home-pre-faq-ad" />

      {/* 5. FAQ SECTION */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-gray-100 mt-12" id="home-faq">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-sans font-extrabold text-blue-800">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-sans">
            Have questions about calculations and compliance? We have compiled the basics.
          </p>
        </div>

        <div className="space-y-4" id="faq-accordion-group">
          {homepageSEO.faqSchema?.map((faq: FAQItem, idx: number) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-xs"
              >
                <button
                  id={`faq-btn-${idx}`}
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50/50 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-sm sm:text-base font-sans font-bold text-blue-800 pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-blue-700 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-blue-700 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="p-5 pt-0 border-t border-gray-50 bg-gray-50/20"
                  >
                    <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Ad slot */}
      <AdSensePlaceholder type="bottom-ad" id="home-bottom-ad" />
    </main>
  );
}
