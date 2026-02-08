import { useState, useMemo, useCallback } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { ComingSoonModal, ErrorAlert } from '../components/ui';
import { BasicAssessmentTile, AdvancedAssessmentTile, FluencySelector } from '../components/assessment';
import { isAdvancedAssessmentBeta } from '../data/assessmentData';
import { splitSkillsByPriority, getSkillNamesFromCodes } from '../utils/profileUtils';
import SEOHead from '../components/SEOHead';

export default function AssessmentChoice() {
  const navigate = useNavigateWithParams()
  const { isLoggedIn, skills, loading, apiProfile } = useApp()
  const [startingAssessment, setStartingAssessment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null)

  const MAX_SELECTIONS = 4;

  // Initialize selected skill codes with top priority skills
  const [selectedSkillCodes, setSelectedSkillCodes] = useState<Set<string>>(() => {
    if (!apiProfile?.profile) return new Set();
    const sorted = splitSkillsByPriority(apiProfile.profile, MAX_SELECTIONS);
    return new Set(sorted.priority.map(s => s.code));
  });

  const isProduction = import.meta.env.PROD

  // Get selected skill names for API
  const selectedSkillNames = useMemo(() => {
    if (!apiProfile?.profile) return [];
    return getSkillNamesFromCodes(apiProfile.profile, Array.from(selectedSkillCodes));
  }, [apiProfile, selectedSkillCodes]);

  const handleFluencyChange = useCallback((codes: Set<string>) => {
    setSelectionWarning(null);
    if (codes.size > MAX_SELECTIONS) {
      setSelectionWarning(`Maximum ${MAX_SELECTIONS} fluencies can be selected. Uncheck one to select another.`);
      return;
    }
    setSelectedSkillCodes(codes);
  }, []);

  if (loading) {
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
    )
  }

  if (!isLoggedIn) {
    navigate('/login')
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Redirecting...</p>
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
    )
  }

  const handleStartBasicAssessment = async () => {
    if (!apiProfile) {
      setError('Profile data not available. Please complete your profile first.')
      return
    }

    setStartingAssessment(true)
    setError(null)

    try {
      const request = await assessmentService.buildStartRequest(apiProfile, 'basic', 15, selectedSkillNames)
      const response = await assessmentService.startAssessment(request)

      if (response.success && response.data) {
        // Store session data and navigate to assessment
        navigate('/basic-assessment', { state: { assessmentData: response.data } })
      } else {
        setError(response.error?.message || 'Failed to start assessment')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setStartingAssessment(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <SEOHead />
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Choose Your Assessment Type
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Select how you'd like to assess your AI skills
          </p>
        </motion.div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Selection Warning */}
        {selectionWarning && (
          <ErrorAlert
            message={selectionWarning}
            variant="warning"
            onDismiss={() => setSelectionWarning(null)}
          />
        )}

        {/* Skill Selection */}
        {apiProfile?.profile && apiProfile.profile.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <FluencySelector
              skills={apiProfile.profile}
              selectedCodes={selectedSkillCodes}
              onSelectionChange={handleFluencyChange}
              maxSelections={MAX_SELECTIONS}
            />
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <BasicAssessmentTile
            onClick={handleStartBasicAssessment}
            cursor={startingAssessment ? 'wait' : 'pointer'}
            dimmed={startingAssessment}
            animationDelay={0.1}
            animationDirection="left"
          >
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={startingAssessment}
            >
              {startingAssessment ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  Start Basic Assessment
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </BasicAssessmentTile>

          <AdvancedAssessmentTile
            onClick={() => {
              if (isAdvancedAssessmentBeta()) {
                navigate('/advanced-assessment', {
                  state: { selectedSkillCodes: Array.from(selectedSkillCodes) }
                });
              } else if (isProduction) {
                setShowComingSoon(true);
              } else {
                navigate('/payment');
              }
            }}
            animationDelay={0.2}
            animationDirection="right"
          />
        </div>
      </div>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  )
}
