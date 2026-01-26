import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
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
import ResumeAssessment from './pages/ResumeAssessment';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import WeeklyPlan from './pages/WeeklyPlan';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Sitemap from './pages/Sitemap';
import RefundPolicy from './pages/RefundPolicy';
import ProtectedRoute from './components/ProtectedRoute';
import { initGA } from './lib/analytics';
import { useAnalytics } from './hooks/useAnalytics';
import { useApp } from './context/AppContext';
import { fluencyService } from './services/fluencyService';

function AppRoutes() {
  useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading, setSkills, setProfileData, setApiProfile, navigationTrigger } = useApp();
  const hasNavigated = useRef(false);

  // Reset navigation flag when triggerNavigation is called
  useEffect(() => {
    if (navigationTrigger > 0) {
      hasNavigated.current = false;
    }
  }, [navigationTrigger]);

  useEffect(() => {
    // Reset navigation flag when user logs out
    if (!isLoggedIn) {
      hasNavigated.current = false;
      return;
    }

    // Only run this logic once after login
    const publicPaths = ['/login', '/privacy-policy', '/terms-of-use'];
    if (loading || publicPaths.includes(location.pathname) || hasNavigated.current) {
      return;
    }

    const handleNavigation = async () => {
      try {
        // Check if user has a profile
        const profileResponse = await fluencyService.getProfile();

        // Validate that profile has required fields (not just an empty object)
        const profileData = profileResponse.data;
        const hasValidProfile = profileResponse.success &&
          profileData &&
          typeof profileData === 'object' &&
          profileData.role &&
          profileData.title;

        if (hasValidProfile) {
          // User has profile - set context data
          setProfileData(profileData);

          // Resolve skills for context
          const requestData = fluencyService.mapFormDataToRequest(profileData);
          const analyzeResponse = await fluencyService.resolveProfile(requestData);

          if (analyzeResponse.success && analyzeResponse.data) {
            setApiProfile(analyzeResponse.data);
            const apiSkills = analyzeResponse.data.profile.map((skill: any) => ({
              name: skill.name,
              level: skill.proficiency.toLowerCase(),
              description: skill.description
            }));
            setSkills(apiSkills);
          }

          hasNavigated.current = true;
          navigate('/assessment');
          return;
        }

        // No valid profile - navigate to home page to create profile
        console.log('No valid profile found, navigating to home page');
        hasNavigated.current = true;
        navigate('/');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    handleNavigation();
  }, [isLoggedIn, loading, navigate, location.pathname, setSkills, setProfileData, setApiProfile, navigationTrigger]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/login" element={<Login />} />
      <Route path="/assessment" element={<ProtectedRoute><AssessmentChoice /></ProtectedRoute>} />
      <Route path="/basic-assessment" element={<ProtectedRoute><BasicAssessment /></ProtectedRoute>} />
      <Route path="/basic-results" element={<ProtectedRoute><BasicResults /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/advanced-assessment" element={<ProtectedRoute><AdvancedAssessment /></ProtectedRoute>} />
      <Route path="/advanced-results" element={<ProtectedRoute><AdvancedResults /></ProtectedRoute>} />
      <Route path="/upskill-plan" element={<ProtectedRoute><UpskillPlan /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resume-assessment" element={<ProtectedRoute><ResumeAssessment /></ProtectedRoute>} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/weekly-plan" element={<ProtectedRoute><WeeklyPlan /></ProtectedRoute>} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
    </Routes>
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
      <Header />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
