import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { initGA } from './lib/analytics';
import { useAnalytics } from './hooks/useAnalytics';
import { useUTMTracking } from './hooks/useUTMTracking';
import { captureQueryParams } from './utils/queryParamStore';

const Skills = lazy(() => import('./pages/Skills'));
const Login = lazy(() => import('./pages/Login'));
const AssessmentChoice = lazy(() => import('./pages/AssessmentChoice'));
const BasicAssessment = lazy(() => import('./pages/BasicAssessment'));
const BasicResults = lazy(() => import('./pages/BasicResults'));
const Payment = lazy(() => import('./pages/Payment'));
const AdvancedAssessment = lazy(() => import('./pages/AdvancedAssessment'));
const AdvancedResults = lazy(() => import('./pages/AdvancedResults'));
const UpskillPlan = lazy(() => import('./pages/UpskillPlan'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Profile = lazy(() => import('./pages/Profile'));
const ResumeAssessment = lazy(() => import('./pages/ResumeAssessment'));
const AssessmentProgress = lazy(() => import('./pages/AssessmentProgress'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function AppRoutes() {
  const { search } = useLocation();
  captureQueryParams(search);
  useAnalytics();
  useUTMTracking();

  return (
    <>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
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
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resume-assessment" element={<ProtectedRoute><ResumeAssessment /></ProtectedRoute>} />
      <Route path="/assessment-progress" element={<ProtectedRoute><AssessmentProgress /></ProtectedRoute>} />
    </Routes>
    </Suspense>
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
        <main style={{ flex: 1 }}>
          <AppRoutes />
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
