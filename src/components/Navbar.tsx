import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Calculator, Menu, X, ChevronDown, Clock, HelpCircle, ExternalLink } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  desc: string;
  category: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close the dropdown whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle outside clicks to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: 'Age Calculator', path: '/age-calculator', desc: 'Calculate exact age, leaps, and days', category: 'General' },
    { name: 'Percentage Calculator', path: '/percentage-calculator', desc: 'Find increase, decrease, and proportions', category: 'Math' },
    { name: 'BMI Calculator', path: '/bmi-calculator', desc: 'Check body mass indexing & healthy weights', category: 'Health' },
    { name: 'Days Spacing', path: '/days-between-dates', desc: 'Count precise days, weeks, and workdays', category: 'General' },
    { name: 'Discount Calculator', path: '/discount-calculator', desc: 'Deduce net prices, savings, and clearance taxes', category: 'Financial' },
    { name: 'Loan Calculator', path: '/loan-calculator', desc: 'Amortize installments, interest, and early payoffs', category: 'Financial' },
    { name: 'Average Calculator', path: '/average-calculator', desc: 'Analyze mean, median, mode, and deviations', category: 'Math' },
    { name: 'Unit Converter', path: '/unit-converter', desc: 'Convert length, weight, area, and temperature', category: 'Utility' },
    { name: 'GPA Calculator', path: '/gpa-calculator', desc: 'Calculate weighted cumulative & semester GPAs', category: 'Education' },
    { name: 'Scientific Calculator', path: '/scientific-calculator', desc: 'Solve advanced engineering trig & PEMDAS formulas', category: 'Math' },
  ];

  const utilityItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Support', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Disclaimer', path: '/disclaimer' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs" ref={dropdownRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            id="brand-logo"
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-blue-700">
              Calc<span className="text-blue-900 font-extrabold">Nest</span>
            </span>
          </Link>

          {/* Quick nav links for standard utility pages on desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-blue-700 transition-colors font-sans">
              Home
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-500 hover:text-blue-700 transition-colors font-sans">
              About
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-gray-500 hover:text-blue-700 transition-colors font-sans">
              Contact
            </Link>
          </div>

          {/* Three-Line Menu Toggle Trigger for Desktop & Mobile */}
          <div className="flex items-center gap-2">
            <button
              id="unified-menu-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-100 px-3.5 py-2 text-sm font-bold text-blue-700 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-100 transition-all focus:outline-hidden cursor-pointer"
              aria-expanded={isOpen}
              aria-label="Toggle calculators navigation drawer"
            >
              {isOpen ? <X className="h-4.5 w-4.5 text-blue-800" /> : <Menu className="h-4.5 w-4.5 text-blue-700" />}
              <span className="hidden sm:inline">Calculators</span>
            </button>
          </div>

        </div>
      </div>

      {/* Unified Expandable Full-Width Dropdown Portal */}
      {isOpen && (
        <div 
          id="unified-dropdown-menu" 
          className="absolute left-0 right-0 top-16 w-full border-b border-gray-150 bg-white shadow-2xl transition-all duration-200 z-50 overflow-y-auto max-h-[85vh]"
        >
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 columns: Grid list of calculators organized beautifully */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-widest">
                  Select a Calculator Tool
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex flex-col gap-1 p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-blue-50/50 border-blue-200 text-blue-800 shadow-xs'
                          : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 text-gray-800'
                      }`
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-blue-800 group-hover:text-blue-900 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed group-hover:text-gray-500 transition-colors">
                      {item.desc}
                    </p>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right 4 columns: Static pages navigation and helpful info */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-widest">
                    Quick Resources
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {utilityItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4.5 w-4.5 text-blue-700" />
                  <h4 className="font-sans font-bold text-sm text-blue-800">Why CalcNest?</h4>
                </div>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  CalcNest develops lightweight, accessible mathematical software. Built for standard precision calculations and high response speed on any screen size.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
