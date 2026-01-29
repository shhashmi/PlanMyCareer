import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  RotateCcw,
  ClipboardList,
  Sparkles,
  Check,
  Crown,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { ErrorAlert, ComingSoonModal, ProgressBar } from '../components/ui';
import { getLevelColor } from '../data/skillsData';
import { BASIC_ASSESSMENT_FEATURES, ADVANCED_ASSESSMENT_FEATURES } from '../data/assessmentData';

export default function AssessmentProgress() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    incompleteAssessment,
    setIncompleteAssessment,
    profileData,
    skills,
    apiProfile
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [assessedSkillNames, setAssessedSkillNames] = useState<string[] | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const isProduction = import.meta.env.PROD;

  // Fetch assessed skill names from API
  const fetchAssessedSkills = useCallback(async () => {
    try {
      const [resumeResponse, dimensionsResponse] = await Promise.all([
        assessmentService.resumeAssessment(),
        assessmentService.getCachedDimensions()
      ]);

      if (resumeResponse.success && resumeResponse.data?.questions && dimensionsResponse.length > 0) {
        // Extract unique dimension codes from questions
        const uniqueDimensionCodes = [...new Set(
          resumeResponse.data.questions.map(q => q.dimension)
        )];

        // Map dimension codes to skill names
        const codeToName: Record<string, string> = {};
        dimensionsResponse.forEach(dim => {
          codeToName[dim.dimension_code] = dim.name;
        });

        const skillNames = uniqueDimensionCodes
          .map(code => codeToName[code])
          .filter((name): name is string => !!name);

        if (skillNames.length > 0) {
          setAssessedSkillNames(skillNames);
        }
      }
    } catch (err) {
      console.error('Failed to fetch assessed skills:', err);
    } finally {
      setSkillsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!incompleteAssessment) {
      navigate('/skills');
      return;
    }

    // Fetch assessed skills when component mounts
    fetchAssessedSkills();
  }, [isLoggedIn, incompleteAssessment, navigate, fetchAssessedSkills]);

  if (!incompleteAssessment) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Loading...</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  const handleResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.resumeAssessment();
      if (response.success && response.data) {
        navigate('/basic-assessment', { state: { assessmentData: response.data } });
      } else {
        setError(response.error?.message || 'Failed to resume assessment. Please try again.');
      }
    } catch (err) {
      console.error('Failed to resume assessment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetLoading(true);
    setError(null);
    try {
      const response = await assessmentService.resetSession(incompleteAssessment.session_id);

      if (response.success) {
        setIncompleteAssessment(null);
        navigate('/skills');
      } else {
        setError(response.error?.message || 'Failed to reset assessment. Please try again.');
      }
    } catch (err) {
      console.error('Failed to reset assessment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const progress = Math.round((incompleteAssessment.answered_count / incompleteAssessment.total_questions) * 100);

  // Filter skills to only show assessed ones (use state from API/localStorage)
  const displayedSkills = useMemo(() => {
    if (skillsLoading) return [];
    if (assessedSkillNames && assessedSkillNames.length > 0) {
      return skills.filter(s => assessedSkillNames.includes(s.name));
    }
    return skills;
  }, [skills, assessedSkillNames, skillsLoading]);

  // Get role and company from profileData or apiProfile
  const role = profileData?.role || apiProfile?.metadata?.role || 'Professional';
  const company = profileData?.company || apiProfile?.metadata?.company || 'your organization';

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '40px 24px'
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        {/* SECTION 1: Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          {/* Prominent "In Progress" Banner */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 28px',
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              borderRadius: '16px',
              border: '2px solid var(--primary)',
              marginBottom: '24px'
            }}
          >
            <PlayCircle size={28} color="var(--primary-light)" />
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--primary-light)'
            }}>
              You Already Have Basic Assessment in Progress!
            </span>
          </motion.div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            As a <strong>{role}</strong> at <strong>{company}</strong>, you're being assessed on {skillsLoading ? '...' : displayedSkills.length} competencies to identify skill gaps and growth areas
          </p>
        </motion.div>

        {/* SECTION 2: Competencies Grid */}
        {displayedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: '40px' }}
          >
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center'
            }}>
              {displayedSkills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: 'var(--surface)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    fontSize: '13px'
                  }}
                >
                  <CheckCircle size={14} color={getLevelColor(skill.level)} />
                  {skill.name}
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${getLevelColor(skill.level)}20`,
                    color: getLevelColor(skill.level),
                    textTransform: 'capitalize'
                  }}>
                    {skill.level}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error display */}
        {error && (
          <div style={{ marginBottom: '24px' }}>
            <ErrorAlert message={error} />
          </div>
        )}

        {/* SECTION 3: Assessment Tiles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '24px'
        }}>

          {/* Basic Assessment Tile (with progress) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--primary)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(20, 184, 166, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <ClipboardList size={28} color="var(--primary-light)" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Basic Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              A quick, personalized evaluation with instant insights
            </p>

            <div style={{
              background: 'rgba(20, 184, 166, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>Free</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>5-10 minutes</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {BASIC_ASSESSMENT_FEATURES.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Progress Section */}
            <div style={{
              background: 'var(--surface-light)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Progress</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                  {incompleteAssessment.answered_count} / {incompleteAssessment.total_questions} questions
                </span>
              </div>
              <ProgressBar progress={progress} height={8} />
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'right', marginTop: '8px' }}>
                {progress}% complete
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button
                onClick={handleReset}
                disabled={resetLoading}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: resetLoading ? 'wait' : 'pointer',
                  opacity: resetLoading ? 0.7 : 1
                }}
              >
                <RotateCcw size={18} />
                {resetLoading ? 'Resetting...' : 'Reset'}
              </button>

              <button
                onClick={handleResume}
                disabled={loading}
                style={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: 'var(--gradient-1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <PlayCircle size={18} />
                {loading ? 'Resuming...' : 'Resume Assessment'}
              </button>
            </div>
          </motion.div>

          {/* Advanced Assessment Tile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => isProduction ? setShowComingSoon(true) : navigate('/payment')}
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--border)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'var(--gradient-1)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Crown size={14} />
              RECOMMENDED
            </div>

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Sparkles size={28} color="white" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Advanced Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Comprehensive evaluation with structured learning and hands-on practice
            </p>

            <div style={{
              background: 'rgba(20, 184, 166, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>$20</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>one-time</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px', flex: 1 }}>
              {ADVANCED_ASSESSMENT_FEATURES.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
            >
              Get Advanced Assessment
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </div>
  );
}
