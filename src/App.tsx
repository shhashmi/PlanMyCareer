import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assessment" element={<AssessmentChoice />} />
        <Route path="/basic-assessment" element={<BasicAssessment />} />
        <Route path="/basic-results" element={<BasicResults />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/advanced-assessment" element={<AdvancedAssessment />} />
        <Route path="/advanced-results" element={<AdvancedResults />} />
        <Route path="/upskill-plan" element={<UpskillPlan />} />
      </Routes>
    </div>
  );
}

export default App;
