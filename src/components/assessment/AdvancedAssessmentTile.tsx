import { useState, useEffect, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Crown, ArrowRight, Play, Eye, RotateCcw, Clock, Loader } from 'lucide-react';
import { useNavigateWithParams } from '../../hooks/useNavigateWithParams';
import { ADVANCED_ASSESSMENT_FEATURES, isAdvancedAssessmentBeta } from '../../data/assessmentData';
import { getAssessmentStatus, resetAssessment } from '../../services/agentService';
import type { AdvancedAssessmentSummary } from '../../types/api.types';

interface AdvancedAssessmentTileProps {
  onClick: () => void;
  animationDelay?: number;
  animationDirection?: 'left' | 'right';
  buttonText?: string;
  style?: CSSProperties;
  showPaymentTier?: boolean;
  showDescription?: boolean;
}

type AssessmentState = 'loading' | 'none' | 'in_progress' | 'completed_cooldown' | 'completed_ready';

export function AdvancedAssessmentTile({
  onClick,
  animationDelay = 0.2,
  animationDirection = 'right',
  buttonText = 'Get Advanced Assessment',
  style,
  showPaymentTier = true,
  showDescription = true
}: AdvancedAssessmentTileProps) {
  const navigate = useNavigateWithParams();
  const isBeta = isAdvancedAssessmentBeta();
  const xOffset = animationDirection === 'left' ? -20 : 20;

  const [assessmentState, setAssessmentState] = useState<AssessmentState>('loading');
  const [assessmentData, setAssessmentData] = useState<AdvancedAssessmentSummary | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getAssessmentStatus();
        if (response.data) {
          setAssessmentData(response.data);
          if (response.data.status === 'in_progress') {
            setAssessmentState('in_progress');
          } else if (response.data.status === 'completed') {
            setAssessmentState(response.can_start_new ? 'completed_ready' : 'completed_cooldown');
          }
        } else {
          setAssessmentState(response.can_start_new ? 'none' : 'completed_cooldown');
        }
      } catch (error) {
        console.error('Failed to fetch assessment status:', error);
        setAssessmentState('none');
      }
    };

    fetchStatus();
  }, []);

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!assessmentData || isResetting) return;

    setIsResetting(true);
    try {
      await resetAssessment(assessmentData.session_id);
      setAssessmentState('none');
      setAssessmentData(null);
    } catch (error) {
      console.error('Failed to reset assessment:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleViewResults = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (assessmentData) {
      navigate('/advanced-results', { state: { sessionId: assessmentData.session_id } });
    }
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/advanced-assessment', { state: { resumeSessionId: assessmentData?.session_id } });
  };

  const handleStartNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const formatCooldownDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderButtons = () => {
    if (assessmentState === 'loading') {
      return (
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }} disabled>
          <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Loading...
        </button>
      );
    }

    if (assessmentState === 'in_progress') {
      return (
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ flex: '0 0 auto', padding: '12px' }}
            disabled={isResetting}
            title="Reset assessment"
          >
            {isResetting ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={18} />}
          </button>
          <button onClick={handleResume} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Play size={18} />
            Resume Assessment
          </button>
        </div>
      );
    }

    if (assessmentState === 'completed_cooldown') {
      return (
        <div style={{ marginTop: 'auto' }}>
          {assessmentData?.cooldown_ends_at && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(245, 158, 11, 0.15)',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '13px',
              color: 'var(--accent)',
            }}>
              <Clock size={16} />
              Next assessment available: {formatCooldownDate(assessmentData.cooldown_ends_at)}
            </div>
          )}
          <button onClick={handleViewResults} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Eye size={18} />
            View Results
          </button>
        </div>
      );
    }

    if (assessmentState === 'completed_ready') {
      return (
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button onClick={handleViewResults} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            <Eye size={18} />
            View Results
          </button>
          <button onClick={handleStartNew} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Sparkles size={18} />
            Start New
          </button>
        </div>
      );
    }

    // Default: none state
    return (
      <button onClick={handleStartNew} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
        {buttonText}
        <ArrowRight size={18} />
      </button>
    );
  };

  const getStatusBadge = () => {
    if (assessmentState === 'in_progress') {
      return (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'var(--accent)',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
        }}>
          <Play size={14} />
          IN PROGRESS
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      style={{
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: '24px',
        padding: '32px',
        border: '2px solid var(--primary)',
        cursor: assessmentState === 'loading' ? 'wait' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {getStatusBadge()}

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

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        Advanced Assessment
        {isBeta && (
          <span style={{
            background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
            color: 'white',
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '12px',
            letterSpacing: '0.5px',
            lineHeight: '1.4'
          }}>
            BETA
          </span>
        )}
      </h2>
      {showDescription && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Comprehensive evaluation with structured learning and hands-on practice
        </p>
      )}

      {showPaymentTier && (
        <div style={{
          background: 'rgba(20, 184, 166, 0.15)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          {isBeta ? (
            <>
              <span style={{ fontSize: '26px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>$20</span>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)', marginLeft: '10px' }}>Free</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>Complimentary during Beta</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>$20</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>one-time</span>
            </>
          )}
        </div>
      )}

      {showDescription && (
        <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px', flex: 1 }}>
          {ADVANCED_ASSESSMENT_FEATURES.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
              <Check size={18} color="var(--secondary)" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {renderButtons()}
    </motion.div>
  );
}
