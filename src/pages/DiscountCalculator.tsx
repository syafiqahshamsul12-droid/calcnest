import React, { useState } from 'react';
import { BadgePercent, RotateCcw, Copy, Check, Info, Sparkles, TrendingDown, ArrowRight, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface DiscountResults {
  finalPrice: number;
  totalSaved: number;
  savingsFirst: number;
  savingsSecond: number;
  taxAmount: number;
}

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [secondDiscountPercent, setSecondDiscountPercent] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [results, setResults] = useState<DiscountResults | null>(null);
  const [priceError, setPriceError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const canonicalUrl = `${window.location.origin}/discount-calculator`;

  const seoData: SEOMetadata = {
    title: 'Discount Calculator - Find Sale Price & Savings',
    description: 'Calculate the exact final price, savings amount, and tax components on retail items. Supports dual stackable discounts and compound sales tax calculations.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'How do stackable discounts work?',
        answer: 'If you have two discounts (e.g., 20% off and an extra 10% coupon), the second discount is applied sequentially to the already-reduced price, rather than being added together (which would be 30%). This calculator handles this sequential step correctly.',
      },
      {
        question: 'Does this calculator include sales tax?',
        answer: 'Yes. You can optionally specify a sales tax percentage rate. Tax is automatically calculated based on the final discounted price, providing you with your exact cash register total.',
      },
      {
        question: 'What is the standard discount formula?',
        answer: 'The standard discount is found by: Sale Price = Original Price &times; (1 - Discount Rate / 100).',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Discount Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'FinancialApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const breadcrumbs = [
    { label: 'Discount Calculator', path: '/discount-calculator' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceError('');
    setDiscountError('');
    setCopied(false);

    const price = parseFloat(originalPrice);
    const disc1 = parseFloat(discountPercent);
    const disc2 = secondDiscountPercent ? parseFloat(secondDiscountPercent) : 0;
    const tax = taxPercent ? parseFloat(taxPercent) : 0;

    let hasError = false;

    if (isNaN(price) || price <= 0) {
      setPriceError('Please enter a valid original price greater than 0.');
      hasError = true;
    }
    if (isNaN(disc1) || disc1 < 0 || disc1 > 100) {
      setDiscountError('Please enter a valid percentage rate between 0 and 100.');
      hasError = true;
    }
    if (secondDiscountPercent && (isNaN(disc2) || disc2 < 0 || disc2 > 100)) {
      setDiscountError('Second discount must be a valid percentage between 0 and 100.');
      hasError = true;
    }

    if (hasError) {
      setResults(null);
      return;
    }

    // Calculation process
    const savingsFirst = price * (disc1 / 100);
    const intermediatePrice = price - savingsFirst;

    const savingsSecond = intermediatePrice * (disc2 / 100);
    const postDiscountPrice = intermediatePrice - savingsSecond;

    const taxAmount = postDiscountPrice * (tax / 100);
    const finalPrice = postDiscountPrice + taxAmount;

    const totalSaved = savingsFirst + savingsSecond;

    setResults({
      finalPrice,
      totalSaved,
      savingsFirst,
      savingsSecond,
      taxAmount,
    });
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setSecondDiscountPercent('');
    setTaxPercent('');
    setResults(null);
    setPriceError('');
    setDiscountError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    const p = parseFloat(originalPrice) || 0;
    const d1 = parseFloat(discountPercent) || 0;
    const d2 = secondDiscountPercent ? parseFloat(secondDiscountPercent) : 0;
    const tx = taxPercent ? parseFloat(taxPercent) : 0;

    const text = `🏷️ CALCNEST DISCOUNT ESTIMATOR REPORT 🏷️
-----------------------------------------
Original Price     : $${p.toFixed(2)}
Primary Discount   : ${d1}% (-$${results.savingsFirst.toFixed(2)})
${d2 > 0 ? `Secondary Discount : ${d2}% (-$${results.savingsSecond.toFixed(2)})\n` : ''}Sales Tax          : ${tx}% (+$${results.taxAmount.toFixed(2)})
-----------------------------------------
Total Savings      : $${results.totalSaved.toFixed(2)}
Final Checkout Cost: $${results.finalPrice.toFixed(2)}
-----------------------------------------
How it was calculated:
1. Primary Discount Savings: $${p.toFixed(2)} * (${d1} / 100) = $${results.savingsFirst.toFixed(2)}. Remaining balance: $${(p - results.savingsFirst).toFixed(2)}.
${d2 > 0 ? `2. Secondary Discount Savings: $${(p - results.savingsFirst).toFixed(2)} * (${d2} / 100) = $${results.savingsSecond.toFixed(2)}. Post-discount price: $${(p - results.totalSaved).toFixed(2)}.\n` : ''}${d2 > 0 ? '3' : '2'}. Sales Tax Application: $${(p - results.totalSaved).toFixed(2)} * (${tx} / 100) = $${results.taxAmount.toFixed(2)}.
${d2 > 0 ? '4' : '3'}. Final checkout sum: $${(p - results.totalSaved).toFixed(2)} + $${results.taxAmount.toFixed(2)} = $${results.finalPrice.toFixed(2)}.
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
        <Breadcrumb items={breadcrumbs} id="discount-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="discount-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Premium <span className="text-blue-700">Discount Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Instantly evaluate clearance sales, sequential coupon deductions, retail store bargains, and final tax-adjusted cart sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left inputs */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard
              id="discount-form-card"
              title="Sale Specifications"
              description="Enter initial value and rate parameters."
            >
              <form onSubmit={handleCalculate} className="space-y-5">
                <Input
                  id="original-price-input"
                  label="Original Price ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 79.99"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  error={priceError}
                />
                <Input
                  id="discount-percent-input"
                  label="Discount Percentage (%)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 25"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  error={discountError}
                />
                <Input
                  id="second-discount-input"
                  label="Additional Coupon/Discount (%) (Optional)"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 10 (Applied sequentially)"
                  value={secondDiscountPercent}
                  onChange={(e) => setSecondDiscountPercent(e.target.value)}
                />
                <Input
                  id="tax-percent-input"
                  label="Sales Tax Rate (%) (Optional)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 8.25"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    id="discount-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Calculate
                  </Button>
                  <Button
                    id="discount-reset-btn"
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
                <CalculatorCard id="discount-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Final checkout price</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-discount-btn"
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
                            <span className="text-xs font-semibold">Copy Result</span>
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
                      Final checkout total:
                    </div>
                    <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                      ${results.finalPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-green-100 bg-green-50/20 p-4 rounded-xl">
                      <div className="text-xs text-green-700 font-mono uppercase tracking-wider font-semibold">Total Savings</div>
                      <div className="text-2xl font-sans font-extrabold text-green-600 mt-1">
                        ${results.totalSaved.toFixed(2)}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Original Price</div>
                      <div className="text-2xl font-sans font-extrabold text-gray-600 mt-1">
                        ${parseFloat(originalPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Savings Step Breakdown */}
                {(secondDiscountPercent || taxPercent) && (
                  <CalculatorCard id="discount-step-breakdown" title="Detailed Deductions breakdown" className="border-l-4 border-l-blue-700">
                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between items-center py-1 border-b border-gray-50 text-gray-600">
                        <span>Original Tag Price:</span>
                        <span className="font-semibold">${parseFloat(originalPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-50 text-gray-600">
                        <span>Primary Discount ({discountPercent}%):</span>
                        <span className="text-red-600 font-semibold">-${results.savingsFirst.toFixed(2)}</span>
                      </div>
                      {secondDiscountPercent && (
                        <div className="flex justify-between items-center py-1 border-b border-gray-50 text-gray-600">
                          <span>Secondary Coupon Discount ({secondDiscountPercent}%):</span>
                          <span className="text-red-600 font-semibold">-${results.savingsSecond.toFixed(2)}</span>
                        </div>
                      )}
                      {taxPercent && (
                        <div className="flex justify-between items-center py-1 border-b border-gray-50 text-gray-600">
                          <span>Sales Tax ({taxPercent}%):</span>
                          <span className="text-blue-800 font-semibold">+${results.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </CalculatorCard>
                )}

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-disc"
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
                      <p>Here is exactly how your discount checkout was calculated:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Apply Primary Discount:</strong> Subtracted {discountPercent}% from the original price (${parseFloat(originalPrice).toFixed(2)}), saving <strong>${results.totalSaved.toFixed(2)}</strong>. This results in a subtotal of <strong>${(parseFloat(originalPrice) - results.savingsFirst).toFixed(2)}</strong>.</li>
                        {secondDiscountPercent && (
                          <li><strong>Apply Secondary Discount:</strong> Subtracted {secondDiscountPercent}% from the subtotal, saving an additional <strong>${results.savingsSecond.toFixed(2)}</strong>. Subtotal becomes <strong>${(parseFloat(originalPrice) - results.savingsFirst - results.savingsSecond).toFixed(2)}</strong>.</li>
                        )}
                        {taxPercent && (
                          <li><strong>Apply Sales Tax:</strong> Added {taxPercent}% sales tax to the final reduced price, adding <strong>${results.taxAmount.toFixed(2)}</strong> to the total.</li>
                        )}
                        <li><strong>Sum total:</strong> The final checkout amount after all discounts and taxes is <strong>${results.finalPrice.toFixed(2)}</strong>.</li>
                      </ol>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <BadgePercent className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Price Inputs</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Enter the original sticker price and primary sale percentage to compute your savings and final checkout metrics.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="disc-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Calculate Sale Pricing</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Write down the primary original price of the asset or merchandise.</li>
                <li>Enter the direct percentage markdown rate.</li>
                <li>Add optional promotional codes or additional sequential markdowns if applicable.</li>
                <li>Input local sales taxes to fetch your final out-of-pocket pricing directly.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Mathematical Formula</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                Calculations are sequentially processed as follow:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 space-y-1.5">
                <div>Price after Discount 1 = Price &times; (1 - D1/100)</div>
                <div>Price after Discount 2 = Reduced Price &times; (1 - D2/100)</div>
                <div>Checkout Price = Final Reduced Price &times; (1 + Tax/100)</div>
              </div>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Real-World Examples</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">25% Store Clearance:</strong>
                <p className="mt-1">A jacket priced at $100 has a 25% discount. This saves exactly **$25.00**, making the final cost **$75.00** before tax.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Double Coupons with Tax:</strong>
                <p className="mt-1">A $200 TV with a 30% store discount + an extra 10% coupon + 8.25% sales tax costs **$136.40** check-out total (Savings of $74.00).</p>
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
                <strong>1. Original Price Boundary:</strong> Setting prices to negative values or zero triggers a validation error. Make sure to input positive integers or floats (e.g. $49.99).
              </p>
              <p>
                <strong>2. Incorrect Cumulative Addition:</strong> Standard shoppers frequently add sequential discounts (e.g., 20% + 10% = 30%). Retail systems do not do this; they apply the second discount on the remaining balance. Our code mirrors standard point-of-sale behavior perfectly.
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
              <Link to="/days-between-dates" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Days Between Dates &rarr;
              </Link>
              <Link to="/bmi-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                BMI Calculator &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AdSensePlaceholder type="bottom-ad" id="discount-bottom-ad" />
      </div>
    </main>
  );
}
