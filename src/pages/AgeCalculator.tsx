import React, { useState } from 'react';
import { Calendar, RotateCcw, Copy, Check, Info, Gift, Sparkles, Clock, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface AgeResults {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBdayDaysTotal: number;
  nextBdayMonths: number;
  nextBdayDays: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<AgeResults | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Today's date string in YYYY-MM-DD format to set as maximum
  const todayStr = new Date().toISOString().split('T')[0];

  const seoData: SEOMetadata = {
    title: 'Age Calculator - Calculate Your Exact Age Online',
    description: 'Calculate your exact age in years, months, weeks, days, hours, and minutes. Check countdown to your next birthday with our fast, free, AdSense-ready tool.',
    canonicalUrl: `${window.location.origin}/age-calculator`,
    faqSchema: [
      {
        question: 'How is my exact age calculated?',
        answer: 'CalcNest calculates age by subtracting your birthdate from the current date. It adjusts precisely for leap years and the varying number of days in each calendar month to give you the exact years, months, and days.',
      },
      {
        question: 'How many days until my next birthday?',
        answer: 'Our tool calculates your next birthday date by setting your birth month and day to the current year (or next year if it has already passed), and then counts down the exact months and days remaining.',
      },
      {
        question: 'Is my birth date safe with CalcNest?',
        answer: 'Yes! All calculations are computed entirely inside your web browser. No dates or private information are sent to external servers or logged anywhere.',
      },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Age Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'UtilityApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const breadcrumbs = [
    { label: 'Age Calculator', path: '/age-calculator' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    if (!birthDate) {
      setError('Please select your birth date to begin.');
      setResults(null);
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    // Normalize times to midnight to ensure exact day calculations
    birth.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (birth > today) {
      setError('Birth date cannot be in the future.');
      setResults(null);
      return;
    }

    // Exact years, months, days calculations
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Borrow days from the previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total counts
    const totalMs = today.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;

    // Next Birthday Countdown
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    nextBday.setHours(0, 0, 0, 0);

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const nextBdayMs = nextBday.getTime() - today.getTime();
    const nextBdayDaysTotal = Math.floor(nextBdayMs / (1000 * 60 * 60 * 24));

    // Calculate exact months & days remaining for next birthday
    let nextBdayMonths = nextBday.getMonth() - today.getMonth();
    let nextBdayDays = nextBday.getDate() - today.getDate();

    if (nextBdayDays < 0) {
      nextBdayMonths--;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      nextBdayDays += prevMonth.getDate();
    }

    if (nextBdayMonths < 0) {
      nextBdayMonths += 12;
    }

    setResults({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      nextBdayDaysTotal,
      nextBdayMonths,
      nextBdayDays,
    });
  };

  const handleReset = () => {
    setBirthDate('');
    setResults(null);
    setError('');
    setCopied(false);
  };

  const handleCopyResults = () => {
    if (!results) return;

    const summaryText = `🎂 CALCNEST AGE CALCULATOR REPORT 🎂
------------------------------------------
Exact Age      : ${results.years} Years, ${results.months} Months, ${results.days} Days
Total Months   : ${results.totalMonths.toLocaleString()} Months
Total Weeks    : ${results.totalWeeks.toLocaleString()} Weeks
Total Days     : ${results.totalDays.toLocaleString()} Days

🎁 NEXT BIRTHDAY COUNTDOWN:
${results.nextBdayMonths} Months and ${results.nextBdayDays} Days remaining (Total: ${results.nextBdayDaysTotal} days)
------------------------------------------
How it was calculated:
1. Exact Age: Determined by subtracting the birth date (${birthDate}) from today's reference date with logical day/month borrows based on the actual lengths of intervening Gregorian calendar months (28, 30, or 31 days).
2. Total Days: Divided the total millisecond difference by 86,400,000.
3. Next Birthday: Computed by generating the upcoming birthday date based on current age, then subtracting today's reference date.
------------------------------------------
Calculate yours at: ${window.location.href}`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      {/* 1. Google AdSense - TOP BANNER */}
      <AdSensePlaceholder type="top-banner" id="age-top-ad" />

      <div className="max-w-4xl mx-auto mt-8">
        <Breadcrumb items={breadcrumbs} id="age-calculator-breadcrumbs" />

        {/* Dynamic header styling with text-blue-700 / text-blue-800 */}
        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Exact <span className="text-blue-700">Age Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Get precision age breakdowns down to years, months, weeks, and days. Track milestones, and count down to your next celebration instantly.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          {/* Left panel: Input Form */}
          <section className="md:col-span-5">
            <CalculatorCard id="age-input-card" title="Birth Details" description="Select your date of birth to evaluate your metrics.">
              <form onSubmit={handleCalculate} className="space-y-6">
                <Input
                  id="birthdate-field"
                  label="Select Date of Birth"
                  type="date"
                  max={todayStr}
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  rightIcon={<Calendar className="h-4 w-4" />}
                />

                <div className="flex gap-3">
                  <Button
                    id="calculate-age-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    Calculate
                  </Button>
                  <Button
                    id="reset-age-btn"
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    title="Reset Form"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CalculatorCard>

            <div className="mt-6 p-4.5 bg-gray-50/70 border border-gray-100 rounded-2xl flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-500 font-sans leading-relaxed">
                <span className="font-semibold text-blue-700">Privacy Notice:</span> Your computation runs locally in your browser sandbox. No date parameters are processed or logged server-side.
              </div>
            </div>
          </section>

          {/* Right panel: Live Results Display */}
          <section className="md:col-span-7">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Primary Card - Big Exact Age */}
                <CalculatorCard id="age-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Your Exact Age</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-age-report-btn"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyResults}
                        className="flex items-center gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span className="text-xs">Copy Report</span>
                          </>
                        )}
                      </Button>
                      {copied && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute right-0 bottom-full mb-2 z-50 whitespace-nowrap bg-blue-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1 border border-blue-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                          Copied with details!
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Primary Grid metric display */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl border border-gray-100/50 transition-colors">
                      <div className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800">{results.years}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Years</div>
                    </div>
                    <div className="bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl border border-gray-100/50 transition-colors">
                      <div className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800">{results.months}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Months</div>
                    </div>
                    <div className="bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl border border-gray-100/50 transition-colors">
                      <div className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800">{results.days}</div>
                      <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Days</div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Secondary Card - Next Birthday Countdown */}
                <CalculatorCard id="age-results-birthday" title="Birthday Countdown" className="border-l-4 border-l-blue-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                      <Gift className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-md font-sans font-bold text-blue-800 mb-1">
                        Next Birthday Countdown
                      </h4>
                      <p className="text-sm text-gray-500 font-sans leading-relaxed">
                        You have <span className="font-bold text-blue-800">{results.nextBdayMonths} Months</span> and <span className="font-bold text-blue-800">{results.nextBdayDays} Days</span> remaining until your next celebration.
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 text-xs font-mono text-gray-500">
                        <Clock className="h-3 w-3" />
                        Total: {results.nextBdayDaysTotal} Days left
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Extra Stats Card */}
                <CalculatorCard id="age-results-breakdown" title="Alternate Conversions">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-gray-100/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Months</div>
                      <div className="text-xl font-sans font-extrabold text-blue-800 mt-1">
                        {results.totalMonths.toLocaleString()}
                      </div>
                    </div>
                    <div className="border border-gray-100/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Weeks</div>
                      <div className="text-xl font-sans font-extrabold text-blue-800 mt-1">
                        {results.totalWeeks.toLocaleString()}
                      </div>
                    </div>
                    <div className="border border-gray-100/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Days</div>
                      <div className="text-xl font-sans font-extrabold text-blue-800 mt-1">
                        {results.totalDays.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-age"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-50/50 hover:bg-blue-50 text-blue-800 rounded-xl border border-blue-100/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold">Show Calculation Steps</span>
                    </div>
                    {showSteps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  {showSteps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 bg-gray-50 border border-gray-150 rounded-xl p-5 text-xs text-gray-500 font-sans leading-relaxed space-y-3"
                    >
                      <h4 className="font-bold text-blue-800 text-sm">Step-by-Step Mathematical Logic:</h4>
                      <p>Here is exactly how the system calculated your age:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Determine Reference Points:</strong> The starting date is set to your birthday (<strong>{birthDate}</strong>) and the ending date is set to today's date.</li>
                        <li><strong>Calculate Year Delta:</strong> Subtracted birth year from target year. If today's calendar month/day falls before the birth month/day, we subtract 1 from the total years.</li>
                        <li><strong>Calculate Month Delta:</strong> Subtracted birth month from target month. If target day falls before the birth day, we subtract 1 from months and borrow days from the previous month.</li>
                        <li><strong>Calculate Day Delta:</strong> Computed the remaining days based on the length of the specific month preceding the target date.</li>
                        <li><strong>Calculate Total Days:</strong> Subtracted the two dates in absolute milliseconds and divided the result by 86,400,000 to obtain <strong>{results.totalDays.toLocaleString()}</strong> total days.</li>
                      </ol>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[280px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Birth Date</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Enter your exact birthdate details in the input panel to fetch your live tracking results instantly.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 2. Google AdSense - IN CONTENT AD */}
      <AdSensePlaceholder type="in-content" id="age-mid-ad" />

      {/* Educational Resources & Deep Informational Content */}
      <section className="max-w-4xl mx-auto border-t border-gray-100 mt-16 pt-12 space-y-12">
        
        {/* How to Use & Formula */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-3">How to Use the Age Calculator</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
              <li>Enter your correct Date of Birth inside the input selector.</li>
              <li>Press the **Calculate** button to initiate the chronological parsing algorithm.</li>
              <li>Explore your exact age broken down into years, months, and days.</li>
              <li>Review your next birthday countdown metrics and total days/weeks conversion tables.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-3">Mathematical Logic & Formula</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
              Age is evaluated by taking the current date vector and subtracting the birth date vector, with manual borrow operations for calendar month variances:
            </p>
            <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl font-mono text-[11px] text-gray-500 text-center">
              Age = (CurrentDate - BirthDate) adjusting for Leaps & Monthly Days (28/30/31)
            </div>
          </div>
        </div>

        {/* Practical Example Case */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-md font-sans font-extrabold text-blue-800 mb-2">Practical Calculation Example</h3>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
            <strong>Case study:</strong> If Alex was born on <strong>October 12, 2000</strong> and calculates his age on <strong>July 18, 2026</strong>:
            <br />
            - <strong>Full Years completed:</strong> 25 years (Since October 2025).
            <br />
            - <strong>Additional Months:</strong> 9 months completed (October to June).
            <br />
            - <strong>Remaining Days:</strong> 6 days (June 12 to July 18, with monthly day lending).
          </p>
        </div>

        {/* FAQ Segment */}
        <div className="space-y-4">
          <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-4 text-center">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5 border border-gray-100 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-blue-800 mb-1">How are leap years handled?</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Leap years are automatically resolved because the underlying JavaScript timezone offset is mapped to actual Gregorian solar leap cycles, preventing off-by-one errors.
              </p>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-blue-800 mb-1">Are hours and minutes supported?</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Yes, our system estimates total elapsed days which can be mathematically projected into hours or minutes for precise developmental trackers.
              </p>
            </div>
          </div>
        </div>

        {/* Related Calculators links */}
        <div className="pt-10 text-center">
          <h4 className="text-sm font-sans font-bold text-blue-800 mb-4">Related Calculators</h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/days-between-dates" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              Days Between Dates &rarr;
            </Link>
            <Link to="/percentage-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              Percentage Calculator &rarr;
            </Link>
            <Link to="/bmi-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              BMI Calculator &rarr;
            </Link>
          </div>
        </div>

      </section>

      {/* 3. Google AdSense - BOTTOM AD */}
      <AdSensePlaceholder type="bottom-ad" id="age-bottom-ad" />
    </main>
  );
}


