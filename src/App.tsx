import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AgeCalculator from './pages/AgeCalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import BMICalculator from './pages/BMICalculator';
import DaysBetweenDates from './pages/DaysBetweenDates';
import DiscountCalculator from './pages/DiscountCalculator';
import LoanCalculator from './pages/LoanCalculator';
import AverageCalculator from './pages/AverageCalculator';
import UnitConverter from './pages/UnitConverter';
import GPACalculator from './pages/GPACalculator';
import ScientificCalculator from './pages/ScientificCalculator';
import ScrollToTop from './components/ScrollToTop';

import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white text-blue-700 transition-colors duration-200">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/days-between-dates" element={<DaysBetweenDates />} />
            <Route path="/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route path="/average-calculator" element={<AverageCalculator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/gpa-calculator" element={<GPACalculator />} />
            <Route path="/scientific-calculator" element={<ScientificCalculator />} />
            
            {/* Utility Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Fallback route back to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

