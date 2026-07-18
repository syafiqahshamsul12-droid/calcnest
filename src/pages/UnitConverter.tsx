import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, RotateCcw, Copy, Check, Info, Sparkles, AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Input from '../components/Input';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume';

interface UnitDefinition {
  value: string;
  label: string;
  ratio: number; // relative to base
}

const UNITS_MAP: Record<Category, UnitDefinition[]> = {
  length: [
    { value: 'm', label: 'Meters (m)', ratio: 1 },
    { value: 'km', label: 'Kilometers (km)', ratio: 1000 },
    { value: 'cm', label: 'Centimeters (cm)', ratio: 0.01 },
    { value: 'mm', label: 'Millimeters (mm)', ratio: 0.001 },
    { value: 'mi', label: 'Miles (mi)', ratio: 1609.344 },
    { value: 'yd', label: 'Yards (yd)', ratio: 0.9144 },
    { value: 'ft', label: 'Feet (ft)', ratio: 0.3048 },
    { value: 'in', label: 'Inches (in)', ratio: 0.0254 },
  ],
  weight: [
    { value: 'kg', label: 'Kilograms (kg)', ratio: 1 },
    { value: 'g', label: 'Grams (g)', ratio: 0.001 },
    { value: 'mg', label: 'Milligrams (mg)', ratio: 0.000001 },
    { value: 'lb', label: 'Pounds (lb)', ratio: 0.45359237 },
    { value: 'oz', label: 'Ounces (oz)', ratio: 0.028349523 },
    { value: 'ton', label: 'Metric Tons (t)', ratio: 1000 },
  ],
  temperature: [
    { value: 'C', label: 'Celsius (°C)', ratio: 1 },
    { value: 'F', label: 'Fahrenheit (°F)', ratio: 1 },
    { value: 'K', label: 'Kelvin (K)', ratio: 1 },
  ],
  area: [
    { value: 'm2', label: 'Square Meters (m²)', ratio: 1 },
    { value: 'km2', label: 'Square Kilometers (km²)', ratio: 1000000 },
    { value: 'ha', label: 'Hectares (ha)', ratio: 10000 },
    { value: 'ac', label: 'Acres (ac)', ratio: 4046.8564 },
    { value: 'ft2', label: 'Square Feet (ft²)', ratio: 0.092903 },
  ],
  volume: [
    { value: 'l', label: 'Liters (L)', ratio: 1 },
    { value: 'ml', label: 'Milliliters (mL)', ratio: 0.001 },
    { value: 'gal', label: 'Gallons (US gal)', ratio: 3.78541 },
    { value: 'qt', label: 'Quarts (US qt)', ratio: 0.946353 },
    { value: 'cup', label: 'Cups (US cup)', ratio: 0.236588 },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<{ value: number; from: string; to: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Sync default units on category change
  useEffect(() => {
    const list = UNITS_MAP[category];
    setFromUnit(list[0].value);
    setToUnit(list[1].value);
    setResults(null);
    setError('');
  }, [category]);

  const canonicalUrl = `${window.location.origin}/unit-converter`;

  const seoData: SEOMetadata = {
    title: 'Unit Converter - Multi-Category Conversion Engine',
    description: 'Convert between Length, Weight, Temperature, Area, and Volume metrics instantly. High precision, custom alternative values, and easy standard formula breakdowns.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'How does the temperature converter work?',
        answer: 'Unlike linear distance or weight units, temperature conversions require offset equations. Celsius to Fahrenheit uses: (C × 9/5) + 32, while Kelvin offsets by 273.15. This converter handles those offset calculations perfectly.',
      },
      {
        question: 'Is the conversion ratio precise?',
        answer: 'Yes, our ratio database relies on official international weight and measure standards (e.g. exactly 2.54 centimeters per inch) to guarantee strict precision.',
      },
      {
        question: 'Can I copy converted outputs?',
        answer: 'Yes. The copy button instantly saves the exact calculation string to your device clipboard.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Unit Converter',
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
    { label: 'Unit Converter', path: '/unit-converter' }
  ];

  const convertTemperature = (val: number, from: string, to: string): number => {
    if (from === to) return val;
    let celsius = val;
    if (from === 'F') celsius = (val - 32) * 5 / 9;
    if (from === 'K') celsius = val - 273.15;

    let target = celsius;
    if (to === 'F') target = (celsius * 9 / 5) + 32;
    if (to === 'K') target = celsius + 273.15;
    return target;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setError('Please enter a valid numeric value to convert.');
      setResults(null);
      return;
    }

    if (category === 'temperature') {
      const resultVal = convertTemperature(val, fromUnit, toUnit);
      setResults({ value: resultVal, from: fromUnit, to: toUnit });
    } else {
      const list = UNITS_MAP[category];
      const fromDef = list.find(u => u.value === fromUnit)!;
      const toDef = list.find(u => u.value === toUnit)!;

      // Convert to base standard, then to target unit
      const baseValue = val * fromDef.ratio;
      const targetValue = baseValue / toDef.ratio;

      setResults({ value: targetValue, from: fromUnit, to: toUnit });
    }
  };

  const handleReset = () => {
    setInputValue('');
    setResults(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    
    let stepsText = '';
    if (category === 'temperature') {
      if (results.from === results.to) {
        stepsText = `No conversion needed because starting and target units are identical (${results.from}).`;
      } else if (results.from === 'C' && results.to === 'F') {
        stepsText = `Formula: (°C * 9/5) + 32\nCalculation: (${inputValue} * 1.8) + 32 = ${results.value.toFixed(4)} °F`;
      } else if (results.from === 'F' && results.to === 'C') {
        stepsText = `Formula: (°F - 32) * 5/9\nCalculation: (${inputValue} - 32) * 5/9 = ${results.value.toFixed(4)} °C`;
      } else if (results.from === 'C' && results.to === 'K') {
        stepsText = `Formula: °C + 273.15\nCalculation: ${inputValue} + 273.15 = ${results.value.toFixed(4)} K`;
      } else if (results.from === 'K' && results.to === 'C') {
        stepsText = `Formula: K - 273.15\nCalculation: ${inputValue} - 273.15 = ${results.value.toFixed(4)} °C`;
      } else {
        stepsText = `Formula: Convert ${results.from} through Celsius base to ${results.to}\nResult: ${inputValue} ${results.from} = ${results.value.toFixed(4)} ${results.to}`;
      }
    } else {
      const list = UNITS_MAP[category];
      const fromDef = list.find(u => u.value === results.from)!;
      const toDef = list.find(u => u.value === results.to)!;
      stepsText = `1. Convert starting unit (${results.from}) to category standard base unit:\n   ${inputValue} * ${fromDef.ratio} = ${(parseFloat(inputValue) * fromDef.ratio).toFixed(6)} base units.\n2. Convert standard base unit to destination unit (${results.to}):\n   ${(parseFloat(inputValue) * fromDef.ratio).toFixed(6)} / ${toDef.ratio} = ${results.value.toFixed(6)} ${results.to}.`;
    }

    const text = `📐 CALCNEST UNIT CONVERSION REPORT 📐
-----------------------------------------
Original Value     : ${inputValue} ${results.from}
Converted Value    : ${results.value.toFixed(6)} ${results.to}
Category           : ${category.toUpperCase()}
-----------------------------------------
How it was calculated:
${stepsText}
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
        <Breadcrumb items={breadcrumbs} id="unit-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="unit-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Universal <span className="text-blue-700">Unit Converter</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Convert Length, Weight, Temperature, Area, and Volume dimensions in a single fluid dashboard.
          </p>
        </div>

        {/* Category selections */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 max-w-xl mx-auto bg-gray-50 p-1 rounded-2xl border border-gray-100">
          {(['length', 'weight', 'temperature', 'area', 'volume'] as Category[]).map((cat) => (
            <button
              key={cat}
              id={`cat-btn-${cat}`}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex-1 min-w-[90px] py-2 text-xs font-sans font-semibold rounded-xl transition-all cursor-pointer capitalize ${
                category === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel inputs */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard
              id="unit-form-card"
              title="Conversion Bounds"
              description="Provide source number and selecting target scale units."
            >
              <form onSubmit={handleCalculate} className="space-y-5">
                <Input
                  id="convert-value-input"
                  label="Convert Value"
                  type="number"
                  step="any"
                  placeholder="e.g. 100"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={error}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="from-unit-select" className="text-sm font-medium text-gray-700">From</label>
                    <select
                      id="from-unit-select"
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="w-full font-sans text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-gray-950 focus:border-gray-950 transition-all duration-150 outline-hidden"
                    >
                      {UNITS_MAP[category].map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="to-unit-select" className="text-sm font-medium text-gray-700">To</label>
                    <select
                      id="to-unit-select"
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="w-full font-sans text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-gray-950 focus:border-gray-950 transition-all duration-150 outline-hidden"
                    >
                      {UNITS_MAP[category].map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    id="unit-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Convert Units
                  </Button>
                  <Button
                    id="unit-reset-btn"
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
                <CalculatorCard id="unit-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Conversion Output</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-unit-btn"
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
                      {inputValue} {results.from} equals:
                    </div>
                    <div className="text-4xl sm:text-5xl font-sans font-extrabold text-blue-800 mt-2 truncate">
                      {results.value % 1 === 0 ? results.value : Number(results.value.toFixed(6))} {results.to}
                    </div>
                  </div>

                  {/* Alternative conversions summary */}
                  {category !== 'temperature' && (
                    <div className="border border-gray-100 rounded-xl p-4">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-2 text-center">Alternative Common Units</div>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        {UNITS_MAP[category].slice(0, 4).map((u) => {
                          if (u.value === results.from) return null;
                          const sourceVal = parseFloat(inputValue);
                          const fromDef = UNITS_MAP[category].find(item => item.value === results.from)!;
                          const rawResult = (sourceVal * fromDef.ratio) / u.ratio;
                          const printableResult = rawResult % 1 === 0 ? rawResult : Number(rawResult.toFixed(6));
                          return (
                            <div key={u.value} className="flex justify-between py-1 border-b border-gray-50">
                              <span>{u.label}:</span>
                              <span className="font-mono font-semibold">{printableResult}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CalculatorCard>

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-unit"
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
                      <p>Here is exactly how your unit conversion was calculated:</p>
                      {category === 'temperature' ? (
                        <div className="space-y-2">
                          <p>Temperature conversions use specific offset formulas:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {results.from === 'C' && results.to === 'F' && (
                              <li>Formula: <code>(Celsius × 1.8) + 32</code> &rArr; ({inputValue} × 1.8) + 32 = <strong>{results.value} °F</strong></li>
                            )}
                            {results.from === 'F' && results.to === 'C' && (
                              <li>Formula: <code>(Fahrenheit - 32) / 1.8</code> &rArr; ({inputValue} - 32) / 1.8 = <strong>{results.value} °C</strong></li>
                            )}
                            {results.from === 'C' && results.to === 'K' && (
                              <li>Formula: <code>Celsius + 273.15</code> &rArr; {inputValue} + 273.15 = <strong>{results.value} K</strong></li>
                            )}
                            {results.from === 'K' && results.to === 'C' && (
                              <li>Formula: <code>Kelvin - 273.15</code> &rArr; {inputValue} - 273.15 = <strong>{results.value} °C</strong></li>
                            )}
                            {results.from === 'F' && results.to === 'K' && (
                              <li>Formula: <code>((Fahrenheit - 32) / 1.8) + 273.15</code> &rArr; (({inputValue} - 32) / 1.8) + 273.15 = <strong>{results.value} K</strong></li>
                            )}
                            {results.from === 'K' && results.to === 'F' && (
                              <li>Formula: <code>((Kelvin - 273.15) × 1.8) + 32</code> &rArr; (({inputValue} - 273.15) × 1.8) + 32 = <strong>{results.value} °F</strong></li>
                            )}
                            {results.from === results.to && (
                              <li>The units are identical. No offset is needed.</li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Convert to Base Unit:</strong> We first scale the source value to our base standard unit (using ratio <code>{UNITS_MAP[category].find(u => u.value === results.from)?.ratio}</code>):
                            <br />
                            <code>{inputValue} × {UNITS_MAP[category].find(u => u.value === results.from)?.ratio} = {(parseFloat(inputValue) * (UNITS_MAP[category].find(u => u.value === results.from)?.ratio || 1)).toFixed(6)}</code>
                          </li>
                          <li><strong>Convert to Destination Unit:</strong> Then we divide that base value by the target unit's ratio (ratio <code>{UNITS_MAP[category].find(u => u.value === results.to)?.ratio}</code>):
                            <br />
                            <code>{(parseFloat(inputValue) * (UNITS_MAP[category].find(u => u.value === results.from)?.ratio || 1)).toFixed(6)} / {UNITS_MAP[category].find(u => u.value === results.to)?.ratio} = <strong>{results.value}</strong></code>
                          </li>
                        </ol>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <ArrowLeftRight className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Conversion Target</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Select your unit category, input parameters, and watch converted metrics appear instantly.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="unit-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Use the Unit Converter</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Choose your target category tab (Length, Weight, Temperature, Area, or Volume).</li>
                <li>Write down your source numeric value in the input field.</li>
                <li>Select your source unit and your target destination unit.</li>
                <li>Review the high-precision output alongside alternative metrics instantly.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Thermodynamic Equations</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                Linear conversions divide ratios directly. Temperature uses offsets:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 space-y-1">
                <div>Celsius to Fahrenheit = (C &times; 1.8) + 32</div>
                <div>Fahrenheit to Celsius = (F - 32) / 1.8</div>
                <div>Kelvin Offset = C + 273.15</div>
              </div>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Common Conversions Examples</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Height Measurements:</strong>
                <p className="mt-1">A person measuring **6 feet** (ft) tall translates exactly to **1.8288 meters** (m) or **182.88 centimeters** (cm).</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <strong className="text-blue-800">Culinary Volumes:</strong>
                <p className="mt-1">A **1 Gallon** US liquid container corresponds to exactly **3.7854 liters** or **16 cups**.</p>
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
                <strong>1. Extreme Floating Precision:</strong> JavaScript floating point numbers can occasionally produce trailing decimals (e.g., 0.30000000004). CalcNest handles this elegantly by sanitizing decimal outputs to a high-precision threshold (up to 6 decimal places).
              </p>
              <p>
                <strong>2. Empty Value Validation:</strong> Leaving the value blank triggers an error. Ensure you enter a numeric value before pressing convert.
              </p>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="border-t border-gray-100 pt-12 text-center">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-4">Related Calculators</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/bmi-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                BMI Calculator &rarr;
              </Link>
              <Link to="/percentage-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Percentage Calculator &rarr;
              </Link>
              <Link to="/days-between-dates" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Days Between Dates &rarr;
              </Link>
            </div>
          </div>
        </section>

        <AdSensePlaceholder type="bottom-ad" id="unit-bottom-ad" />
      </div>
    </main>
  );
}
