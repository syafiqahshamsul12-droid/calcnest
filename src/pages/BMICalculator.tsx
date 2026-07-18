import React, { useState } from 'react';
import { Activity, RotateCcw, Copy, Check, Info, Sparkles, Scale, Heart, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface BMIResults {
  score: number;
  category: 'under' | 'normal' | 'over' | 'obese';
  minHealthyWeight: number; // in unit corresponding to tab
  maxHealthyWeight: number; // in unit corresponding to tab
  unitLabel: 'kg' | 'lbs';
}

export default function BMICalculator() {
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>('metric');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [results, setResults] = useState<BMIResults | null>(null);

  // Metric Inputs
  const [metricWeight, setMetricWeight] = useState('');
  const [metricHeight, setMetricHeight] = useState('');
  const [metricError, setMetricError] = useState('');

  // Imperial Inputs
  const [imperialWeight, setImperialWeight] = useState('');
  const [imperialFeet, setImperialFeet] = useState('');
  const [imperialInches, setImperialInches] = useState('');
  const [imperialError, setImperialError] = useState('');

  const seoData: SEOMetadata = {
    title: 'BMI Calculator - Free Body Mass Index Check Online',
    description: 'Calculate your Body Mass Index (BMI) instantly. Supports Metric and Imperial units with official WHO health categories and healthy weight bounds.',
    canonicalUrl: `${window.location.origin}/bmi-calculator`,
    faqSchema: [
      {
        question: 'What is a healthy Body Mass Index (BMI) range?',
        answer: 'According to the World Health Organization (WHO), a healthy BMI for most adults is between 18.5 and 24.9. A score below 18.5 indicates underweight, 25.0 to 29.9 is overweight, and 30.0 or above is classified as obese.',
      },
      {
        question: 'How is BMI calculated for imperial units?',
        answer: 'For imperial units (pounds and inches), BMI is calculated using the formula: (Weight in pounds / (Height in inches)²) × 703. Height in feet and inches is first converted completely into inches.',
      },
      {
        question: 'Is BMI different for men and women?',
        answer: 'The standard BMI formula is the same for adult men and women. However, muscle mass, bone density, and body fat percentages vary between genders, which should be considered when interpreting results.',
      },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest BMI Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'HealthApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const breadcrumbs = [
    { label: 'BMI Calculator', path: '/bmi-calculator' }
  ];

  const handleCalculateMetric = (e: React.FormEvent) => {
    e.preventDefault();
    setMetricError('');
    setCopied(false);

    const w = parseFloat(metricWeight);
    const h = parseFloat(metricHeight);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setMetricError('Please enter valid, positive numbers for height and weight.');
      setResults(null);
      return;
    }

    const heightMeters = h / 100;
    const score = w / (heightMeters * heightMeters);

    // Calculate WHO category
    let category: 'under' | 'normal' | 'over' | 'obese' = 'normal';
    if (score < 18.5) category = 'under';
    else if (score >= 18.5 && score < 25) category = 'normal';
    else if (score >= 25 && score < 30) category = 'over';
    else category = 'obese';

    // Calculate ideal bounds for Normal BMI (18.5 to 24.9)
    const minHealthyWeight = 18.5 * (heightMeters * heightMeters);
    const maxHealthyWeight = 24.9 * (heightMeters * heightMeters);

    setResults({
      score,
      category,
      minHealthyWeight,
      maxHealthyWeight,
      unitLabel: 'kg',
    });
  };

  const handleCalculateImperial = (e: React.FormEvent) => {
    e.preventDefault();
    setImperialError('');
    setCopied(false);

    const w = parseFloat(imperialWeight);
    const ft = parseFloat(imperialFeet) || 0;
    const inch = parseFloat(imperialInches) || 0;

    const totalInches = (ft * 12) + inch;

    if (isNaN(w) || w <= 0 || totalInches <= 0) {
      setImperialError('Please enter valid, positive values for weight and height.');
      setResults(null);
      return;
    }

    const score = (w / (totalInches * totalInches)) * 703;

    let category: 'under' | 'normal' | 'over' | 'obese' = 'normal';
    if (score < 18.5) category = 'under';
    else if (score >= 18.5 && score < 25) category = 'normal';
    else if (score >= 25 && score < 30) category = 'over';
    else category = 'obese';

    // Calculate ideal bounds in lbs
    const minHealthyWeight = (18.5 * (totalInches * totalInches)) / 703;
    const maxHealthyWeight = (24.9 * (totalInches * totalInches)) / 703;

    setResults({
      score,
      category,
      minHealthyWeight,
      maxHealthyWeight,
      unitLabel: 'lbs',
    });
  };

  const handleReset = () => {
    setCopied(false);
    setResults(null);
    setMetricWeight('');
    setMetricHeight('');
    setMetricError('');
    setImperialWeight('');
    setImperialFeet('');
    setImperialInches('');
    setImperialError('');
  };

  const getCategoryTheme = (cat: 'under' | 'normal' | 'over' | 'obese') => {
    switch (cat) {
      case 'under':
        return {
          label: 'Underweight',
          color: 'text-sky-600',
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          barPos: '20%',
        };
      case 'normal':
        return {
          label: 'Healthy Weight',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          barPos: '45%',
        };
      case 'over':
        return {
          label: 'Overweight',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          barPos: '70%',
        };
      case 'obese':
        return {
          label: 'Obese Class',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          barPos: '90%',
        };
    }
  };

  const handleCopy = () => {
    if (!results) return;
    const theme = getCategoryTheme(results.category);
    
    let calculationSteps = '';
    if (results.unitLabel === 'kg') {
      const w = parseFloat(metricWeight) || 0;
      const hM = (parseFloat(metricHeight) || 0) / 100;
      calculationSteps = `Formula used: BMI = Weight (kg) / [Height (m)]²
Calculation: ${w} / [${hM.toFixed(2)}]² = ${results.score.toFixed(1)} kg/m²`;
    } else {
      const w = parseFloat(imperialWeight) || 0;
      const ft = parseFloat(imperialFeet) || 0;
      const inch = parseFloat(imperialInches) || 0;
      const totalInches = (ft * 12) + inch;
      calculationSteps = `Formula used: BMI = (Weight (lbs) * 703) / [Height (in)]²
Calculation: (${w} * 703) / [${totalInches}]² = ${results.score.toFixed(1)}`;
    }

    const summary = `🩺 CALCNEST BMI HEALTH REPORT 🩺
-----------------------------------------
BMI Score        : ${results.score.toFixed(1)}
Category         : ${theme?.label}
Healthy Bounds   : ${results.minHealthyWeight.toFixed(1)} to ${results.maxHealthyWeight.toFixed(1)} ${results.unitLabel}
-----------------------------------------
How it was calculated:
${calculationSteps}
WHO Standards:
- Underweight  : < 18.5
- Normal/Healthy: 18.5 to 24.9
- Overweight   : 25.0 to 29.9
- Obese        : >= 30.0
-----------------------------------------
Evaluate yours at: ${window.location.href}`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      {/* Google AdSense top placement */}
      <AdSensePlaceholder type="top-banner" id="bmi-top-ad" />

      <div className="max-w-4xl mx-auto mt-8">
        <Breadcrumb items={breadcrumbs} id="bmi-calculator-breadcrumbs" />

        {/* Visual brand header */}
        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Scientific <span className="text-blue-700">BMI Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Quickly check your Body Mass Index (BMI). Toggle between Metric and Imperial measurements, analyze ideal weight zones, and evaluate WHO health categories.
          </p>
        </div>

        {/* Unit switch control */}
        <div className="flex gap-2 justify-center mb-8 max-w-xs mx-auto bg-gray-50 p-1 rounded-2xl border border-gray-100">
          <button
            id="unit-metric"
            type="button"
            onClick={() => { setUnitMode('metric'); setResults(null); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              unitMode === 'metric'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            id="unit-imperial"
            type="button"
            onClick={() => { setUnitMode('imperial'); setResults(null); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-sans font-semibold rounded-xl transition-all cursor-pointer ${
              unitMode === 'imperial'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 hover:bg-gray-100'
            }`}
          >
            Imperial (lbs/in)
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          {/* Left panel: Input parameters */}
          <section className="md:col-span-5">
            {unitMode === 'metric' ? (
              <CalculatorCard
                id="metric-bmi-form"
                title="Body Metrics"
                description="Enter your height and weight to calculate."
              >
                <form onSubmit={handleCalculateMetric} className="space-y-5">
                  <Input
                    id="metric-height"
                    label="Height (cm)"
                    type="number"
                    step="any"
                    placeholder="e.g. 175"
                    value={metricHeight}
                    onChange={(e) => setMetricHeight(e.target.value)}
                    error={metricError}
                  />
                  <Input
                    id="metric-weight"
                    label="Weight (kg)"
                    type="number"
                    step="any"
                    placeholder="e.g. 70"
                    value={metricWeight}
                    onChange={(e) => setMetricWeight(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="bmi-metric-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="bmi-metric-reset"
                      type="button"
                      variant="secondary"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CalculatorCard>
            ) : (
              <CalculatorCard
                id="imperial-bmi-form"
                title="Body Metrics"
                description="Enter your height and weight in imperial scale."
              >
                <form onSubmit={handleCalculateImperial} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="imperial-feet"
                      label="Height (Feet)"
                      type="number"
                      placeholder="ft"
                      value={imperialFeet}
                      onChange={(e) => setImperialFeet(e.target.value)}
                      error={imperialError}
                    />
                    <Input
                      id="imperial-inches"
                      label="Height (Inches)"
                      type="number"
                      placeholder="in"
                      value={imperialInches}
                      onChange={(e) => setImperialInches(e.target.value)}
                    />
                  </div>
                  <Input
                    id="imperial-weight"
                    label="Weight (Pounds)"
                    type="number"
                    step="any"
                    placeholder="lbs"
                    value={imperialWeight}
                    onChange={(e) => setImperialWeight(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      id="bmi-imperial-submit"
                      type="submit"
                      variant="primary"
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      id="bmi-imperial-reset"
                      type="button"
                      variant="secondary"
                      onClick={handleReset}
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
                <span className="font-semibold text-blue-700">Important Note:</span> BMI represents general population mass ratios. It does not measure body fat directly and might not fully classify pregnant women or muscular athletes correctly.
              </div>
            </div>
          </section>

          {/* Right panel: Active Result Showcase */}
          <section className="md:col-span-7">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Primary Card - Score Panel */}
                <CalculatorCard id="bmi-results-score">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">BMI Evaluation</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-bmi-btn"
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
                            <span className="text-xs font-semibold">Copy Report</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-center sm:text-left">
                      <div className="text-sm text-gray-500 font-sans">
                        Your Body Mass Index score:
                      </div>
                      <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                        {results.score.toFixed(1)}
                      </div>
                    </div>

                    <div className={`text-center p-4 rounded-xl border ${getCategoryTheme(results.category)?.bg} ${getCategoryTheme(results.category)?.border}`}>
                      <span className={`text-xs uppercase tracking-wider font-mono font-bold ${getCategoryTheme(results.category)?.color}`}>
                        Category classification
                      </span>
                      <div className={`text-xl font-sans font-extrabold mt-1.5 ${getCategoryTheme(results.category)?.color}`}>
                        {getCategoryTheme(results.category)?.label}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal gauge element */}
                  <div className="mt-8">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono tracking-wider uppercase mb-1">
                      <span>Underweight</span>
                      <span>Healthy</span>
                      <span>Overweight</span>
                      <span>Obese</span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="w-[18.5%] bg-sky-400 h-full"></div>
                      <div className="w-[6.4%] bg-green-400 h-full"></div>
                      <div className="w-[5%] bg-orange-400 h-full"></div>
                      <div className="w-[70.1%] bg-red-400 h-full"></div>
                    </div>
                    {/* Visual indicator dot */}
                    <div className="relative w-full h-4 mt-1">
                      <div
                        className="absolute w-3 h-3 bg-blue-700 border border-white rounded-full shadow-xs transform -translate-x-1/2"
                        style={{ left: getCategoryTheme(results.category)?.barPos }}
                      ></div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Healthy bounds card */}
                <CalculatorCard id="bmi-bounds-card" title="Ideal Weight Range" className="border-l-4 border-l-blue-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-md font-sans font-bold text-blue-800 mb-1">
                        Healthy Weight Spectrum
                      </h4>
                      <p className="text-sm text-gray-500 font-sans leading-relaxed">
                        For your specified height, a normal WHO body mass ratio equates to a weight between <span className="font-bold text-blue-800">{results.minHealthyWeight.toFixed(1)} {results.unitLabel}</span> and <span className="font-bold text-blue-800">{results.maxHealthyWeight.toFixed(1)} {results.unitLabel}</span>.
                      </p>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Category comparison list */}
                <CalculatorCard id="bmi-reference-card" title="WHO Metric Benchmark Chart">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/50 text-xs sm:text-sm">
                      <span className="font-medium text-sky-600">Underweight</span>
                      <span className="font-mono text-gray-400 font-medium">Below 18.5</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/50 text-xs sm:text-sm">
                      <span className="font-medium text-green-600 font-bold">Healthy Weight</span>
                      <span className="font-mono text-gray-400 font-medium">18.5 – 24.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/50 text-xs sm:text-sm">
                      <span className="font-medium text-orange-600">Overweight</span>
                      <span className="font-mono text-gray-400 font-medium">25.0 – 29.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg border border-gray-100/50 bg-gray-50/50 text-xs sm:text-sm">
                      <span className="font-medium text-red-600">Obese</span>
                      <span className="font-mono text-gray-400 font-medium">30.0 and above</span>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-bmi"
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
                      className="mt-3 bg-gray-50 border border-gray-150 rounded-xl p-5 text-xs text-gray-500 font-sans leading-relaxed space-y-3 animate-fade-in"
                    >
                      <h4 className="font-bold text-blue-800 text-sm">Step-by-Step Mathematical Logic:</h4>
                      <p>Here is exactly how the system calculated your Body Mass Index (BMI):</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {results.unitLabel === 'kg' ? (
                          <>
                            <li><strong>Acquire Metric Inputs:</strong> Weight = <strong>{metricWeight} kg</strong>, Height = <strong>{metricHeight} cm</strong> (which is <strong>{(parseFloat(metricHeight) / 100).toFixed(2)} m</strong>).</li>
                            <li><strong>Apply WHO Metric Formula:</strong> BMI = Weight (kg) / [Height (m)]²</li>
                            <li><strong>Calculate:</strong> {metricWeight} / [{(parseFloat(metricHeight) / 100).toFixed(2)}]² = <strong>{results.score.toFixed(1)} kg/m²</strong></li>
                          </>
                        ) : (
                          <>
                            <li><strong>Acquire Imperial Inputs:</strong> Weight = <strong>{imperialWeight} lbs</strong>, Height = <strong>{imperialFeet} ft {imperialInches} in</strong> (which is <strong>{(parseFloat(imperialFeet) * 12 + (parseFloat(imperialInches) || 0))} inches</strong> total).</li>
                            <li><strong>Apply WHO Imperial Formula:</strong> BMI = (Weight (lbs) * 703) / [Height (in)]²</li>
                            <li><strong>Calculate:</strong> ({imperialWeight} * 703) / [{(parseFloat(imperialFeet) * 12 + (parseFloat(imperialInches) || 0))}]² = <strong>{results.score.toFixed(1)}</strong></li>
                          </>
                        )}
                        <li><strong>Determine Category Classification:</strong> Evaluated the resulting score against World Health Organization (WHO) standards:
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>BMI &lt; 18.5 is classified as <strong>Underweight</strong></li>
                            <li>BMI between 18.5 and 24.9 is classified as <strong>Healthy Weight</strong></li>
                            <li>BMI between 25.0 and 29.9 is classified as <strong>Overweight</strong></li>
                            <li>BMI &gt;= 30.0 is classified as <strong>Obese</strong></li>
                          </ul>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <Scale className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Measurements</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Enter your height and weight attributes on the inputs board to check your live body mass classifications.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Google AdSense mid placement */}
      <AdSensePlaceholder type="in-content" id="bmi-mid-ad" />

      {/* Educational Resources & Deep Informational Content */}
      <section className="max-w-4xl mx-auto border-t border-gray-100 mt-16 pt-12 space-y-12">
        
        {/* How to Use & Formula */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-3">How to Use the BMI Calculator</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
              <li>Choose your preferred measurement scale: **Metric** or **Imperial**.</li>
              <li>Input your exact height (in centimeters or feet/inches) and weight (in kilograms or pounds).</li>
              <li>Click the **Calculate** button to analyze your body index parameters.</li>
              <li>Check your score, WHO classification, and ideal target range.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-3">Mathematical Logic & Formula</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
              Body Mass Index (BMI) evaluates standard weight-to-height ratios. The formulas differ based on the unit system chosen:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-[11px] text-gray-500 text-center">
                Metric: BMI = weight (kg) / [height (m)]²
              </div>
              <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl font-mono text-[11px] text-gray-500 text-center">
                Imperial: BMI = (weight (lbs) * 703) / [height (in)]²
              </div>
            </div>
          </div>
        </div>

        {/* Practical Example Case */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="text-md font-sans font-extrabold text-blue-800 mb-2">Practical Calculation Example</h3>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
            <strong>Case study:</strong> An individual weighing <strong>70 kilograms</strong> with a height of <strong>175 centimeters (1.75 meters)</strong>:
            <br />
            - <strong>Height squared:</strong> 1.75 * 1.75 = 3.0625.
            <br />
            - <strong>BMI Calculation:</strong> 70 / 3.0625 = <strong>22.86</strong>.
            <br />
            - <strong>WHO Category:</strong> This lands safely inside the **Healthy Weight** range (18.5 – 24.9).
          </p>
        </div>

        {/* FAQ Segment */}
        <div className="space-y-4">
          <h3 className="text-lg font-sans font-extrabold text-blue-800 mb-4 text-center">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5 border border-gray-100 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-blue-800 mb-1">What is considered a healthy BMI?</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                According to the World Health Organization (WHO), a BMI between 18.5 and 24.9 is classified as healthy weight for adults.
              </p>
            </div>
            <div className="p-5 border border-gray-100 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-blue-800 mb-1">Are age and gender included in the standard BMI?</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Standard BMI calculations only consider height and weight for adults. However, health practitioners often evaluate it differently for adolescents and seniors.
              </p>
            </div>
          </div>
        </div>

        {/* Related Calculators links */}
        <div className="pt-10 text-center">
          <h4 className="text-sm font-sans font-bold text-blue-800 mb-4">Related Calculators</h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/age-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              Age Calculator &rarr;
            </Link>
            <Link to="/percentage-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              Percentage Calculator &rarr;
            </Link>
            <Link to="/unit-converter" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
              Unit Converter &rarr;
            </Link>
          </div>
        </div>

      </section>

      {/* Google AdSense bottom placement */}
      <AdSensePlaceholder type="bottom-ad" id="bmi-bottom-ad" />
    </main>
  );
}
