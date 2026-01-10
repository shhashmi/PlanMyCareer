import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
