import React, { useState } from 'react';
import { Percent, RotateCcw, Copy, Check, Info, Sparkles, TrendingUp, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState<'simple' | 'proportion' | 'change' | 'addsub'>('simple');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Tab 1: What is P% of V?
  const [t1Percent, setT1Percent] = useState('');
  const [t1Value, setT1Value] = useState('');
  const [t1Result, setT1Result] = useState<number | null>(null);
  const [t1Error, setT1Error] = useState('');

  // Tab 2: V1 is what percent of V2?
  const [t2Val1, setT2Val1] = useState('');
  const [t2Val2, setT2Val2] = useState('');
  const [t2Result, setT2Result] = useState<number | null>(null);
  const [t2Error, setT2Error] = useState('');

  // Tab 3: Percent change from V1 to V2
  const [t3Val1, setT3Val1] = useState('');
  const [t3Val2, setT3Val2] = useState('');
  const [t3Result, setT3Result] = useState<{ value: number; type: 'increase' | 'decrease' | 'none' } | null>(null);
  const [t3Error, setT3Error] = useState('');

  // Tab 4: Add or subtract percent
  const [t4Value, setT4Value] = useState('');
  const [t4Percent, setT4Percent] = useState('');
  const [t4Op, setT4Op] = useState<'add' | 'subtract'>('add');
  const [t4Result, setT4Result] = useState<number | null>(null);
  const [t4Error, setT4Error] = useState('');

  const seoData: SEOMetadata = {
    title: 'Percentage Calculator - Instant Percentage Math Online',
    description: 'Solve percentage increases, discounts, proportional rates, percentage differences, and compound margins with this instant online tool.',
    canonicalUrl: `${window.location.origin}/percentage-calculator`,
    faqSchema: [
      {
        question: 'How do you calculate a percentage of a number?',
        answer: 'To find a percentage of a number, multiply the percentage rate by the base number and divide the result by 100. For example, 15% of 200 is calculated as (15 * 200) / 100 = 30.',
      },
      {
        question: 'How is percentage increase/decrease calculated?',
        answer: 'The percentage change from value A to value B is computed by subtracting the initial value (A) from the new value (B), dividing the result by the absolute value of the initial value, and then multiplying by 100.',
      },
      {
        question: 'Is this percentage tool free to use?',
        answer: 'Yes! CalcNest provides a 100% free online calculator with zero limitations. All math models are run entirely client-side for safety and speed.',
      },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Percentage Calculator',
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
    { label: 'Percentage Calculator', path: '/percentage-calculator' }
  ];

  const handleT1Calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setT1Error('');
    setCopied(false);
    const p = parseFloat(t1Percent);
    const v = parseFloat(t1Value);

    if (isNaN(p) || isNaN(v)) {
      setT1Error('Please enter valid numerical inputs.');
      setT1Result(null);
      return;
    }
    setT1Result((p / 100) * v);
  };

  const handleT2Calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setT2Error('');
    setCopied(false);
    const v1 = parseFloat(t2Val1);
    const v2 = parseFloat(t2Val2);

    if (isNaN(v1) || isNaN(v2)) {
      setT2Error('Please enter valid numerical inputs.');
      setT2Result(null);
      return;
    }
    if (v2 === 0) {
      setT2Error('Total amount (value 2) cannot be zero.');
      setT2Result(null);
      return;
    }
    setT2Result((v1 / v2) * 100);
  };

  const handleT3Calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setT3Error('');
    setCopied(false);
    const v1 = parseFloat(t3Val1);
    const v2 = parseFloat(t3Val2);

    if (isNaN(v1) || isNaN(v2)) {
      setT3Error('Please enter valid numerical inputs.');
      setT3Result(null);
      return;
    }
    if (v1 === 0) {
      setT3Error('Starting value cannot be zero.');
      setT3Result(null);
      return;
    }

    const diff = v2 - v1;
    const change = (diff / Math.abs(v1)) * 100;
    let type: 'increase' | 'decrease' | 'none' = 'none';
    if (change > 0) type = 'increase';
    else if (change < 0) type = 'decrease';

    setT3Result({ value: change, type });
  };

  const handleT4Calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setT4Error('');
    setCopied(false);
    const v = parseFloat(t4Value);
    const p = parseFloat(t4Percent);

    if (isNaN(v) || isNaN(p)) {
      setT4Error('Please enter valid numerical inputs.');
      setT4Result(null);
      return;
    }

    if (t4Op === 'add') {
      setT4Result(v * (1 + p / 100));
    } else {
      setT4Result(v * (1 - p / 100));
    }
  };

  const handleReset = (tab: 'simple' | 'proportion' | 'change' | 'addsub') => {
    setCopied(false);
    if (tab === 'simple') {
      setT1Percent('');
      setT1Value('');
      setT1Result(null);
      setT1Error('');
    } else if (tab === 'proportion') {
      setT2Val1('');
      setT2Val2('');
      setT2Result(null);
      setT2Error('');
    } else if (tab === 'change') {
      setT3Val1('');
      setT3Val2('');
      setT3Result(null);
      setT3Error('');
    } else if (tab === 'addsub') {
      setT4Value('');
      setT4Percent('');
      setT4Result(null);
      setT4Error('');
    }
  };

  const handleCopyT1 = () => {
    if (t1Result === null) return;
    const text = `📊 CALCNEST PERCENTAGE REPORT 📊
-----------------------------------------
Percentage         : ${t1Percent}%
Base Number        : ${t1Value}
Calculated Result  : ${t1Result.toFixed(4)}
-----------------------------------------
How it was calculated:
Formula used       : Result = (Percentage / 100) * Base
Calculation        : (${t1Percent} / 100) * ${t1Value} = ${t1Result.toFixed(4)}
-----------------------------------------
Evaluate yours at: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyT2 = () => {
    if (t2Result === null) return;
    const text = `📊 CALCNEST PROPORTION REPORT 📊
-----------------------------------------
Part Value         : ${t2Val1}
Total Value        : ${t2Val2}
Calculated Percent : ${t2Result.toFixed(4)}%
-----------------------------------------
How it was calculated:
Formula used       : Percent = (Part / Total) * 100
Calculation        : (${t2Val1} / ${t2Val2}) * 100 = ${t2Result.toFixed(4)}%
-----------------------------------------
Evaluate yours at: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyT3 = () => {
    if (t3Result === null) return;
    const changeType = t3Result.type === 'increase' ? 'Increase' : t3Result.type === 'decrease' ? 'Decrease' : 'No Change';
    const text = `📊 CALCNEST PERCENTAGE CHANGE REPORT 📊
-----------------------------------------
Initial Value      : ${t3Val1}
Final Value        : ${t3Val2}
Change Percentage  : ${t3Result.value.toFixed(4)}% (${changeType})
-----------------------------------------
How it was calculated:
Formula used       : Change = ((Final - Initial) / |Initial|) * 100
Calculation        : ((${t3Val2} - ${t3Val1}) / |${t3Val1}|) * 100 = ${t3Result.value.toFixed(4)}%
-----------------------------------------
Evaluate yours at: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyT4 = () => {
    if (t4Result === null) return;
    const opLabel = t4Op === 'add' ? 'Increase (+)' : 'Decrease (-)';
    const text = `📊 CALCNEST ARITHMETIC PERCENTAGE REPORT 📊
-----------------------------------------
Base Value         : ${t4Value}
Percentage         : ${t4Percent}%
Operation          : ${opLabel}
Calculated Result  : ${t4Result.toFixed(4)}
-----------------------------------------
How it was calculated:
Formula used       : Result = Base * (1 ${t4Op === 'add' ? '+' : '-'} (Percentage / 100))
Calculation        : ${t4Value} * (1 ${t4Op === 'add' ? '+' : '-'} (${t4Percent} / 100)) = ${t4Result.toFixed(4)}
-----------------------------------------
Evaluate yours at: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      {/* Google AdSense top placement */}
      <AdSensePlaceholder type="top-banner" id="pct-top-ad" />

      <div className="max-w-4xl mx-auto mt-8">
        <Breadcrumb items={breadcrumbs} id="pct-calculator-breadcrumbs" />

        {/* Brand visual header */}
        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Precision <span className="text-blue-700">Percentage Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Four powerful percentage utilities in one unified screen. Analyze discount rates, growth vectors, proportional rates, and pricing metrics instantly.
          </p>
        </div>

        {/* Tabs Control Panel */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            id="tab-simple"
            type="button"
            onClick={() => { setActiveTab('simple'); setCopied(false); setShowSteps(false); }}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'simple'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            What is X% of Y?
          </button>
          <button
            id="tab-proportion"
            type="button"
            onClick={() => { setActiveTab('proportion'); setCopied(false); setShowSteps(false); }}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'proportion'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            X is What % of Y?
          </button>
          <button
            id="tab-change"
            type="button"
            onClick={() => { setActiveTab('change'); setCopied(false); setShowSteps(false); }}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'change'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            % Change (Inc/Dec)
          </button>
          <button
            id="tab-addsub"
            type="button"
            onClick={() => { setActiveTab('addsub'); setCopied(false); setShowSteps(false); }}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'addsub'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            Add / Sub %
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          
          {/* Left Area: Controls Form */}
          <section className="md:col-span-5">
            {activeTab === 'simple' && (
              <CalculatorCard
                id="simple-calc-card"
                title="Simple Percentage"
                description="Find the final value corresponding to a specified percentage rate."
              >
                <form onSubmit={handleT1Calculate} className="space-y-5">
                  <Input
                    id="t1-percent"
                    label="Percentage (%)"
                    type="number"
                    step="any"
                    placeholder="e.g. 15"
                    value={t1Percent}
                    onChange={(e) => setT1Percent(e.target.value)}
                    error={t1Error}
                  />
                  <Input
                    id="t1-value"
                    label="Of Value"
                    type="number"
                    step="any"
                    placeholder="e.g. 250"
                    value={t1Value}
                    onChange={(e) => setT1Value(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="t1-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="t1-reset"
                      type="button"
                      variant="secondary"
                      onClick={() => handleReset('simple')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CalculatorCard>
            )}

            {activeTab === 'proportion' && (
              <CalculatorCard
                id="proportion-calc-card"
                title="Percentage Proportion"
                description="Determine what portion of a total number another number constitutes."
              >
                <form onSubmit={handleT2Calculate} className="space-y-5">
                  <Input
                    id="t2-val1"
                    label="Value 1 (Part)"
                    type="number"
                    step="any"
                    placeholder="e.g. 50"
                    value={t2Val1}
                    onChange={(e) => setT2Val1(e.target.value)}
                    error={t2Error}
                  />
                  <Input
                    id="t2-val2"
                    label="Value 2 (Total)"
                    type="number"
                    step="any"
                    placeholder="e.g. 200"
                    value={t2Val2}
                    onChange={(e) => setT2Val2(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="t2-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="t2-reset"
                      type="button"
                      variant="secondary"
                      onClick={() => handleReset('proportion')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CalculatorCard>
            )}

            {activeTab === 'change' && (
              <CalculatorCard
                id="change-calc-card"
                title="Percentage Difference"
                description="Evaluate the exact percentage gain, loss, growth, or decline between two values."
              >
                <form onSubmit={handleT3Calculate} className="space-y-5">
                  <Input
                    id="t3-val1"
                    label="From Value (Initial)"
                    type="number"
                    step="any"
                    placeholder="e.g. 120"
                    value={t3Val1}
                    onChange={(e) => setT3Val1(e.target.value)}
                    error={t3Error}
                  />
                  <Input
                    id="t3-val2"
                    label="To Value (Final)"
                    type="number"
                    step="any"
                    placeholder="e.g. 180"
                    value={t3Val2}
                    onChange={(e) => setT3Val2(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="t3-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="t3-reset"
                      type="button"
                      variant="secondary"
                      onClick={() => handleReset('change')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CalculatorCard>
            )}

            {activeTab === 'addsub' && (
              <CalculatorCard
                id="addsub-calc-card"
                title="Add or Subtract %"
                description="Easily apply markup prices, tax fees, or percentage discount rates."
              >
                <form onSubmit={handleT4Calculate} className="space-y-5">
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                    <button
                      id="op-add"
                      type="button"
                      onClick={() => setT4Op('add')}
                      className={`flex-1 py-2 text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer ${
                        t4Op === 'add'
                          ? 'bg-blue-700 text-white'
                          : 'text-blue-700 hover:bg-gray-100'
                      }`}
                    >
                      Add (+)
                    </button>
                    <button
                      id="op-sub"
                      type="button"
                      onClick={() => setT4Op('subtract')}
                      className={`flex-1 py-2 text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer ${
                        t4Op === 'subtract'
                          ? 'bg-blue-700 text-white'
                          : 'text-blue-700 hover:bg-gray-100'
                      }`}
                    >
                      Subtract (-)
                    </button>
                  </div>
                  <Input
                    id="t4-value"
                    label="Initial Value"
                    type="number"
                    step="any"
                    placeholder="e.g. 100"
                    value={t4Value}
                    onChange={(e) => setT4Value(e.target.value)}
                    error={t4Error}
                  />
                  <Input
                    id="t4-percent"
                    label="Percentage to Apply (%)"
                    type="number"
                    step="any"
                    placeholder="e.g. 20"
                    value={t4Percent}
                    onChange={(e) => setT4Percent(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="t4-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="t4-reset"
                      type="button"
                      variant="secondary"
                      onClick={() => handleReset('addsub')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CalculatorCard>
            )}

            <div className="mt-6 p-4 bg-gray-50/70 border border-gray-100 rounded-2xl flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-500 font-sans leading-relaxed">
                <span className="font-semibold text-blue-700">Math Rule:</span> Simple percentages and ratios run locally in Javascript. Large ratios are correctly rounded to 4 decimal figures for accuracy.
              </div>
            </div>
          </section>

          {/* Right Area: Interactive Calculation Results Panel */}
          <section className="md:col-span-7">
            {/* Simple Result */}
            {activeTab === 'simple' && (
              t1Result !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <CalculatorCard id="t1-results-primary">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-700" />
                        <h3 className="text-lg font-sans font-bold text-blue-800">Percentage Result</h3>
                      </div>
                      <div className="relative">
                        <Button
                          id="copy-t1-btn"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyT1}
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

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                      <div className="text-sm text-gray-500 font-sans">
                        {t1Percent}% of {parseFloat(t1Value).toLocaleString()} equals:
                      </div>
                      <div className="text-4xl sm:text-5xl font-sans font-extrabold text-blue-800 mt-2">
                        {t1Result % 1 === 0 ? t1Result : Number(t1Result.toFixed(4))}
                      </div>
                    </div>
                  </CalculatorCard>

                  <CalculatorCard id="t1-details" title="Mathematical Statement">
                    <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      This calculation is executed by multiplying your input value <span className="font-semibold text-blue-700">{t1Value}</span> by <span className="font-semibold text-blue-700">{t1Percent}</span>, then dividing by 100.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                      ({t1Percent} / 100) × {t1Value} = {t1Result % 1 === 0 ? t1Result : Number(t1Result.toFixed(4))}
                    </div>
                  </CalculatorCard>

                  {/* Show Steps Toggle & Content */}
                  <div className="mt-4">
                    <Button
                      id="show-steps-percent-t1"
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
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Formulate Equation:</strong> To find {t1Percent}% of {t1Value}, we use the formula: <code>Result = (Percentage / 100) × BaseValue</code></li>
                          <li><strong>Convert Percentage to Fraction:</strong> {t1Percent} / 100 = <code>{parseFloat(t1Percent) / 100}</code></li>
                          <li><strong>Multiply by Base Value:</strong> {parseFloat(t1Percent) / 100} × {t1Value} = <strong>{t1Result}</strong></li>
                        </ol>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                  <Percent className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Values</h3>
                  <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                    Provide the percentage and the base number on the input board to evaluate your calculations instantly.
                  </p>
                </div>
              )
            )}

            {/* Proportion Result */}
            {activeTab === 'proportion' && (
              t2Result !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <CalculatorCard id="t2-results-primary">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-700" />
                        <h3 className="text-lg font-sans font-bold text-blue-800">Proportion Rate</h3>
                      </div>
                      <div className="relative">
                        <Button
                          id="copy-t2-btn"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyT2}
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

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                      <div className="text-sm text-gray-500 font-sans">
                        {parseFloat(t2Val1).toLocaleString()} is what percent of {parseFloat(t2Val2).toLocaleString()}?
                      </div>
                      <div className="text-4xl sm:text-5xl font-sans font-extrabold text-blue-800 mt-2">
                        {t2Result % 1 === 0 ? t2Result : Number(t2Result.toFixed(4))}%
                      </div>
                    </div>
                  </CalculatorCard>

                  <CalculatorCard id="t2-details" title="Mathematical Statement">
                    <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      This represents the ratio of <span className="font-semibold text-blue-700">{t2Val1}</span> relative to <span className="font-semibold text-blue-700">{t2Val2}</span> as a standard hundredth percentage score.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                      ({t2Val1} / {t2Val2}) × 100 = {t2Result % 1 === 0 ? t2Result : Number(t2Result.toFixed(4))}%
                    </div>
                  </CalculatorCard>

                  {/* Show Steps Toggle & Content */}
                  <div className="mt-4">
                    <Button
                      id="show-steps-percent-t2"
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
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Formulate Equation:</strong> To find what percentage {t2Val1} is of {t2Val2}, we use the formula: <code>Percentage = (Part / Total) × 100</code></li>
                          <li><strong>Calculate Portion:</strong> {t2Val1} / {t2Val2} = <code>{(parseFloat(t2Val1) / parseFloat(t2Val2)).toFixed(6)}</code></li>
                          <li><strong>Multiply by 100:</strong> {(parseFloat(t2Val1) / parseFloat(t2Val2)).toFixed(6)} × 100 = <strong>{t2Result}%</strong></li>
                        </ol>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                  <Percent className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Values</h3>
                  <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                    Provide the part value and the total amount on the input board to evaluate your proportional rate instantly.
                  </p>
                </div>
              )
            )}

            {/* Change Result */}
            {activeTab === 'change' && (
              t3Result !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <CalculatorCard id="t3-results-primary">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-700" />
                        <h3 className="text-lg font-sans font-bold text-blue-800">Change Metrics</h3>
                      </div>
                      <div className="relative">
                        <Button
                          id="copy-t3-btn"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyT3}
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

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                      <div className="text-sm text-gray-500 font-sans mb-2">
                        Percentage difference from {t3Val1} to {t3Val2}:
                      </div>
                      <div className={`text-4xl sm:text-5xl font-sans font-extrabold ${
                        t3Result.type === 'increase' ? 'text-green-600' : t3Result.type === 'decrease' ? 'text-red-600' : 'text-blue-700'
                      }`}>
                        {t3Result.value > 0 ? '+' : ''}{t3Result.value % 1 === 0 ? t3Result.value : Number(t3Result.value.toFixed(4))}%
                      </div>
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase mt-4 ${
                        t3Result.type === 'increase' ? 'bg-green-50 text-green-700' : t3Result.type === 'decrease' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t3Result.type === 'increase' ? 'Percentage Increase' : t3Result.type === 'decrease' ? 'Percentage Decrease' : 'No Change'}
                      </span>
                    </div>
                  </CalculatorCard>

                  <CalculatorCard id="t3-details" title="Mathematical Statement">
                    <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      Determined by finding the absolute difference (<span className="font-semibold text-blue-700">{Number((parseFloat(t3Val2) - parseFloat(t3Val1)).toFixed(4))}</span>) divided by the initial value <span className="font-semibold text-blue-700">{t3Val1}</span>, multiplied by 100.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                      (({t3Val2} - {t3Val1}) / |{t3Val1}|) × 100 = {t3Result.value % 1 === 0 ? t3Result.value : Number(t3Result.value.toFixed(4))}%
                    </div>
                  </CalculatorCard>

                  {/* Show Steps Toggle & Content */}
                  <div className="mt-4">
                    <Button
                      id="show-steps-percent-t3"
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
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Formulate Equation:</strong> To find the percentage change from {t3Val1} to {t3Val2}, we use the formula: <code>Change = ((Final - Initial) / |Initial|) × 100</code></li>
                          <li><strong>Calculate Value Delta:</strong> {t3Val2} - {t3Val1} = <code>{parseFloat(t3Val2) - parseFloat(t3Val1)}</code></li>
                          <li><strong>Divide by absolute Initial Value:</strong> {parseFloat(t3Val2) - parseFloat(t3Val1)} / {Math.abs(parseFloat(t3Val1))} = <code>{((parseFloat(t3Val2) - parseFloat(t3Val1)) / Math.abs(parseFloat(t3Val1))).toFixed(6)}</code></li>
                          <li><strong>Multiply by 100:</strong> {((parseFloat(t3Val2) - parseFloat(t3Val1)) / Math.abs(parseFloat(t3Val1))).toFixed(6)} × 100 = <strong>{t3Result.value}%</strong> (which is a <strong>{t3Result.type}</strong>).</li>
                        </ol>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                  <Percent className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Values</h3>
                  <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                    Provide the starting (initial) value and the final (target) value to evaluate the growth metrics.
                  </p>
                </div>
              )
            )}

            {/* Add / Sub Result */}
            {activeTab === 'addsub' && (
              t4Result !== null ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <CalculatorCard id="t4-results-primary">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-700" />
                        <h3 className="text-lg font-sans font-bold text-blue-800">Arithmetic Output</h3>
                      </div>
                      <div className="relative">
                        <Button
                          id="copy-t4-btn"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyT4}
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

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                      <div className="text-sm text-gray-500 font-sans">
                        Value {t4Op === 'add' ? 'plus' : 'minus'} {t4Percent}% of its initial figure is:
                      </div>
                      <div className="text-4xl sm:text-5xl font-sans font-extrabold text-blue-800 mt-2">
                        {t4Result % 1 === 0 ? t4Result : Number(t4Result.toFixed(4))}
                      </div>
                    </div>
                  </CalculatorCard>

                  <CalculatorCard id="t4-details" title="Mathematical Statement">
                    <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                      Computed by taking the base value <span className="font-semibold text-blue-700">{t4Value}</span> and {t4Op === 'add' ? 'adding' : 'subtracting'} the incremental portion value (<span className="font-semibold text-blue-700">{Number(((parseFloat(t4Percent)/100) * parseFloat(t4Value)).toFixed(4))}</span>).
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                      {t4Value} × (1 {t4Op === 'add' ? '+' : '-'} {t4Percent}/100) = {t4Result % 1 === 0 ? t4Result : Number(t4Result.toFixed(4))}
                    </div>
                  </CalculatorCard>

                  {/* Show Steps Toggle & Content */}
                  <div className="mt-4">
                    <Button
                      id="show-steps-percent-t4"
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
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Formulate Equation:</strong> To find {t4Value} {t4Op === 'add' ? 'increased' : 'decreased'} by {t4Percent}%, we use the formula: <code>Result = Base × (1 {t4Op === 'add' ? '+' : '-'} (Percentage / 100))</code></li>
                          <li><strong>Calculate Percentage Portion:</strong> {t4Percent} / 100 = <code>{parseFloat(t4Percent) / 100}</code></li>
                          <li><strong>Calculate Growth/Decline Factor:</strong> 1 {t4Op === 'add' ? '+' : '-'} {parseFloat(t4Percent) / 100} = <code>{t4Op === 'add' ? 1 + parseFloat(t4Percent)/100 : 1 - parseFloat(t4Percent)/100}</code></li>
                          <li><strong>Multiply Base Value:</strong> {t4Value} × {t4Op === 'add' ? 1 + parseFloat(t4Percent)/100 : 1 - parseFloat(t4Percent)/100} = <strong>{t4Result}</strong></li>
                        </ol>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                  <Percent className="h-10 w-10 text-gray-300 mb-3" />
                  <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Values</h3>
                  <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                    Select your calculation arithmetic task, write the value parameters, and start calculating instantly.
                  </p>
                </div>
              )
            )}
          </section>

        </div>
      </div>

      {/* Google AdSense content ad */}
      <AdSensePlaceholder type="in-content" id="pct-mid-ad" />

      {/* SEO rich text area */}
      <section className="max-w-4xl mx-auto border-t border-gray-100 mt-16 pt-12">
        <h2 className="text-2xl font-sans font-bold text-blue-800 mb-6 text-center">
          About Percentage Calculations
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-50/40 p-6 rounded-2xl border border-gray-100/50">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-2">Why are percentages vital in finance?</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              Percentages express fractional portions of any base financial figure relative to 100. They are vital for evaluating return-on-investments (ROI), compound tax fees, retail sale discount markdowns, and evaluating corporate gross margin metrics.
            </p>
          </div>
          <div className="bg-gray-50/40 p-6 rounded-2xl border border-gray-100/50">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-2">How to quickly calculate a percentage?</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
              For a rapid mental estimation, divide your initial base figure by 10 to find 10% of that number. Then, multiply or split that result relative to your target rate. For example, to find 15% of $80, take 10% ($8) + 5% ($4) = $12.
            </p>
          </div>
        </div>
      </section>

      {/* Google AdSense bottom placement */}
      <AdSensePlaceholder type="bottom-ad" id="pct-bottom-ad" />
    </main>
  );
}
