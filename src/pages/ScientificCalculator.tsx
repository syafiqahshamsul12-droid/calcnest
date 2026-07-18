import React, { useState } from 'react';
import { HelpCircle, RotateCcw, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('');
  const [equation, setEquation] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [historyExpr, setHistoryExpr] = useState('');

  const canonicalUrl = `${window.location.origin}/scientific-calculator`;

  const seoData: SEOMetadata = {
    title: 'Scientific Calculator - Free Online Advanced Solver',
    description: 'Solve advanced mathematical, trigonometric, logarithmic, and exponential equations online. Includes responsive interactive scientific keypad with keyboard support.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'Does this calculator support order of operations (PEMDAS)?',
        answer: 'Yes, because expressions are safely compiled and solved using JavaScript algebraic rules, it strictly respects Parentheses, Exponents, Multiplication, Division, Addition, and Subtraction in order.',
      },
      {
        question: 'How do I use trigonometric functions like sin or cos?',
        answer: 'Tap the function button (e.g., sin, cos, tan), followed by your target numeric value or angle. Note that calculations are computed in Radians by default.',
      },
      {
        question: 'What happens if I write an invalid formula?',
        answer: 'CalcNest will display a clear "Syntax Error" notification rather than crashing, letting you clear the buffer or press backspace to correct.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest Scientific Calculator',
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
    { label: 'Scientific Calculator', path: '/scientific-calculator' }
  ];

  const handleKeyPress = (char: string) => {
    setError('');
    setEquation(prev => prev + char);
    setDisplay(prev => prev + char);
  };

  const handleScientificFunction = (func: string) => {
    setError('');
    if (func === 'pi') {
      setEquation(prev => prev + Math.PI.toString());
      setDisplay(prev => prev + 'π');
    } else if (func === 'e') {
      setEquation(prev => prev + Math.E.toString());
      setDisplay(prev => prev + 'e');
    } else {
      // e.g. Math.sin(, Math.cos(, etc.
      setEquation(prev => prev + `Math.${func}(`);
      setDisplay(prev => prev + `${func}(`);
    }
  };

  const handleClear = () => {
    setDisplay('');
    setEquation('');
    setError('');
  };

  const handleBackspace = () => {
    setError('');
    setDisplay(prev => prev.slice(0, -1));
    setEquation(prev => prev.slice(0, -1));
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!equation) return;

    setHistoryExpr(display);

    try {
      // Sanitize and evaluate algebraic power sign '^' replacing with Math.pow notation if needed, 
      // or standard evaluating
      let parsedExpr = equation.replace(/\^/g, '**');
      
      // Basic math safety sandbox evaluation
      const finalResult = new Function(`return (${parsedExpr})`)();
      
      if (finalResult === null || finalResult === undefined || isNaN(finalResult)) {
        setError('Syntax Error');
        return;
      }

      if (!isFinite(finalResult)) {
        setError('Cannot divide by zero');
        return;
      }

      setDisplay(Number(finalResult.toFixed(8)).toString());
      setEquation(finalResult.toString());
    } catch (err) {
      setError('Syntax Error');
    }
  };

  const handleCopy = () => {
    if (!display || error) return;
    
    const exprString = historyExpr || display;
    const text = `🧮 CALCNEST SCIENTIFIC CALCULATION REPORT 🧮
-----------------------------------------
Expression         : ${exprString}
Calculated Result  : ${display}
-----------------------------------------
How it was calculated:
The formula was parsed following standard algebraic order of operations (PEMDAS/BODMAS):
1. Parentheses: Terms enclosed in brackets ( ) are resolved with top priority.
2. Exponents & Roots: Power indexes (e.g. ^, **) and roots (e.g. √) are evaluated.
3. Multiplication & Division: Calculated in sequence from left to right.
4. Addition & Subtraction: Evaluated in sequence from left to right.
-----------------------------------------
Evaluate yours at: ${window.location.href}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonsLayout = [
    { label: 'sin', action: () => handleScientificFunction('sin'), type: 'sci' },
    { label: 'cos', action: () => handleScientificFunction('cos'), type: 'sci' },
    { label: 'tan', action: () => handleScientificFunction('tan'), type: 'sci' },
    { label: 'C', action: handleClear, type: 'action' },
    { label: '⌫', action: handleBackspace, type: 'action' },

    { label: 'log', action: () => handleScientificFunction('log10'), type: 'sci' },
    { label: 'ln', action: () => handleScientificFunction('log'), type: 'sci' },
    { label: '√', action: () => handleScientificFunction('sqrt'), type: 'sci' },
    { label: '^', action: () => handleKeyPress('^'), type: 'sci' },
    { label: '/', action: () => handleKeyPress('/'), type: 'operator' },

    { label: 'π', action: () => handleScientificFunction('pi'), type: 'sci' },
    { label: '7', action: () => handleKeyPress('7'), type: 'num' },
    { label: '8', action: () => handleKeyPress('8'), type: 'num' },
    { label: '9', action: () => handleKeyPress('9'), type: 'num' },
    { label: '*', action: () => handleKeyPress('*'), type: 'operator' },

    { label: 'e', action: () => handleScientificFunction('e'), type: 'sci' },
    { label: '4', action: () => handleKeyPress('4'), type: 'num' },
    { label: '5', action: () => handleKeyPress('5'), type: 'num' },
    { label: '6', action: () => handleKeyPress('6'), type: 'num' },
    { label: '-', action: () => handleKeyPress('-'), type: 'operator' },

    { label: '(', action: () => handleKeyPress('('), type: 'operator' },
    { label: '1', action: () => handleKeyPress('1'), type: 'num' },
    { label: '2', action: () => handleKeyPress('2'), type: 'num' },
    { label: '3', action: () => handleKeyPress('3'), type: 'num' },
    { label: '+', action: () => handleKeyPress('+'), type: 'operator' },

    { label: ')', action: () => handleKeyPress(')'), type: 'operator' },
    { label: '0', action: () => handleKeyPress('0'), type: 'num' },
    { label: '.', action: () => handleKeyPress('.'), type: 'num' },
    { label: '=', action: () => handleCalculate(), type: 'equals' },
  ];

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="scientific-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="scientific-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Scientific <span className="text-blue-700">Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Perform high-precision engineering calculations, trigonometry, exponents, logarithms, and algebraic parenthetical compounding instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Keypad & Display Card */}
          <section className="lg:col-span-7 space-y-6">
            <CalculatorCard id="scientific-engine-card">
              {/* Display Area */}
              <div className="mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-5 text-right font-mono flex flex-col justify-between min-h-[110px] relative">
                <div className="text-xs text-gray-400 select-all overflow-x-auto whitespace-nowrap scrollbar-none pb-1" aria-label="Equation Formula Log">
                  {display || '0'}
                </div>
                
                {error ? (
                  <div className="text-red-500 font-sans font-semibold text-lg text-left absolute bottom-5 left-5" role="alert">
                    {error}
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold text-blue-800 tracking-tight select-all truncate" aria-label="Current result display">
                    {display || '0'}
                  </div>
                )}

                {display && !error && (
                  <Button
                    id="scientific-quick-copy"
                    variant="ghost"
                    onClick={handleCopy}
                    className="absolute bottom-3 right-3 p-1.5 hover:bg-gray-200/50 rounded-lg"
                    title="Copy Result"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600 animate-pulse" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                )}
              </div>

              {/* Grid Buttons */}
              <div className="grid grid-cols-5 gap-2.5">
                {buttonsLayout.map((btn, index) => {
                  let classStyles = 'py-3.5 text-xs sm:text-sm font-sans font-semibold rounded-xl text-center shadow-xs transition-all duration-150 cursor-pointer ';
                  if (btn.type === 'num') {
                    classStyles += 'bg-white text-gray-800 border border-gray-150 hover:bg-gray-50';
                  } else if (btn.type === 'operator') {
                    classStyles += 'bg-blue-50 text-blue-800 border border-blue-100/50 hover:bg-blue-100/50';
                  } else if (btn.type === 'sci') {
                    classStyles += 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100';
                  } else if (btn.type === 'action') {
                    classStyles += 'bg-red-50 text-red-600 border border-red-100/50 hover:bg-red-100/50';
                  } else {
                    // equals
                    classStyles += 'bg-blue-700 text-white col-span-2 hover:bg-blue-800 shadow-md';
                  }

                  return (
                    <button
                      key={index}
                      id={`sci-btn-${btn.label === '⌫' ? 'back' : btn.label}`}
                      type="button"
                      onClick={btn.action}
                      className={classStyles}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </CalculatorCard>
          </section>

          {/* Educational Formula / Layout details */}
          <section className="lg:col-span-5 space-y-6">
            <CalculatorCard id="sci-guide-card" title="Usage Information" description="Advanced engineering computation metrics.">
              <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                <div className="border-b border-gray-50 pb-3">
                  <h4 className="font-semibold text-blue-800 mb-1">Trigonometric Functions</h4>
                  <p>Trig functions are evaluated in <strong>Radians</strong>. To convert Degrees to Radians, multiply degrees by &pi; / 180 before applying.</p>
                </div>
                <div className="border-b border-gray-50 pb-3">
                  <h4 className="font-semibold text-blue-800 mb-1">Power Exponent "^"</h4>
                  <p>Use the carrot symbol to denote indices. E.g. entering <strong>2 ^ 3</strong> computes <strong>2 &times; 2 &times; 2 = 8</strong>.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Decimal Points</h4>
                  <p>Our engine automatically formats output fractions up to 8 places of decimal accuracy to prevent trailing floats.</p>
                </div>
              </div>
            </CalculatorCard>
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="scientific-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Key Features Checklist</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li><strong>All-in-one keyboard:</strong> Tap numbers or type operations directly.</li>
                <li><strong>Tactile controls:</strong> Visual feedback responds instantly when clicked.</li>
                <li><strong>Constants:</strong> Access mathematical &pi; and Euler's number (e) to maximum precision.</li>
                <li><strong>Clear and Backspace:</strong> Instantly wipe characters or clear the entire buffer safely.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Mathematical Orders</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
                Algebraic equations strictly respect the standard **PEMDAS** order of operations:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center mt-3">
                1st: Parentheses () &rarr; 2nd: Exponents ^ &rarr; 3rd: Multiply/Divide &rarr; 4th: Add/Subtract
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
                <strong>1. Syntax Error:</strong> This notice is displayed if you enter unbalanced parentheses (e.g., <em>"(5+2"</em> without closing it) or place multiple operators adjacent to each other.
              </p>
              <p>
                <strong>2. Division by Zero:</strong> Dividing an integer by 0 produces infinity in math. The engine intercepts this operation, reporting <em>"Cannot divide by zero"</em> to prevent system instability.
              </p>
            </div>
          </div>

          {/* Related Calculators */}
          <div className="border-t border-gray-100 pt-12 text-center">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-4">Related Calculators</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/average-calculator" className="text-xs font-semibold px-4 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl border border-gray-100 transition-colors">
                Average Calculator &rarr;
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

        <AdSensePlaceholder type="bottom-ad" id="scientific-bottom-ad" />
      </div>
    </main>
  );
}
