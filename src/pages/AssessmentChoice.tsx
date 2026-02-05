import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { ComingSoonModal } from '../components/ui';
import { BasicAssessmentTile, AdvancedAssessmentTile } from '../components/assessment';
import { IS_ADVANCED_ASSESSMENT_BETA } from '../data/assessmentData';
import { splitSkillsByPriority, getSkillNamesForAssessment } from '../utils/profileUtils';

export default function AssessmentChoice() {
  const navigate = useNavigate()
  const { isLoggedIn, skills, loading, apiProfile } = useApp()
  const [startingAssessment, setStartingAssessment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [includeAllSkills, setIncludeAllSkills] = useState(false)

  const isProduction = import.meta.env.PROD

  // Sort skills by priority and split into priority (top 4) and remaining
  const sortedSkills = useMemo(() => {
    if (!apiProfile?.profile) return { priority: [], remaining: [] };
    return splitSkillsByPriority(apiProfile.profile);
  }, [apiProfile]);

  const hasExtraSkills = sortedSkills.remaining.length > 0;
  const selectedSkills = apiProfile?.profile
    ? getSkillNamesForAssessment(apiProfile.profile, includeAllSkills)
    : [];

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
      const request = await assessmentService.buildStartRequest(apiProfile, 'basic', 15, selectedSkills)
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

        {/* Skill Selection Banner */}
        {sortedSkills.priority.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: 'rgba(20, 184, 166, 0.06)',
              border: '1px solid rgba(20, 184, 166, 0.15)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Sparkles size={18} color="var(--primary-light)" />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Assessing skills most relevant to your daily work
              </span>
            </div>

            {/* Skill chips row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: hasExtraSkills ? '16px' : 0 }}>
              {(includeAllSkills ? apiProfile?.profile || [] : sortedSkills.priority).map(skill => (
                <div key={skill.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                  <Check size={14} color="var(--primary-light)" />
                  {skill.name}
                </div>
              ))}
            </div>

            {/* Include all checkbox */}
            {hasExtraSkills && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeAllSkills}
                  onChange={(e) => setIncludeAllSkills(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {includeAllSkills
                    ? `Assess on top priority skills`
                    : `Include all ${apiProfile?.profile.length} skills`
                  }
                </span>
              </label>
            )}
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
              if (IS_ADVANCED_ASSESSMENT_BETA) {
                navigate('/advanced-assessment');
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
