import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Sparkles, ArrowRight, Check, Crown, Loader2, X, RefreshCw, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { fluencyService } from '../services/fluencyService';
import ConfirmationModal from '../components/ConfirmationModal';

export default function AssessmentChoice() {
  const navigate = useNavigate()
  const { isLoggedIn, skills, loading, apiProfile } = useApp()
  const [startingAssessment, setStartingAssessment] = useState(false)
  const [resettingSession, setResettingSession] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const [incompleteSession, setIncompleteSession] = useState<any | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [showResetModal, setShowResetModal] = useState(false);

  const isProduction = import.meta.env.PROD

  useEffect(() => {
    const checkIncompleteSession = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await fluencyService.getIncompleteSession();
        if (response.success && response.data?.has_incomplete) {
          setIncompleteSession(response.data.session);
        } else {
          setIncompleteSession(null);
        }
      } catch (err) {
        console.error('Error checking incomplete session:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkIncompleteSession();
  }, [isLoggedIn]);

  if (loading || checkingSession) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  if (!isLoggedIn || skills.length === 0) {
    navigate('/')
    return null
  }

  const handleStartBasicAssessment = async () => {
    if (!apiProfile) {
      setError('Profile data not available. Please complete your profile first.')
      return
    }

    setStartingAssessment(true)
    setError(null)

    try {
      const request = await assessmentService.buildStartRequest(apiProfile, 'basic', 15)
      const response = await assessmentService.startAssessment(request)

      if (response.success && response.data) {
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

  const handleResumeAssessment = () => {
    if (incompleteSession) {
      navigate(`/basic-assessment?session_id=${incompleteSession.session_id}&resume=true`);
    }
  };

  const handleResetAssessment = async (e: React.MouseEvent | null) => {
    if (e) e.stopPropagation(); // Don't trigger the card click

    if (!incompleteSession) return;

    // Instead of window.confirm, show modern modal
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    if (!incompleteSession) return;

    setResettingSession(true);
    setError(null);

    try {
      const response = await fluencyService.resetSession(incompleteSession.session_id);
      if (response.success) {
        setIncompleteSession(null);
        setShowResetModal(false);
      } else {
        setError(response.error?.message || 'Failed to reset assessment session');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setResettingSession(false);
    }
  };

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={!incompleteSession ? handleStartBasicAssessment : undefined}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${incompleteSession ? 'var(--secondary)' : 'var(--border)'}`,
              cursor: startingAssessment || resettingSession ? 'wait' : (incompleteSession ? 'default' : 'pointer'),
              transition: 'all 0.3s ease',
              opacity: startingAssessment || resettingSession ? 0.7 : 1,
              position: 'relative'
            }}
            whileHover={(!startingAssessment && !incompleteSession) ? { borderColor: 'var(--primary)', scale: 1.02 } : {}}
          >
            {incompleteSession && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(52, 211, 153, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--secondary)',
                border: '1px solid rgba(52, 211, 153, 0.2)'
              }}>
                IN PROGRESS
              </div>
            )}

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
              {[
                'Short personalized assessment',
                'Instant skill gap visualization',
                'Actionable recommendations',
                'Results delivered immediately'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            {!incompleteSession ? (
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={startingAssessment}
                onClick={handleStartBasicAssessment}
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
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  className="btn-secondary"
                  style={{ justifyContent: 'center', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                  disabled={resettingSession}
                  onClick={handleResetAssessment}
                >
                  {resettingSession ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  Reset
                </button>
                <button
                  className="btn-primary"
                  style={{ justifyContent: 'center' }}
                  onClick={handleResumeAssessment}
                >
                  <Play size={18} />
                  Resume
                </button>
              </div>
            )}
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
              {[
                'Detailed personalized assessment',
                'Instant skill gap visualization',
                'Weekly learning plan tailored to your schedule',
                'Hands-on assignments for practical experience',
                'Extended support to complete assignments'
              ].map((item, i) => (
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

      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '40px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                border: '1px solid var(--border)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowComingSoon(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '8px'
                }}
              >
                <X size={24} />
              </button>

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--gradient-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Sparkles size={32} color="white" />
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
                Thank You for Your Interest!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
                Advanced Assessment will be available soon. We're working hard to bring you an AI-powered deep analysis experience.
              </p>

              <button
                onClick={() => setShowComingSoon(false)}
                className="btn-primary"
                style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        title="Reset Progress?"
        message="Are you sure you want to reset your progress? This will mark your current assessment session as completed and allow you to start a fresh one."
        confirmText="Reset Now"
        type="danger"
        isLoading={resettingSession}
      />
    </div>
  )
}
