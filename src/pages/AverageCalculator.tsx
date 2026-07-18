import React, { useState } from 'react';
import { RefreshCw, RotateCcw, Copy, Check, Info, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface AverageResults {
  mean: number;
  median: number;
  mode: number[];
  sum: number;
  count: number;
  range: number;
  min: number;
  max: number;
  stdDev: number;
}

export default function AverageCalculator() {
  const [numberInput, setNumberInput] = useState('');
  const [results, setResults] = useState<AverageResults | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const canonicalUrl = `${window.location.origin}/average-calculator`;

  const seoData: SEOMetadata = {
    title: 'Average Calculator - Mean, Median, Mode & SD Solver',
    description: 'Calculate average (arithmetic mean), median, mode, sum, range, and standard deviation of a dataset. Paste CSV values, spaces, or list entries directly.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'What is the difference between Mean, Median, and Mode?',
        answer: 'The Mean is the sum of all values divided by the total count. The Median is the middle number when sorted chronologically. The Mode is the number(s) that appear most frequently in the dataset.',
      },
      {
        question: 'How does the parser handle separators?',
        answer: 'CalcNest accepts raw values separated by commas, spaces, semi-colons, or carriage returns. This lets you paste rows or columns from spreadsheet software like Microsoft Excel or Google Sheets seamlessly.',
      },
      {
        question: 'What is Standard Deviation?',
        answer: 'Standard deviation (SD) is a statistic that measures the dispersion of a dataset relative to its mean. A lower SD indicates values are clustered close to the mean, while a high SD indicates wider dispersion.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Average Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'MathApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const breadcrumbs = [
    { label: 'Average Calculator', path: '/average-calculator' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    if (!numberInput.trim()) {
      setError('Please write or paste a sequence of numbers to analyze.');
      setResults(null);
      return;
    }

    // Parse input (splits by comma, whitespace, semi-colon, or newline)
    const rawItems = numberInput.split(/[,\s;|\n]+/);
    const numbers: number[] = [];

    for (const item of rawItems) {
      if (item.trim() === '') continue;
      const num = parseFloat(item);
      if (isNaN(num)) {
        setError(`"${item}" is not a valid number. Check your separators.`);
        setResults(null);
        return;
      }
      numbers.push(num);
    }

    if (numbers.length === 0) {
      setError('Please input at least one valid numerical value.');
      setResults(null);
      return;
    }

    // Calculations
    const count = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // Median
    const sorted = [...numbers].sort((a, b) => a - b);
    let median = 0;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    for (const n of numbers) {
      freq[n] = (freq[n] || 0) + 1;
      if (freq[n] > maxFreq) {
        maxFreq = freq[n];
      }
    }
    const mode: number[] = [];
    if (maxFreq > 1) {
      for (const [key, value] of Object.entries(freq)) {
        if (value === maxFreq) {
          mode.push(parseFloat(key));
        }
      }
    }

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    // Standard Deviation
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    setResults({
      mean,
      median,
      mode,
      sum,
      count,
      range,
      min,
      max,
      stdDev,
    });
  };

  const handleReset = () => {
    setNumberInput('');
    setResults(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    const modeStr = results.mode.length > 0 ? results.mode.join(', ') : 'None';
    const text = `📊 CALCNEST STATISTICAL ANALYSIS REPORT 📊
-----------------------------------------
Dataset Size       : ${results.count} items
Mean (Average)     : ${results.mean.toFixed(4)}
Median (Middle)    : ${results.median.toFixed(4)}
Mode (Frequent)    : ${modeStr}
Range (Spread)     : ${results.range}
Sum (Total)        : ${results.sum}
Std Deviation      : ${results.stdDev.toFixed(4)}
-----------------------------------------
How it was calculated:
1. Mean (Average): Sum of all dataset elements (${results.sum}) divided by the dataset count (${results.count}). Formula: Mean = Sum / Count.
2. Median: Reordered the dataset ascending, then selected the exact middle-most value (or averaged the two middle elements).
3. Mode: Counted frequencies of each unique value and selected the value(s) with the highest frequency (${modeStr}).
4. Standard Deviation (Population): Obtained the square root of the average of the squared deviations from the Mean.
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
        <Breadcrumb items={breadcrumbs} id="average-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="average-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Scientific <span className="text-blue-700">Average Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Analyze datasets effortlessly. Enter numbers separated by commas, spaces, or lines to solve Mean, Median, Mode, and Standard Deviation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left inputs */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard
              id="average-form-card"
              title="Number Array Dataset"
              description="Write down numbers separated by spacing or commas."
            >
              <form onSubmit={handleCalculate} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="number-sequence-textarea" className="text-sm font-medium text-gray-700">
                    Numeric Entries
                  </label>
                  <textarea
                    id="number-sequence-textarea"
                    rows={6}
                    placeholder="e.g. 12, 15, 10, 24, 15, 30"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    className="w-full font-sans text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-gray-950 focus:border-gray-950 transition-all duration-150 outline-hidden"
                  />
                  <p className="text-[11px] text-gray-400 font-sans">
                    Supports spreadsheets copy-paste columns directly.
                  </p>
                </div>

                {error && <p className="text-xs text-red-600 font-sans font-medium">{error}</p>}

                <div className="flex gap-3">
                  <Button
                    id="average-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Analyze Dataset
                  </Button>
                  <Button
                    id="average-reset-btn"
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

          {/* Right outputs */}
          <section className="lg:col-span-7">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <CalculatorCard id="average-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Descriptive Metrics</h3>
                    </div>
                    <Button
                      id="copy-average-btn"
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
                          <span className="text-xs font-semibold">Copy Statistics</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center mb-6">
                    <div className="text-sm text-gray-500 font-sans">
                      Arithmetic Mean (Average):
                    </div>
                    <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                      {results.mean % 1 === 0 ? results.mean : Number(results.mean.toFixed(4))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Median</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1">
                        {results.median}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Mode</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1 truncate">
                        {results.mode.length > 0 ? results.mode.join(', ') : 'None'}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Std Dev (σ)</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1">
                        {Number(results.stdDev.toFixed(4))}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Sum</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1">
                        {results.sum}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Count (N)</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1">
                        {results.count}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-3 rounded-xl text-center">
                      <div className="text-[10px] text-gray-400 font-mono uppercase">Range</div>
                      <div className="text-md font-sans font-extrabold text-blue-800 mt-1">
                        {results.range}
                      </div>
                    </div>
                  </div>
                </CalculatorCard>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <RefreshCw className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Dataset Entries</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Enter your numerical observations separated by commas or empty spaces on the input panel to solve descriptive metrics.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="average-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Use the Average Calculator</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Type your sequence of numbers in the input field.</li>
                <li>Ensure numbers are separated using commas, spaces, or lines.</li>
                <li>Avoid adding alphabetic letters or non-numeric elements.</li>
                <li>Click **Analyze Dataset** to review averages, standard deviation, and median charts.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Key Formulas</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                Our code uses standard statistical formulas:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 space-y-1.5">
                <div>Arithmetic Mean (&mu;) = &Sigma;X<sub>i</sub> / N</div>
                <div>Standard Deviation (&sigma;) = &radic;( &Sigma;(X<sub>i</sub>-&mu;)<sup>2</sup> / N )</div>
              </div>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Example Calculations</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Basic Set Average:</strong>
                <p className="mt-1">Inputting <strong>4, 8, 12, 16, 20</strong> returns an Average of **12**, a Median of **12**, Range of **16**, and SD of **5.6569**.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Multi-Mode Set:</strong>
                <p className="mt-1">Inputting <strong>1, 2, 2, 3, 3, 4</strong> returns Modes **2, 3** because both values appear twice in the dataset.</p>
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
                <strong>1. Text Parsing Characters:</strong> Writing characters like letters (e.g. <em>"12a"</em>) or spelling out numbers will result in a parsing error. Only enter numerical values.
              </p>
              <p>
                <strong>2. Multiple separators:</strong> Multiple separators in a row (e.g. <em>"12,, , 15"</em>) are automatically skipped by our robust regular expression parser to avoid skewing counts.
              </p>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="border-t border-gray-100 pt-12 text-center">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-4">Related Calculators</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/percentage-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Percentage Calculator &rarr;
              </Link>
              <Link to="/gpa-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                GPA Calculator &rarr;
              </Link>
              <Link to="/days-between-dates" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Days Between Dates &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AdSensePlaceholder type="bottom-ad" id="average-bottom-ad" />
      </div>
    </main>
  );
}
