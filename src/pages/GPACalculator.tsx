import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Copy, Check, Info, Sparkles, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import SEOManager from '../components/SEOManager';
import AdSensePlaceholder from '../components/AdSensePlaceholder';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import CalculatorCard from '../components/CalculatorCard';
import { SEOMetadata } from '../types';

interface CourseRow {
  id: string;
  name: string;
  grade: string; // letter grade
  credits: string; // number of credit hours
}

const GRADE_POINTS_MAP: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Course 1', grade: 'A', credits: '3' },
    { id: '2', name: 'Course 2', grade: 'B+', credits: '4' },
    { id: '3', name: 'Course 3', grade: 'A-', credits: '3' },
    { id: '4', name: 'Course 4', grade: 'B', credits: '3' },
  ]);

  const [results, setResults] = useState<{ gpa: number; totalCredits: number; qualityPoints: number } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const canonicalUrl = `${window.location.origin}/gpa-calculator`;

  const seoData: SEOMetadata = {
    title: 'GPA Calculator - Weighted Semester GPA Solver',
    description: 'Calculate semester or cumulative Grade Point Average (GPA) based on class credits and letter grades. Easily add classes with standard 4.0 scale scoring.',
    canonicalUrl,
    faqSchema: [
      {
        question: 'What is a weighted GPA calculation?',
        answer: 'Grade Point Average (GPA) is weighted by course credit hours. A 4-credit course has double the influence on your final GPA than a 2-credit course.',
      },
      {
        question: 'What are quality points?',
        answer: 'Quality points are calculated by multiplying the numerical points of a letter grade (e.g. A = 4.0) by the credits allocated to that class (e.g. 3 credits = 12 quality points).',
      },
      {
        question: 'How do I add or delete courses?',
        answer: 'You can tap the "+ Add Course Row" button to instantly append a class, or the red trashbin icon to remove a row.',
      }
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'CalcNest GPA Calculator',
      'operatingSystem': 'All',
      'applicationCategory': 'EducationalApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD',
      },
    },
  };

  const breadcrumbs = [
    { label: 'GPA Calculator', path: '/gpa-calculator' }
  ];

  const handleAddRow = () => {
    const nextId = (Math.max(...courses.map(c => parseInt(c.id))) + 1).toString();
    setCourses([...courses, { id: nextId, name: `Course ${nextId}`, grade: 'A', credits: '3' }]);
  };

  const handleRemoveRow = (id: string) => {
    if (courses.length <= 1) {
      setError('You must have at least one course row.');
      return;
    }
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleRowChange = (id: string, key: keyof CourseRow, value: string) => {
    setError('');
    setCourses(courses.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCopied(false);

    let totalCredits = 0;
    let totalQualityPoints = 0;

    for (const c of courses) {
      const creditsVal = parseFloat(c.credits);
      if (isNaN(creditsVal) || creditsVal <= 0) {
        setError('Ensure all courses have valid positive credit hours.');
        setResults(null);
        return;
      }

      const gradePoints = GRADE_POINTS_MAP[c.grade];
      if (gradePoints === undefined) {
        setError('Select valid letter grades.');
        setResults(null);
        return;
      }

      totalCredits += creditsVal;
      totalQualityPoints += (gradePoints * creditsVal);
    }

    if (totalCredits === 0) {
      setError('Total credits must be greater than zero.');
      setResults(null);
      return;
    }

    const gpa = totalQualityPoints / totalCredits;

    setResults({
      gpa,
      totalCredits,
      qualityPoints: totalQualityPoints,
    });
  };

  const handleReset = () => {
    setCourses([
      { id: '1', name: 'Course 1', grade: 'A', credits: '3' },
      { id: '2', name: 'Course 2', grade: 'B+', credits: '4' },
      { id: '3', name: 'Course 3', grade: 'A-', credits: '3' },
      { id: '4', name: 'Course 4', grade: 'B', credits: '3' },
    ]);
    setResults(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;

    // Format courses summary
    const courseLines = courses.map(c => {
      const pts = GRADE_POINTS_MAP[c.grade] || 0;
      return `  - ${c.name || 'Course'}: Grade ${c.grade} (${pts} pts) * ${c.credits} Credits = ${(pts * parseFloat(c.credits)).toFixed(2)} QP`;
    }).join('\n');

    const text = `🎓 CALCNEST ACADEMIC GPA REPORT 🎓
-----------------------------------------
Cumulative GPA     : ${results.gpa.toFixed(3)}
Total Credit Hours : ${results.totalCredits}
Total Quality Points: ${results.qualityPoints.toFixed(2)}
Standing           : ${getStatusLabel(results.gpa).label}
-----------------------------------------
Course List & Points Breakdown:
${courseLines}
-----------------------------------------
How it was calculated:
1. Each course's letter grade is mapped to scholastic grade points (e.g., A=4.0, B+=3.3, B=3.0, etc.).
2. Quality Points (QP) are calculated for each course: Grade Points * Credit Hours.
3. Sum of all Quality Points (${results.qualityPoints.toFixed(2)}) is divided by Total Credit Hours (${results.totalCredits}) to obtain the weighted GPA.
   Formula: GPA = Total Quality Points / Total Credit Hours.
-----------------------------------------
Evaluate yours at: ${window.location.href}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusLabel = (gpa: number) => {
    if (gpa >= 3.8) return { label: 'Summa Cum Laude / High Honor', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
    if (gpa >= 3.5) return { label: "Dean's List Standing", color: 'text-green-700 bg-green-50 border-green-100' };
    if (gpa >= 2.0) return { label: 'Good Academic Standing', color: 'text-blue-700 bg-blue-50 border-blue-100' };
    return { label: 'Academic Warning / Probation', color: 'text-red-700 bg-red-50 border-red-100' };
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="gpa-calc-breadcrumb" />

        <AdSensePlaceholder type="top-banner" id="gpa-top-ad" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Academic <span className="text-blue-700">GPA Calculator</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Organize coursework semester profiles, credit loads, and letter grades to calculate weighted academic averages instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel course sheets */}
          <section className="lg:col-span-6 space-y-6">
            <CalculatorCard
              id="gpa-course-card"
              title="Course Enrollment Ledger"
              description="Write course names, grade marks, and corresponding credits."
            >
              <form onSubmit={handleCalculate} className="space-y-4">
                <div className="space-y-3">
                  {courses.map((course, idx) => (
                    <div key={course.id} className="flex gap-2 items-center">
                      <div className="flex-grow grid grid-cols-12 gap-2">
                        <input
                          id={`course-name-${course.id}`}
                          aria-label={`Course ${idx + 1} Name`}
                          type="text"
                          placeholder="e.g. English"
                          value={course.name}
                          onChange={(e) => handleRowChange(course.id, 'name', e.target.value)}
                          className="col-span-5 font-sans text-xs sm:text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-hidden"
                        />
                        <select
                          id={`course-grade-${course.id}`}
                          aria-label={`Course ${idx + 1} Letter Grade`}
                          value={course.grade}
                          onChange={(e) => handleRowChange(course.id, 'grade', e.target.value)}
                          className="col-span-4 font-sans text-xs sm:text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-2 py-2 outline-hidden"
                        >
                          {Object.keys(GRADE_POINTS_MAP).map((grade) => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                        <input
                          id={`course-credits-${course.id}`}
                          aria-label={`Course ${idx + 1} Credit Hours`}
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Credits"
                          value={course.credits}
                          onChange={(e) => handleRowChange(course.id, 'credits', e.target.value)}
                          className="col-span-3 font-sans text-xs sm:text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-2 py-2 outline-hidden text-center"
                        />
                      </div>
                      <button
                        id={`delete-course-btn-${course.id}`}
                        type="button"
                        onClick={() => handleRemoveRow(course.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    id="add-course-row-btn"
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    + Add Course Row
                  </button>
                </div>

                {error && <p className="text-xs text-red-600 font-sans font-medium">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button
                    id="gpa-calculate-btn"
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Calculate GPA
                  </Button>
                  <Button
                    id="gpa-reset-btn"
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

          {/* Right panel output reports */}
          <section className="lg:col-span-6">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <CalculatorCard id="gpa-results-primary">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-sans font-bold text-blue-800">Academic Standing</h3>
                    </div>
                    <div className="relative">
                      <Button
                        id="copy-gpa-btn"
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
                      Calculated Semester GPA:
                    </div>
                    <div className="text-5xl font-sans font-extrabold text-blue-800 mt-2">
                      {results.gpa.toFixed(3)}
                    </div>
                    
                    {/* Standing status label */}
                    <div className={`mt-4 inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getStatusLabel(results.gpa).color}`}>
                      {getStatusLabel(results.gpa).label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border border-gray-100 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Quality Points</div>
                      <div className="text-2xl font-sans font-extrabold text-blue-800 mt-1">
                        {results.qualityPoints.toFixed(2)}
                      </div>
                    </div>
                    <div className="border border-gray-100 p-4 rounded-xl">
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Total Credit Hours</div>
                      <div className="text-2xl font-sans font-extrabold text-blue-800 mt-1">
                        {results.totalCredits}
                      </div>
                    </div>
                  </div>
                </CalculatorCard>

                {/* Show Steps Toggle & Content */}
                <div className="mt-4">
                  <Button
                    id="show-steps-gpa"
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
                      <p>Here is exactly how your Semester Grade Point Average (GPA) was calculated:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Convert Grades to Points:</strong> Multiplied each course's credit hours by its assigned letter grade points:
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {courses.filter(r => r.grade && r.credits).map((r, i) => (
                              <li key={i}>{r.name || `Course ${i+1}`}: Grade {r.grade} ({GRADE_POINTS_MAP[r.grade]} pts) &times; {r.credits} credits = <strong>{(GRADE_POINTS_MAP[r.grade] * parseFloat(r.credits)).toFixed(2)}</strong> quality points.</li>
                            ))}
                          </ul>
                        </li>
                        <li><strong>Sum total quality points:</strong> {courses.filter(r => r.grade && r.credits).map((r, i) => `${(GRADE_POINTS_MAP[r.grade] * parseFloat(r.credits)).toFixed(1)}`).join(' + ')} = <strong>{results.qualityPoints.toFixed(2)}</strong> total quality points.</li>
                        <li><strong>Sum total credit hours:</strong> {courses.filter(r => r.grade && r.credits).map(r => r.credits).join(' + ')} = <strong>{results.totalCredits}</strong> credits.</li>
                        <li><strong>Divide points by credits:</strong> {results.qualityPoints.toFixed(2)} / {results.totalCredits} = <strong>{results.gpa.toFixed(3)}</strong>.</li>
                      </ol>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] bg-gray-50/40 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all">
                <Sparkles className="h-10 w-10 text-gray-300 mb-3 animate-pulse" />
                <h3 className="text-md font-sans font-semibold text-blue-800 mb-1">Awaiting Academic Ledger</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs leading-relaxed">
                  Provide your courses, letter grade marks, and credit hour loads to calculate weighted GPA indexes.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Inline Ad Banner - Middle Content */}
        <AdSensePlaceholder type="in-content" id="gpa-mid-ad" />

        {/* Informative educational content */}
        <section className="mt-16 space-y-12">
          {/* How to Use and Formula */}
          <div className="grid gap-8 md:grid-cols-2 border-t border-gray-100 pt-12">
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">How to Calculate Semester GPA</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-500 font-sans list-disc pl-5">
                <li>Input your corresponding courses names inside the ledger.</li>
                <li>Select the assigned letter grade from the dropdown list.</li>
                <li>Assign the corresponding course credit load (e.g. 3 credits, 4 credits).</li>
                <li>Click **Calculate GPA** to compile total credit scores and honor rolls.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-blue-800 mb-3">Weighted Mathematical Equation</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed mb-3">
                GPAs are weighted based on quality points:
              </p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-xs text-gray-500 text-center">
                GPA = &Sigma;(GradePoints &times; CreditHours) / &Sigma;CreditHours
              </div>
            </div>
          </div>

          {/* Scale Legend Map */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-md font-sans font-bold text-blue-800 mb-3">Standard Letter Scale Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-gray-600">
              <div className="bg-white p-3 rounded-xl border border-gray-100">A / A+ = 4.0 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">A- = 3.7 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">B+ = 3.3 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">B = 3.0 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">B- = 2.7 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">C+ = 2.3 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">C = 2.0 points</div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">D = 1.0 points</div>
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
                <strong>1. Zero-Credit Courses:</strong> Entering a course with zero credits triggers a validation warning because dividing by zero results in an undefined mathematical GPA state.
              </p>
              <p>
                <strong>2. Row Synchronization:</strong> Removing rows can cause React index key shifting. CalcNest resolves this by assigning cryptographic, immutable key strings (`c.id`) to every row rather than array indexes.
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

        <AdSensePlaceholder type="bottom-ad" id="gpa-bottom-ad" />
      </div>
    </main>
  );
}
