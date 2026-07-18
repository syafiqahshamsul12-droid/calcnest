import React, { useState } from 'react';
import { Coins, RotateCcw, Copy, Check, Info, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface LoanResults {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortization: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }[];
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [extraPayment, setExtraPayment] = useState('');
  const [results, setResults] = useState<LoanResults | null>(null);
  const [amountError, setAmountError] = useState('');
  const [rateError, setRateError] = useState('');
  const [termError, setTermError] = useState('');
  const [copied, setCopied] = useState(false);

  const canonicalUrl = `${window.location.origin}/loan-calculator`;

  const seoData: SEOMetadata = {
    title: 'Loan Calculator - Amortization & Monthly Payments',
    description: 'Calculate monthly loan payments, total interest costs, and early payoff schedules. Supports custom interest rates, loan terms, and extra payments.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'What is loan amortization?',
        answer: 'Amortization is the process of spreading out a loan into a series of equal periodic payments. Over time, the portion of each payment that goes toward interest decreases, while the portion going toward principal increases.',
      },
      {
        question: 'How do extra monthly payments affect my loan?',
        answer: 'Paying extra each month goes directly toward reducing the loan principal. This shrinks the outstanding balance faster, shortening the duration of the loan and saving you money on total interest charges.',
      },
      {
        question: 'Does this calculator handle compound interest?',
        answer: 'Yes, it computes loan amortization using standard compounding monthly interest rate formulas commonly used by commercial banks and mortgage lenders.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Loan Calculator',
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
    { label: 'Loan Calculator', path: '/loan-calculator' }
  ];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError('');
    setRateError('');
    setTermError('');
    setCopied(false);

    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);
    const extra = extraPayment ? parseFloat(extraPayment) : 0;

    let hasError = false;

    if (isNaN(principal) || principal <= 0) {
      setAmountError('Please enter a valid loan amount greater than 0.');
      hasError = true;
    }
    if (isNaN(annualRate) || annualRate < 0 || annualRate > 100) {
      setRateError('Please enter an annual interest rate between 0% and 100%.');
      hasError = true;
    }
    if (isNaN(term) || term <= 0) {
      setTermError('Please enter a valid loan term.');
      hasError = true;
    }

    if (hasError) {
      setResults(null);
      return;
    }

    // Convert term to months
    const totalMonths = termUnit === 'years' ? term * 12 : term;
    
    // Monthly interest rate
    const monthlyRate = (annualRate / 100) / 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    // Amortization list
    let balance = principal;
    let totalInterest = 0;
    const amortization: LoanResults['amortization'] = [];

    for (let m = 1; m <= totalMonths; m++) {
      if (balance <= 0) break;

      const interestPayment = balance * monthlyRate;
      let principalPayment = (monthlyPayment + extra) - interestPayment;

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      balance -= principalPayment;
      totalInterest += interestPayment;

      amortization.push({
        month: m,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, balance),
      });
    }

    const totalPayment = principal + totalInterest;

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      amortization: amortization.slice(0, 12), // Display first 12 months in preview
    });
  };

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setExtraPayment('');
    setResults(null);
    setAmountError('');
    setRateError('');
    setTermError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    const p = parseFloat(loanAmount) || 0;
    const r = parseFloat(interestRate) || 0;
    const t = parseFloat(loanTerm) || 0;
    const ext = parseFloat(extraPayment) || 0;

    const text = `💰 CALCNEST FINANCIAL AMORTIZATION REPORT 💰
-----------------------------------------
Principal Loan     : $${p.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Interest Rate      : ${r}% annual (${(r / 12).toFixed(4)}% monthly)
Loan Term          : ${t} ${termUnit}
Extra Payment      : $${ext.toFixed(2)}/month
-----------------------------------------
Monthly Base PMT   : $${results.monthlyPayment.toFixed(2)}
Total Interest Paid: $${results.totalInterest.toFixed(2)}
Total Lifecycle Cost: $${results.totalPayment.toFixed(2)}
-----------------------------------------
How it was calculated:
1. Base Monthly Payment is calculated using the standard amortizing annuity formula:
   PMT = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
   where P = $${p.toFixed(2)}, monthly interest rate r = ${(r / 100 / 12).toFixed(6)}, total payments n = ${termUnit === 'years' ? t * 12 : t}.
2. Amortization loop processes monthly:
   - Interest portion = Remaining balance * monthly rate
   - Principal portion = (Base Payment + Extra Payment) - Interest portion
   - Remaining balance is reduced by the Principal portion until it reaches $0.00.
3. Total Lifecycle Cost = Principal Loan ($${p.toFixed(2)}) + Cumulative Interest ($${results.totalInterest.toFixed(2)}).
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
        <Breadcrumb items={breadcrumbs} id="loan-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="loan-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Scientific <span className="text-blue-700">Loan Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Estimate monthly amortizing liabilities, cumulative bank interest rates, and accelerated principal repayment payoffs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard
              id="loan-form-card"
              title="Loan Metrics Setup"
              description="Configure principal amount, timeline unit, and annual rates."
            >
              <form onSubmit={handleCalculate} className="space-y-5">
                <Input
                  id="loan-amount-input"
                  label="Loan Amount ($)"
                  type="number"
                  placeholder="e.g. 50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  error={amountError}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="loan-term-input"
                    label={`Loan Duration (${termUnit})`}
                    type="number"
                    placeholder="e.g. 5"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    error={termError}
                  />
                  
                  <div className="flex flex-col gap-1.5 justify-end">
                    <span className="text-sm font-medium text-gray-700 invisible">Unit Toggle</span>
                    <select
                      id="term-unit-select"
                      value={termUnit}
                      onChange={(e) => setTermUnit(e.target.value as 'years' | 'months')}
                      className="w-full font-sans text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-gray-950 focus:border-gray-950 transition-all duration-150 outline-hidden"
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>

                <Input
                  id="interest-rate-input"
                  label="Annual Interest Rate (%)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  error={rateError}
                />

                <Input
                  id="extra-payment-input"
                  label="Extra Monthly Principal Payment ($) (Optional)"
                  type="number"
                  placeholder="e.g. 100"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    id="loan-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Calculate
                  </Button>
                  <Button
                    id="loan-reset-btn"
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

          {/* Right Outputs */}
          <section className="lg:col-span-7">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <CalculatorCard id="loan-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Payment Breakdown</h3>
                    </div>
                    <Button
                      id="copy-loan-btn"
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
                          <span className="text-xs font-semibold">Copy Value</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center mb-6">
                    <div className="text-sm text-gray-500 font-sans">
                      Estimated Monthly Base Payment:
                    </div>
                    <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                      ${results.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {extraPayment && (
                      <div className="text-xs text-green-600 font-mono font-bold mt-1">
                        + ${parseFloat(extraPayment).toFixed(2)} Extra payment active!
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-red-100 bg-red-50/10 p-4 rounded-xl">
                      <div className="text-xs text-red-600 font-mono uppercase tracking-wider font-semibold">Total Interest Paid</div>
                      <div className="text-2xl font-sans font-extrabold text-red-600 mt-1">
                        ${results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Cumulative Cost</div>
                      <div className="text-2xl font-sans font-extrabold text-gray-800 mt-1">
                        ${results.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Amortization schedule mini-preview */}
                <CalculatorCard id="amortization-preview" title="First Year Amortization Preview">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-mono">
                          <th className="py-2">Month</th>
                          <th className="py-2 text-right">Payment</th>
                          <th className="py-2 text-right">Principal</th>
                          <th className="py-2 text-right">Interest</th>
                          <th className="py-2 text-right">Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.amortization.map((row) => (
                          <tr key={row.month} className="border-b border-gray-50 text-gray-600 hover:bg-gray-50/50 transition-colors">
                            <td className="py-2 font-mono font-semibold">Month {row.month}</td>
                            <td className="py-2 text-right font-mono">${row.payment.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono text-green-600">${row.principal.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono text-red-500">${row.interest.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono font-semibold">${row.remainingBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CalculatorCard>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <Coins className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Loan Inputs</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Provide your initial loan principal, duration span, and annual rate percentage on the left to review cumulative payment metrics.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="loan-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Use the Loan Calculator</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Input the total initial amount of money you intend to borrow.</li>
                <li>Enter the duration length and select if the timeline is in years or months.</li>
                <li>Write down the expected annual interest rate percentage quoted by your lender.</li>
                <li>Optionally, add extra monthly payments to simulate how much faster you will pay off the loan.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Amortization Equation</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                The standard monthly payment is computed using the amortization equation:
              </p>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                M = P &times; [ r(1+r)<sup>n</sup> ] / [ (1+r)<sup>n</sup> - 1 ]
              </div>
              <p className="text-[11px] text-gray-400 font-sans mt-2">
                Where <strong>P</strong> is Principal, <strong>r</strong> is the monthly interest rate (annual rate / 12), and <strong>n</strong> is total monthly payment cycles.
              </p>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Example Calculations</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Auto Loan Example:</strong>
                <p className="mt-1">A car loan of **$25,000** for **5 years** at a **4.5% interest rate** results in a **$466.08** monthly payment with **$2,964.71** total interest.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Mortgage Extra Paydown:</strong>
                <p className="mt-1">A **$300,000** loan for **30 years** at **6% interest rate** costs **$1,798.65/mo**. Adding **$200/mo** saves tens of thousands in interest and shaves years off the term.</p>
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
                <strong>1. Zero or Negative Dividends:</strong> Inputting a term of 0 months or negative value yields a divide-by-zero error. Make sure to input positive duration lengths.
              </p>
              <p>
                <strong>2. Annual vs Monthly Conversions:</strong> Many people enter monthly rates as the annual rate or vice versa. The calculator automatically divides the annual interest rate parameter by 12 to run internal amortizations properly.
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
              <Link to="/discount-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Discount Calculator &rarr;
              </Link>
              <Link to="/days-between-dates" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Days Between Dates &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AdSensePlaceholder type="bottom-ad" id="loan-bottom-ad" />
      </div>
    </main>
  );
}
