import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, ArrowRight, Check, Crown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { ComingSoonModal } from '../components/ui';
import { BASIC_ASSESSMENT_FEATURES, ADVANCED_ASSESSMENT_FEATURES } from '../data/assessmentData';

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
    const sorted = [...apiProfile.profile].sort((a, b) => a.priority - b.priority);
    return { priority: sorted.slice(0, 4), remaining: sorted.slice(4) };
  }, [apiProfile]);

  const hasExtraSkills = sortedSkills.remaining.length > 0;
  const selectedSkills = includeAllSkills
    ? apiProfile?.profile.map(s => s.name) || []
    : sortedSkills.priority.map(s => s.name);

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleStartBasicAssessment}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--border)',
              cursor: startingAssessment ? 'wait' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: startingAssessment ? 0.7 : 1
            }}
            whileHover={!startingAssessment ? { borderColor: 'var(--primary)', scale: 1.02 } : {}}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => isProduction ? setShowComingSoon(true) : navigate('/payment')}
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--primary)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.02 }}
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

            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {ADVANCED_ASSESSMENT_FEATURES.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Get Advanced Assessment
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  )
}
