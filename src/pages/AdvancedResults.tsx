import { useEffect, useRef, useState } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/SEOHead';
import { trackAssessmentComplete } from '../lib/analytics';
import { getAssessmentStatus, getAssessmentResults, createUpskillPlan, getUpskillPlan } from '../services/agentService';
import type { FluencyResult, TranscriptEntry } from '../types/api.types';

interface LocationState {
  sessionId?: number;
}

export default function AdvancedResults() {
  const navigate = useNavigateWithParams();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { advancedSessionId } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [fluencyResults, setFluencyResults] = useState<FluencyResult[] | null>(null);
  const [overallSummary, setOverallSummary] = useState<string>('');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const hasTracked = useRef(false);
  const hasFetched = useRef(false);

  // Get sessionId from location state, context, or fetch from status
  const passedSessionId = locationState?.sessionId ?? advancedSessionId;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        let sessionId = passedSessionId;

        // If no sessionId provided, try to get it from status
        if (!sessionId) {
          const statusResponse = await getAssessmentStatus();
          if (statusResponse.data?.status === 'completed') {
            sessionId = statusResponse.data.session_id;
          }
        }

        if (sessionId) {
          const apiResponse = await getAssessmentResults(sessionId);
          if (apiResponse.data?.results) {
            setFluencyResults(apiResponse.data.results.fluency_results);
            setOverallSummary(apiResponse.data.results.overall_summary);
          }
          if (apiResponse.data?.transcript) {
            setTranscript(apiResponse.data.transcript);
          }
        }
      } catch (error) {
        console.error('Failed to fetch results from API:', error);
        // Fall back to context results
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [passedSessionId]);

  // Redirect if no results available
  useEffect(() => {
    if (!isLoading && (!fluencyResults || fluencyResults.length === 0)) {
      navigate('/');
    }
  }, [isLoading, fluencyResults, navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your results...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    );
  }

  if (!fluencyResults || fluencyResults.length === 0) {
    return null;
  }

  const LEVEL_ORDER: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  const getGapStatus = (demonstratedLevel: string, targetLevel: string) => {
    const demonstrated = LEVEL_ORDER[demonstratedLevel] ?? 0;
    const target = LEVEL_ORDER[targetLevel] ?? 0;
    if (demonstrated >= target) return { status: 'met', label: 'On Track', color: 'var(--secondary)' };
    if (target - demonstrated <= 1) return { status: 'close', label: 'Next Focus', color: '#f59e0b' };
    return { status: 'gap', label: 'Needs Attention', color: 'var(--error)' };
  };

  if (!hasTracked.current && fluencyResults.length > 0) {
    trackAssessmentComplete('advanced', 0);
    hasTracked.current = true;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <SEOHead />
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Detailed AI Skill Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Comprehensive assessment based on your interactive evaluation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare size={24} color="var(--primary-light)" />
            Skill Analysis
          </h2>

          {overallSummary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              {overallSummary}
            </p>
          )}

          {/* Color Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--error)', display: 'inline-block' }} />
              Needs Attention
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              Next Focus
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block' }} />
              Fine to skip short term
            </div>
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            {fluencyResults.map((skill, index) => {
              const gapInfo = getGapStatus(skill.demonstrated_level, skill.target_level);

              return (
                <motion.div
                  key={skill.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  style={{
                    padding: '20px',
                    background: 'var(--surface-light)',
                    borderRadius: '16px',
                    borderLeft: `4px solid ${gapInfo.color}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{skill.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: gapInfo.color, textTransform: 'capitalize' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Demonstrated: </span>
                        {skill.demonstrated_level === 'insufficient_data' ? 'Insufficient data'
                          : skill.demonstrated_level === 'not_demonstrated' ? 'Not demonstrated'
                          : skill.demonstrated_level}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        Target: {skill.target_level}
                      </div>
                    </div>
                  </div>

                  {skill.modules.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {skill.modules.map((mod) => (
                        <span
                          key={mod.module_id}
                          style={{
                            padding: '4px 10px',
                            background: `${gapInfo.color}15`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: gapInfo.color,
                          }}
                        >
                          {mod.module_title}
                          {mod.is_focus_area && ' ★'}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Assessment Transcript */}
        {transcript.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
            style={{ marginBottom: '40px' }}
          >
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'inherit',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={24} color="var(--primary-light)" />
                Assessment Transcript ({transcript.length} questions)
              </h2>
              {showTranscript ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>

            {showTranscript && (
              <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
                {transcript.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      background: 'var(--surface-light)',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${entry.score !== null && entry.score >= 7 ? 'var(--secondary)' : entry.score !== null && entry.score >= 4 ? 'var(--accent)' : 'var(--text-muted)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          Q{entry.question_number}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {entry.fluency_code} • {entry.asked_at_level}
                        </span>
                      </div>
                      {entry.score !== null && (
                        <span style={{
                          fontWeight: '600',
                          color: entry.score >= 7 ? 'var(--secondary)' : entry.score >= 4 ? 'var(--accent)' : 'var(--text-muted)',
                        }}>
                          {entry.score}/10
                        </span>
                      )}
                    </div>
                    <p style={{ fontWeight: '500', marginBottom: '8px' }}>{entry.question_text}</p>
                    <div style={{
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      marginBottom: entry.expected_good_response ? '8px' : 0,
                    }}>
                      <strong style={{ color: 'var(--text-muted)' }}>Your response: </strong>
                      {entry.user_response}
                    </div>
                    {entry.expected_good_response && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                      }}>
                        <strong>Expected good response: </strong>
                        {entry.expected_good_response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'var(--gradient-1)',
            borderRadius: '24px'
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Ready to Close Your Skill Gaps?
          </h2>
          <p style={{ marginBottom: '24px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 24px' }}>
            Get a personalized weekly upskilling plan with curated resources and exercises
          </p>
          <button
            onClick={async () => {
              const sessionId = passedSessionId;
              if (!sessionId) return;
              setCreatingPlan(true);
              try {
                const response = await createUpskillPlan(sessionId);
                navigate('/upskill-plan', { state: { plan: response.data } });
              } catch (err: any) {
                // Plan already exists — fetch it instead
                if (err?.response?.status === 409) {
                  try {
                    const existing = await getUpskillPlan(sessionId);
                    navigate('/upskill-plan', { state: { plan: existing.data } });
                  } catch {
                    alert('Failed to load your existing plan. Please try again.');
                  }
                } else {
                  alert('Failed to create upskill plan. Please try again.');
                }
              } finally {
                setCreatingPlan(false);
              }
            }}
            disabled={creatingPlan}
            style={{
              background: 'white',
              color: 'var(--primary-dark)',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: creatingPlan ? 'wait' : 'pointer',
              opacity: creatingPlan ? 0.7 : 1,
            }}
          >
            {creatingPlan ? (
              <>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Creating Plan...
              </>
            ) : (
              <>
                Create My Upskill Plan
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
