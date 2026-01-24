import { useEffect } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute';
import { initGA } from './lib/analytics';
import { useAnalytics } from './hooks/useAnalytics';
import { useApp } from './context/AppContext';
import { fluencyService } from './services/fluencyService';

function AppRoutes() {
  useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, loading, setSkills, setProfileData, setApiProfile } = useApp();

  useEffect(() => {
    // Only run this logic if logged in and not on a specific sub-page that handles its own logic
    // and if we are at the root or just logged in
    const publicPaths = ['/login', '/privacy-policy', '/terms-of-use'];
    if (!isLoggedIn || loading || publicPaths.includes(location.pathname)) {
      return;
    }

    const handleNavigation = async () => {
      try {
        // 1. Check if user has a profile
        const profileResponse = await fluencyService.getProfile();

        if (!profileResponse.success || !profileResponse.data) {
          // Requirement 3: No profile -> /profile
          if (location.pathname !== '/profile') {
            navigate('/profile');
          }
          return;
        }

        // Store profile data in context
        const profileData = profileResponse.data;
        setProfileData(profileData);

        // 2. Check for incomplete assessment session
        const sessionResponse = await fluencyService.getIncompleteSession();

        if (sessionResponse.success && sessionResponse.data?.has_incomplete) {
          // Requirement 5: Incomplete session -> /assessment
          if (location.pathname === '/') {
            navigate('/assessment');
          }
          return;
        }

        // Requirement 4: Has profile and no incomplete session -> /skills
        if (location.pathname === '/') {
          // To land on /skills, we usually need the analyzed skills in context
          // If they aren't there, we should resolve them first
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
            navigate('/skills');
          }
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    handleNavigation();
  }, [isLoggedIn, loading, navigate, location.pathname, setSkills, setProfileData, setApiProfile]);

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
