import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Login from './pages/Login';
import AssessmentChoice from './pages/AssessmentChoice';
import BasicAssessment from './pages/BasicAssessment';
import BasicResults from './pages/BasicResults';
import Payment from './pages/Payment';
import AdvancedAssessment from './pages/AdvancedAssessment';
import AdvancedResults from './pages/AdvancedResults';
import UpskillPlan from './pages/UpskillPlan';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Profile from './pages/Profile';
import ResumeAssessment from './pages/ResumeAssessment';
import AssessmentProgress from './pages/AssessmentProgress';
import AuthCallback from './pages/AuthCallback';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { initGA } from './lib/analytics';
import { useAnalytics } from './hooks/useAnalytics';

function AppRoutes() {
  useAnalytics();
  
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/assessment" element={<ProtectedRoute><AssessmentChoice /></ProtectedRoute>} />
      <Route path="/basic-assessment" element={<ProtectedRoute><BasicAssessment /></ProtectedRoute>} />
      <Route path="/basic-results" element={<ProtectedRoute><BasicResults /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/advanced-assessment" element={<ProtectedRoute><AdvancedAssessment /></ProtectedRoute>} />
      <Route path="/advanced-results" element={<ProtectedRoute><AdvancedResults /></ProtectedRoute>} />
      <Route path="/upskill-plan" element={<ProtectedRoute><UpskillPlan /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resume-assessment" element={<ProtectedRoute><ResumeAssessment /></ProtectedRoute>} />
      <Route path="/assessment-progress" element={<ProtectedRoute><AssessmentProgress /></ProtectedRoute>} />
    </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  return (
    <div className="app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ErrorBoundary>
        <Header />
        <AppRoutes />
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
