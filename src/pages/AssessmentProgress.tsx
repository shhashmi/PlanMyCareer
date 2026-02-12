import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { getAssessmentStatus } from '../services/agentService';
import { ErrorAlert, ComingSoonModal, Modal, ProgressBar } from '../components/ui';
import { getLevelColor } from '../data/skillsData';
import { isAdvancedAssessmentBeta } from '../data/assessmentData';
import { BasicAssessmentTile, AdvancedAssessmentTile } from '../components/assessment';
import SEOHead from '../components/SEOHead';
import type { AdvancedAssessmentSummary } from '../types/api.types';
import type { IncompleteAssessmentSession } from '../types/context.types';

export default function AssessmentProgress() {
  const navigate = useNavigateWithParams();
  const {
    isLoggedIn,
    setIncompleteAssessment,
    profileData,
    skills,
    apiProfile,
    refreshPaidStatus
  } = useApp();

  // Assessment state: fetched independently on mount
  const [basicAssessment, setBasicAssessment] = useState<IncompleteAssessmentSession | null>(null);
  const [advancedAssessment, setAdvancedAssessment] = useState<AdvancedAssessmentSummary | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [assessedSkillNames, setAssessedSkillNames] = useState<string[] | null>(null);
  const [skillsLoading, setSkillsLoading] = useState(true);

  const isProduction = import.meta.env.PROD;

  const basicInProgress = !!basicAssessment;
  const advancedInProgress = advancedAssessment?.status === 'in_progress';

  // Fetch both assessment states on mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchAssessments = async () => {
      try {
        const [basicResult, advancedResult] = await Promise.all([
          assessmentService.checkIncompleteAssessment(),
          getAssessmentStatus().catch(() => ({ data: null, can_start_new: true }))
        ]);

        const basicData = basicResult.success ? basicResult.data ?? null : null;
        const advancedData = advancedResult.data ?? null;

        setBasicAssessment(basicData);
        setAdvancedAssessment(advancedData);

        // Sync basic assessment to context
        if (basicData) {
          setIncompleteAssessment(basicData);
        }

        // If neither is in progress, redirect to /skills
        const hasBasic = !!basicData;
        const hasAdvanced = advancedData?.status === 'in_progress';
        if (!hasBasic && !hasAdvanced) {
          navigate('/skills');
        }
      } catch (err) {
        console.error('Failed to fetch assessment states:', err);
        navigate('/skills');
      } finally {
        setPageLoading(false);
      }
    };

    fetchAssessments();
  }, [isLoggedIn, navigate, setIncompleteAssessment]);

  // Fetch assessed skill names from API (only when basic is in progress)
  const fetchAssessedSkills = useCallback(async () => {
    try {
      const [resumeResponse, dimensionsResponse] = await Promise.all([
        assessmentService.resumeAssessment(),
        assessmentService.getCachedDimensions()
      ]);

      if (resumeResponse.success && resumeResponse.data?.questions && dimensionsResponse.length > 0) {
        const uniqueDimensionCodes = [...new Set(
          resumeResponse.data.questions.map(q => q.dimension)
        )];

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

  // Fetch basic assessed skills when basic is in progress and not loading
  useEffect(() => {
    if (!pageLoading && basicInProgress && !advancedInProgress) {
      fetchAssessedSkills();
    } else if (!pageLoading) {
      setSkillsLoading(false);
    }
  }, [pageLoading, basicInProgress, advancedInProgress, fetchAssessedSkills]);

  // Filter skills to only show assessed ones (basic-only view)
  // Must be called before any early returns to satisfy Rules of Hooks
  const displayedSkills = useMemo(() => {
    if (skillsLoading) return [];
    if (assessedSkillNames && assessedSkillNames.length > 0) {
      return skills.filter(s => assessedSkillNames.includes(s.name));
    }
    return skills;
  }, [skills, assessedSkillNames, skillsLoading]);

  // Loading state
  if (pageLoading) {
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
    if (!basicAssessment) return;
    setResetLoading(true);
    setError(null);
    try {
      const response = await assessmentService.resetSession(basicAssessment.session_id);

      if (response.success) {
        setIncompleteAssessment(null);
        setBasicAssessment(null);
        // If advanced is also not in progress, redirect
        if (!advancedInProgress) {
          navigate('/skills');
        }
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

  const handleAdvancedClick = async () => {
    await refreshPaidStatus();
    // If basic is in progress, show reset warning before starting advanced
    if (basicInProgress) {
      setShowResetWarning(true);
      return;
    }

    if (isAdvancedAssessmentBeta()) {
      navigate('/advanced-assessment');
    } else if (isProduction) {
      setShowComingSoon(true);
    } else {
      navigate('/payment');
    }
  };

  const handleConfirmResetAndStartAdvanced = async () => {
    if (!basicAssessment) return;
    setResetLoading(true);
    setError(null);
    try {
      const response = await assessmentService.resetSession(basicAssessment.session_id);
      if (response.success) {
        setIncompleteAssessment(null);
        setBasicAssessment(null);
        setShowResetWarning(false);
        navigate('/advanced-assessment');
      } else {
        setError(response.error?.message || 'Failed to reset basic assessment.');
        setShowResetWarning(false);
      }
    } catch (err) {
      console.error('Failed to reset basic assessment:', err);
      setError('An unexpected error occurred. Please try again.');
      setShowResetWarning(false);
    } finally {
      setResetLoading(false);
    }
  };

  const progress = basicAssessment
    ? Math.round((basicAssessment.answered_count / basicAssessment.total_questions) * 100)
    : 0;

  // Get role and company from profileData or apiProfile
  const role = profileData?.role || apiProfile?.metadata?.role || 'Professional';
  const company = profileData?.company || apiProfile?.metadata?.company || 'your organization';

  // Determine banner text
  const bannerText = advancedInProgress
    ? 'You Already Have an Advanced Assessment in Progress!'
    : 'You Already Have a Basic Assessment in Progress!';

  // Determine competencies display
  const showBasicCompetencies = basicInProgress && !advancedInProgress;
  const showAdvancedFluencies = advancedInProgress && advancedAssessment?.fluencies?.length;

  // Compute competency count for subtitle
  const competencyCount = showAdvancedFluencies
    ? advancedAssessment.fluencies.length
    : (skillsLoading ? null : displayedSkills.length);

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '40px 24px'
    }}>
      <SEOHead />
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
              {bannerText}
            </span>
          </motion.div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            As a <strong>{role}</strong> at <strong>{company}</strong>, you're being assessed on {competencyCount ?? '...'} {advancedInProgress ? 'fluencies' : 'competencies'} to identify skill gaps and growth areas
          </p>
        </motion.div>

        {/* SECTION 2a: Advanced Fluencies Tags (when advanced in progress) */}
        {showAdvancedFluencies && (
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
              {advancedAssessment.fluencies.map((fluency, index) => (
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
                  <CheckCircle size={14} color="var(--primary-light)" />
                  {fluency.name}
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(20, 184, 166, 0.15)',
                    color: 'var(--primary-light)',
                    textTransform: 'capitalize'
                  }}>
                    {fluency.target_level}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 2b: Basic Competencies Grid (when only basic in progress) */}
        {showBasicCompetencies && displayedSkills.length > 0 && (
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
          gridTemplateColumns: advancedInProgress
            ? '1fr'
            : 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '24px',
          alignItems: 'start',
          maxWidth: advancedInProgress ? '480px' : undefined,
          margin: advancedInProgress ? '0 auto' : undefined
        }}>

          {/* Basic Assessment Tile — hidden when advanced (or both) in progress */}
          {basicInProgress && !advancedInProgress && (
            <BasicAssessmentTile
              animationDelay={0.2}
              animationDirection="left"
              style={{ border: '2px solid var(--primary)' }}
              showPaymentTier={false}
              showDescription={false}
            >
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
                    {basicAssessment.answered_count} / {basicAssessment.total_questions} questions
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
            </BasicAssessmentTile>
          )}

          {/* Advanced Assessment Tile */}
          {advancedInProgress ? (
            // Reduced tile: no payment/description, tile handles its own status/buttons
            <AdvancedAssessmentTile
              onClick={() => navigate('/advanced-assessment')}
              animationDelay={0.2}
              animationDirection="left"
              showPaymentTier={false}
              showDescription={false}
              style={{ border: '2px solid var(--primary)' }}
            />
          ) : (
            // Full tile when only basic in progress
            <AdvancedAssessmentTile
              onClick={handleAdvancedClick}
              animationDelay={0.3}
              animationDirection="right"
              style={{ border: '2px solid var(--border)' }}
            />
          )}
        </div>

        {/* Reset Warning Modal (basic → advanced) */}
        <Modal
          isOpen={showResetWarning}
          onClose={() => setShowResetWarning(false)}
          title="Reset Basic Assessment?"
          maxWidth="440px"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
            <AlertTriangle size={24} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              You have a basic assessment in progress. Starting an advanced assessment will <strong>reset your current progress</strong>. Do you want to continue?
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowResetWarning(false)}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmResetAndStartAdvanced}
              disabled={resetLoading}
              style={{
                padding: '10px 20px',
                background: 'var(--gradient-1)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: resetLoading ? 'wait' : 'pointer',
                opacity: resetLoading ? 0.7 : 1
              }}
            >
              {resetLoading ? 'Resetting...' : 'Continue'}
            </button>
          </div>
        </Modal>

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </div>
  );
}
