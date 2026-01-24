import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight, Sparkles, Loader2, RefreshCw, BarChart3, X } from 'lucide-react';
import { assessmentService } from '../services/assessmentService';
import { useApp } from '../context/AppContext';
import type { AssessmentSummary, CompetencyBreakdown, Dimension, BasicAssessmentReport, DimensionScoreBreakdown, DifficultyLevel } from '../types/api.types';

export default function BasicResults() {
  const navigate = useNavigate()
  const location = useLocation()
  const { apiProfile } = useApp()

  // Get session_id from route state or URL params
  const [sessionId, setSessionId] = useState<number | undefined>(location.state?.sessionId)

  const [summary, setSummary] = useState<AssessmentSummary | null>(null)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retakingAssessment, setRetakingAssessment] = useState(false)
  const [aggregateReport, setAggregateReport] = useState<BasicAssessmentReport | null>(null)
  const [showAggregateModal, setShowAggregateModal] = useState(false)
  const [loadingAggregate, setLoadingAggregate] = useState(false)
  const [aggregateError, setAggregateError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const isProduction = import.meta.env.PROD

  // Fetch summary and dimensions on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlSessionId = params.get('session_id')

    if (!sessionId && urlSessionId) {
      setSessionId(parseInt(urlSessionId))
      return
    }

    if (!sessionId && !urlSessionId) {
      navigate('/assessment')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch summary and dimensions in parallel
        const [summaryResponse, dims] = await Promise.all([
          assessmentService.getAssessmentSummary(sessionId),
          assessmentService.getCachedDimensions()
        ])

        if (summaryResponse.success && summaryResponse.data) {
          setSummary(summaryResponse.data)
        } else {
          setError(summaryResponse.error?.message || 'Failed to load assessment summary')
        }

        setDimensions(dims)
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, navigate])

  // Get full dimension name from code
  const getDimensionName = (code: string): string => {
    const dim = dimensions.find(d => d.dimension_code === code)
    return dim?.name || code
  }

  // Get status based on percentage correct
  const getCompetencyStatus = (breakdown: CompetencyBreakdown) => {
    const percentage = breakdown.total_questions > 0
      ? (breakdown.correct_answers / breakdown.total_questions) * 100
      : 0

    if (percentage >= 80) return { status: 'excellent', label: 'Excellent', color: 'var(--secondary)' }
    if (percentage >= 60) return { status: 'good', label: 'Good', color: 'var(--primary-light)' }
    if (percentage >= 40) return { status: 'fair', label: 'Needs Work', color: 'var(--accent)' }
    return { status: 'poor', label: 'Needs Improvement', color: 'var(--error)' }
  }

  const handleRetakeAssessment = async () => {
    if (!apiProfile) {
      setError('Profile data not available. Please try again.')
      return
    }

    setRetakingAssessment(true)
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
      setRetakingAssessment(false)
    }
  }

  const handleViewAggregate = async () => {
    setLoadingAggregate(true)
    setAggregateError(null)

    try {
      const response = await assessmentService.getBasicAssessmentReport()

      if (response.success && response.data) {
        setAggregateReport(response.data)
        setShowAggregateModal(true)
      } else {
        setAggregateError(response.error?.message || 'Failed to load aggregate report')
      }
    } catch (err) {
      setAggregateError('An unexpected error occurred')
    } finally {
      setLoadingAggregate(false)
    }
  }

  const getScoreStatus = (percentage: number) => {
    if (percentage >= 80) return { status: 'excellent', label: 'Excellent', color: 'var(--secondary)' }
    if (percentage >= 60) return { status: 'good', label: 'Good', color: 'var(--primary-light)' }
    if (percentage >= 40) return { status: 'fair', label: 'Needs Work', color: 'var(--accent)' }
    return { status: 'poor', label: 'Needs Improvement', color: 'var(--error)' }
  }

  // Get top 4 focus areas sorted by difficulty level (Expert > Advanced > Intermediate > Basic)
  // TODO: Consider priority order also when picking top 4 items (e.g., lower score_percentage should have higher priority within same difficulty)
  const getTopFocusAreas = (scores: DimensionScoreBreakdown[]): DimensionScoreBreakdown[] => {
    const difficultyOrder: Record<DifficultyLevel, number> = {
      'Expert': 0,
      'Advanced': 1,
      'Intermediate': 2,
      'Basic': 3
    }

    return [...scores]
      .sort((a, b) => difficultyOrder[a.difficulty_level] - difficultyOrder[b.difficulty_level])
      .slice(0, 4)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-light)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '12px' }}>Unable to Load Results</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'Something went wrong'}</p>
          <button onClick={() => navigate('/assessment')} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const overallPercentage = summary.total_questions > 0
    ? Math.round((summary.total_correct / summary.total_questions) * 100)
    : 0

  const improvementCount = summary.competency_breakdown.filter(c => {
    const status = getCompetencyStatus(c).status
    return status !== 'excellent' && status !== 'good'
  }).length

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Assessment Results
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Here's how you performed in the {summary.assessment_type} assessment
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-light)', marginBottom: '8px' }}>
              {overallPercentage}%
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Overall Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '8px' }}>
              {summary.competency_breakdown.filter(c => {
                const status = getCompetencyStatus(c).status
                return status === 'excellent' || status === 'good'
              }).length}/{summary.competency_breakdown.length}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Strengths</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              {improvementCount}/{summary.competency_breakdown.length}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Areas of Improvement</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Competency Breakdown
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {summary.competency_breakdown.map((competency, index) => {
              const statusInfo = getCompetencyStatus(competency)
              const percentage = competency.total_questions > 0
                ? Math.round((competency.correct_answers / competency.total_questions) * 100)
                : 0

              return (
                <motion.div
                  key={competency.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--surface-light)',
                    borderRadius: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '500' }}>
                        {getDimensionName(competency.dimension)}
                      </h3>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${statusInfo.color}20`,
                        color: statusInfo.color
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div style={{ position: 'relative', height: '8px', background: 'var(--surface)', borderRadius: '4px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          background: statusInfo.color,
                          borderRadius: '4px'
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>{competency.correct_answers} of {competency.total_questions} correct</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {statusInfo.status === 'excellent' ? (
                      <CheckCircle size={24} color="var(--secondary)" />
                    ) : statusInfo.status === 'good' ? (
                      <TrendingUp size={24} color="var(--primary-light)" />
                    ) : (
                      <AlertCircle size={24} color={statusInfo.color} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={handleRetakeAssessment}
            disabled={retakingAssessment}
            className="btn-secondary"
            style={{
              flex: 1,
              minWidth: '200px',
              justifyContent: 'center',
              padding: '16px 24px'
            }}
          >
            {retakingAssessment ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Retake Basic Assessment
              </>
            )}
          </button>

          <button
            onClick={handleViewAggregate}
            disabled={loadingAggregate}
            className="btn-secondary"
            style={{
              flex: 1,
              minWidth: '200px',
              justifyContent: 'center',
              padding: '16px 24px'
            }}
          >
            {loadingAggregate ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <BarChart3 size={18} />
                View Aggregate Across All Assessments
              </>
            )}
          </button>
        </motion.div>

        {(error || aggregateError) && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            {error || aggregateError}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '24px',
            border: '1px solid var(--primary)'
          }}
        >
          <Sparkles size={40} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
            Want a Detailed Analysis & Upskill Plan?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Get AI-powered deep assessment with personalized learning paths,
            curated resources, and weekly action plans
          </p>
          <button
            onClick={() => isProduction ? setShowComingSoon(true) : navigate('/payment')}
            className="btn-primary"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            Get Advanced Assessment - $20
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Aggregate Report Modal */}
      <AnimatePresence>
        {showAggregateModal && aggregateReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000
            }}
            onClick={() => setShowAggregateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <BarChart3 size={28} color="var(--primary-light)" />
                  Aggregate Assessment Report
                </h2>
                <button
                  onClick={() => setShowAggregateModal(false)}
                  style={{
                    background: 'var(--surface-light)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} color="var(--text-muted)" />
                </button>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Combined results across all your completed basic assessments
              </p>

              {/* Overall Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'var(--surface-light)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {aggregateReport.overall_score_percentage}%
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Overall Score</p>
                </div>

                <div style={{
                  background: 'var(--surface-light)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--secondary)' }}>
                    {aggregateReport.total_assessments}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Assessments Taken</p>
                </div>
              </div>

              {/* Top Focus Areas */}
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Top Focus Areas
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '32px'
              }}>
                {getTopFocusAreas(aggregateReport.dimension_scores).map((score) => (
                  <div
                    key={`${score.dimension}-${score.difficulty_level}`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      border: '1px solid var(--primary)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {getDimensionName(score.dimension)}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {score.difficulty_level}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dimension Breakdown */}
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                Performance by Dimension
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                {aggregateReport.dimension_scores.map((score: DimensionScoreBreakdown) => {
                  const statusInfo = getScoreStatus(score.score_percentage)

                  return (
                    <div
                      key={score.dimension}
                      style={{
                        background: 'var(--surface-light)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '500' }}>
                            {getDimensionName(score.dimension)}
                          </h4>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: `${statusInfo.color}20`,
                            color: statusInfo.color
                          }}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <span style={{ fontWeight: '600', color: statusInfo.color }}>
                          {score.score_percentage}%
                        </span>
                      </div>

                      <div style={{ position: 'relative', height: '8px', background: 'var(--surface)', borderRadius: '4px' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${score.score_percentage}%`,
                            background: statusInfo.color,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        fontSize: '12px',
                        color: 'var(--text-muted)'
                      }}>
                        <span>{score.correct_answers} of {score.total_questions} correct</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                  onClick={() => setShowAggregateModal(false)}
                  className="btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Modal */}
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
    </div>
  )
}
