import React, { useState } from 'react';
import { Calendar, RotateCcw, Copy, Check, Info, Sparkles, Clock, ArrowRight, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface DateBreakdown {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  weeks: number;
  remainingDays: number;
  businessDays: number;
  weekendDays: number;
}

export default function DaysBetweenDates() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeLastDay, setIncludeLastDay] = useState(false);
  const [results, setResults] = useState<DateBreakdown | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const canonicalUrl = `${window.location.origin}/days-between-dates`;

  const seoData: SEOMetadata = {
    title: 'Days Between Dates Calculator - Exact Time Duration',
    description: 'Calculate the exact number of days, weeks, months, and business days between any two dates. Free, fast, and highly accurate date duration calculator.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'How does the Days Between Dates Calculator count days?',
        answer: 'It calculates the time duration between two dates using standard calendar rules, precisely accounting for leap years and the differing lengths of calendar months. You can also toggle whether to include the final end day in the total count.',
      },
      {
        question: 'What are business days?',
        answer: 'Business days refer to standard working days, typically Monday through Friday, excluding weekends (Saturday and Sunday). This calculator automatically isolates and counts business days versus weekend days.',
      },
      {
        question: 'Does this calculator handle leap years?',
        answer: 'Yes, because it utilizes standard JavaScript Date logic, it accounts perfectly for leap years (including February 29th) and correct calendar days per month.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Days Between Dates Calculator',
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
    { label: 'Days Between Dates Calculator', path: '/days-between-dates' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      setResults(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    let totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (includeLastDay) {
      totalDays += 1;
    }

    // Business days vs weekend days calculation
    let businessDays = 0;
    let weekendDays = 0;
    const tempDate = new Date(start < end ? start : end);
    const stopDate = new Date(start < end ? end : start);

    if (includeLastDay) {
      // iterate through all days inclusive
      while (tempDate <= stopDate) {
        const day = tempDate.getDay();
        if (day === 0 || day === 6) {
          weekendDays++;
        } else {
          businessDays++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
    } else {
      // iterate excluding the last day
      while (tempDate < stopDate) {
        const day = tempDate.getDay();
        if (day === 0 || day === 6) {
          weekendDays++;
        } else {
          businessDays++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
    }

    // Years, Months, Days breakdown
    const early = start < end ? start : end;
    const late = new Date(start < end ? end : start);
    if (includeLastDay) {
      late.setDate(late.getDate() + 1);
    }

    let years = late.getFullYear() - early.getFullYear();
    let months = late.getMonth() - early.getMonth();
    let days = late.getDate() - early.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(late.getFullYear(), late.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    setResults({
      totalDays,
      years,
      months,
      days,
      weeks,
      remainingDays,
      businessDays,
      weekendDays,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setIncludeLastDay(false);
    setResults(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    const text = `📅 CALCNEST DATE SPACING REPORT 📅
-----------------------------------------
Start Date         : ${startDate}
End Date           : ${endDate}
Total Days         : ${results.totalDays} days
Alternative Formats: ${results.years} Years, ${results.months} Months, ${results.days} Days
Weeks Breakdown    : ${results.weeks} Weeks and ${results.remainingDays} Days
Business Days      : ${results.businessDays} (Mon-Fri)
Weekend Days       : ${results.weekendDays} (Sat-Sun)
-----------------------------------------
How it was calculated:
1. Total Days: Obtained the absolute difference in milliseconds between ${startDate} and ${endDate} and converted it to whole days (1 day = 86,400,000 milliseconds)${includeLastDay ? " with the final date included (+1 day)" : ""}.
2. Calendar Span: Deducted calendar years and months sequentially, accommodating variable Gregorian month lengths.
3. Business Days: Iterated through each day in the range to count week days (Monday through Friday) vs weekends (Saturday and Sunday).
-----------------------------------------
Evaluate yours at: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="days-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="days-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Days Between <span className="text-blue-700">Dates Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Quickly measure the exact spacing, days, business weeks, and weekend intervals between two specified calendar events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel inputs */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard
              id="days-form-card"
              title="Time Duration Criteria"
              description="Provide the calendar bounds to measure."
            >
              <form onSubmit={handleCalculate} className="space-y-5">
                <Input
                  id="start-date-input"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  error={error && !startDate ? error : undefined}
                />
                <Input
                  id="end-date-input"
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  error={error && !endDate ? error : undefined}
                />

                <div className="flex items-center gap-3.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    id="include-last-day-checkbox"
                    type="checkbox"
                    checked={includeLastDay}
                    onChange={(e) => setIncludeLastDay(e.target.checked)}
                    className="h-4 w-4 text-blue-700 border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
                  />
                  <label htmlFor="include-last-day-checkbox" className="text-sm text-gray-700 font-sans font-medium cursor-pointer">
                    Include final end day in calculation (+1 day)
                  </label>
                </div>

                {error && <p className="text-xs text-red-600 font-sans font-medium">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button
                    id="days-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Calculate
                  </Button>
                  <Button
                    id="days-reset-btn"
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    className="p-2.5"
                    title="Reset Inputs"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CalculatorCard>
          </section>

          {/* Right panel outputs */}
          <section className="lg:col-span-7">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Primary Card - Score Panel */}
                <CalculatorCard id="days-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Duration Metrics</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-days-btn"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs text-green-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span className="text-xs font-semibold">Copy Results</span>
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

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center mb-6">
                    <div className="text-sm text-gray-500 font-sans">
                      Total elapsed duration:
                    </div>
                    <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                      {results.totalDays.toLocaleString()} Days
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-100/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Years, Months, Days</div>
                      <div className="text-md font-sans font-bold text-blue-800 mt-1">
                        {results.years} Years, {results.months} Months, {results.days} Days
                      </div>
                    </div>
                    <div className="border border-gray-100/80 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Weeks & Remaining Days</div>
                      <div className="text-md font-sans font-bold text-blue-800 mt-1">
                        {results.weeks} Weeks, {results.remainingDays} Days
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Business days detail card */}
                <CalculatorCard id="days-workday-breakdown" title="Working vs Weekend Breakdown" className="border-l-4 border-l-blue-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 font-sans font-semibold">Business Days (Mon-Fri)</div>
                      <div className="text-2xl font-sans font-extrabold text-blue-800 mt-1">{results.businessDays}</div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center">
                      <div className="text-xs text-gray-500 font-sans font-semibold">Weekend Days (Sat-Sun)</div>
                      <div className="text-2xl font-sans font-extrabold text-gray-600 mt-1">{results.weekendDays}</div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-days"
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
                      <p>Here is exactly how the duration calculation was computed:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Standardize Time Bounds:</strong> To prevent local DST or timezone shift errors, both dates (<strong>{startDate}</strong> and <strong>{endDate}</strong>) are set strictly to local midnight (00:00:00).</li>
                        <li><strong>Millisecond Delta conversion:</strong> Subtracted the two dates in absolute milliseconds and divided the result by 86,400,000 (the milliseconds in one day) to obtain <strong>{results.totalDays - (includeLastDay ? 1 : 0)}</strong> calendar days.</li>
                        {includeLastDay && (
                          <li><strong>Inclusive Boundary:</strong> Added 1 additional day to include the final ending date as part of the total timeline, resulting in <strong>{results.totalDays}</strong> total days.</li>
                        )}
                        <li><strong>Scholastic Year/Month Span:</strong> Deducted full calendar years and months sequentially, accommodating varying length of Gregorian calendar months.</li>
                        <li><strong>Business Days Loop:</strong> Iterated through every single day within the date range, checking if the day falls on Monday through Friday (business days: <strong>{results.businessDays}</strong>) vs Saturday and Sunday (weekends: <strong>{results.weekendDays}</strong>).</li>
                      </ol>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Timeline Criteria</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Enter your start date and end date on the left board to compute complete time increments instantly.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="days-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Use the Calculator</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Select the starting date using the calendar input.</li>
                <li>Choose the destination ending date on the second input.</li>
                <li>Select whether you want to include the ending day itself as a full additional day of timeline.</li>
                <li>Click the **Calculate** button to immediately examine your days, business weeks, and weekend ratio metrics.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Date Calculation Logic</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                Calculations are computed by isolating the absolute millisecond spacing between the midnight bounds of both dates:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                Total Days = Math.floor( |EndDate - StartDate| / (1000 × 60 × 60 × 24) )
              </div>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Example Calculations</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Standard Project Spacing:</strong>
                <p className="mt-1">From Jan 1, 2026 to Mar 1, 2026. Without last day, this is exactly **59 days** (composed of 41 business days and 18 weekend days).</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Short Turnaround (Inclusive):</strong>
                <p className="mt-1">From Oct 10 to Oct 15 with **Include Last Day** checked. This returns exactly **6 full days** instead of 5.</p>
              </div>
            </div>
          </div>

          {/* Interactive Debugging & Error Guide */}
          <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
            <div className="flex items-center gap-2 text-red-800 mb-3">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-md font-sans font-bold">Error Prevention & Debugging Guide</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
              <p>
                <strong>1. Empty Input States:</strong> If you see the message <em>"Please select both start and end dates,"</em> ensure that both fields are populated using valid calendar formats in your web browser.
              </p>
              <p>
                <strong>2. Standard Timezone Offsets:</strong> Standard date objects in browser JS can sometimes parse string inputs as UTC, shifting results by 1 day if timezones cross midnight. CalcNest prevents this by forcing time fields to midnight (00:00:00) relative to local timezone metrics.
              </p>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="border-t border-gray-100 pt-12 text-center">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-4">Related Calculators</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/age-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Age Calculator &rarr;
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

        <AdSensePlaceholder type="bottom-ad" id="days-bottom-ad" />
      </div>
    </main>
  );
}
