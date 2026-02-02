import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight, Sparkles, RefreshCw, BarChart3, X } from 'lucide-react';
import { assessmentService } from '../services/assessmentService';
import { useApp } from '../context/AppContext';
import { PageHeader, Card, StatCard, ProgressBar, StatusBadge, Modal, ErrorAlert, LoadingSpinner, ComingSoonModal } from '../components/ui';
import { getCompetencyStatus, calculatePercentage, getDifficultyOrder } from '../utils/statusHelpers';
import { IS_ADVANCED_ASSESSMENT_BETA } from '../data/assessmentData';
import type { AssessmentSummary, CompetencyBreakdown, Dimension, BasicAssessmentReport, DimensionScoreBreakdown } from '../types/api.types';

export default function BasicResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { apiProfile } = useApp();

  // Get session_id from route state
  const sessionId = location.state?.sessionId as number | undefined;

  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retakingAssessment, setRetakingAssessment] = useState(false);
  const [aggregateReport, setAggregateReport] = useState<BasicAssessmentReport | null>(null);
  const [showAggregateModal, setShowAggregateModal] = useState(false);
  const [loadingAggregate, setLoadingAggregate] = useState(false);
  const [aggregateError, setAggregateError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const isProduction = import.meta.env.PROD;

  // Fetch summary and dimensions on mount
  useEffect(() => {
    if (!sessionId) {
      navigate('/assessment-choice');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch summary and dimensions in parallel
        const [summaryResponse, dims] = await Promise.all([
          assessmentService.getAssessmentSummary(sessionId),
          assessmentService.getCachedDimensions()
        ]);

        if (summaryResponse.success && summaryResponse.data) {
          setSummary(summaryResponse.data);
        } else {
          setError(summaryResponse.error?.message || 'Failed to load assessment summary');
        }

        setDimensions(dims);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, navigate]);

  // Get full dimension name from code
  const getDimensionName = (code: string): string => {
    const dim = dimensions.find(d => d.dimension_code === code);
    return dim?.name || code;
  };

  const handleRetakeAssessment = async () => {
    if (!apiProfile) {
      setError('Profile data not available. Please try again.');
      return;
    }

    setRetakingAssessment(true);
    setError(null);

    try {
      const request = await assessmentService.buildStartRequest(apiProfile, 'basic', 15);
      const response = await assessmentService.startAssessment(request);

      if (response.success && response.data) {
        navigate('/basic-assessment', { state: { assessmentData: response.data } });
      } else {
        setError(response.error?.message || 'Failed to start assessment');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setRetakingAssessment(false);
    }
  };

  const handleViewAggregate = async () => {
    setLoadingAggregate(true);
    setAggregateError(null);

    try {
      const response = await assessmentService.getBasicAssessmentReport();

      if (response.success && response.data) {
        setAggregateReport(response.data);
        setShowAggregateModal(true);
      } else {
        setAggregateError(response.error?.message || 'Failed to load aggregate report');
      }
    } catch (err) {
      setAggregateError('An unexpected error occurred');
    } finally {
      setLoadingAggregate(false);
    }
  };

  // Get top 4 focus areas sorted by difficulty level
  const getTopFocusAreas = (scores: DimensionScoreBreakdown[]): DimensionScoreBreakdown[] => {
    return [...scores]
      .sort((a, b) => getDifficultyOrder(a.difficulty_level) - getDifficultyOrder(b.difficulty_level))
      .slice(0, 4);
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your results..." />;
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
          <button onClick={() => navigate('/assessment-choice')} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const overallPercentage = calculatePercentage(summary.total_correct, summary.total_questions);

  const improvementCount = summary.competency_breakdown.filter(c => {
    const percentage = calculatePercentage(c.correct_answers, c.total_questions);
    const status = getCompetencyStatus(percentage).status;
    return status !== 'excellent' && status !== 'good';
  }).length;

  const strengthCount = summary.competency_breakdown.length - improvementCount;

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <PageHeader
          title="Your Assessment Results"
          description={`Here's how you performed in the ${summary.assessment_type} assessment`}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <StatCard value={`${overallPercentage}%`} label="Overall Score" delay={0.1} />
          <StatCard
            value={`${strengthCount}/${summary.competency_breakdown.length}`}
            label="Strengths"
            delay={0.2}
            valueColor="var(--secondary)"
          />
          <StatCard
            value={`${improvementCount}/${summary.competency_breakdown.length}`}
            label="Areas of Improvement"
            delay={0.3}
            valueColor="var(--accent)"
          />
        </div>

        <Card delay={0.4} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Competency Breakdown
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {summary.competency_breakdown.map((competency, index) => {
              const percentage = calculatePercentage(competency.correct_answers, competency.total_questions);
              const statusInfo = getCompetencyStatus(percentage);

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
                      <StatusBadge status={statusInfo.status} label={statusInfo.label} />
                    </div>

                    <ProgressBar
                      progress={percentage}
                      delay={0.5 + index * 0.05}
                      fillColor={statusInfo.color}
                      height={8}
                    />

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
              );
            })}
          </div>
        </Card>

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
                <RefreshCw size={18} className="animate-spin" />
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
                <BarChart3 size={18} className="animate-spin" />
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
          <ErrorAlert message={error || aggregateError || ''} />
        )}

        <Card
          variant="gradient"
          delay={0.8}
          style={{ textAlign: 'center', padding: '40px' }}
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
            onClick={() => {
              if (IS_ADVANCED_ASSESSMENT_BETA) {
                navigate('/advanced-assessment');
              } else if (isProduction) {
                setShowComingSoon(true);
              } else {
                navigate('/payment');
              }
            }}
            className="btn-primary"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            {IS_ADVANCED_ASSESSMENT_BETA ? (
              <>
                Get Advanced Assessment — <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>$20</span> Free
              </>
            ) : (
              'Get Advanced Assessment — $20'
            )}
            <ArrowRight size={18} />
          </button>
          {IS_ADVANCED_ASSESSMENT_BETA && (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
              Complimentary during Beta
            </p>
          )}
        </Card>
      </div>

      {/* Aggregate Report Modal */}
      <Modal
        isOpen={showAggregateModal && !!aggregateReport}
        onClose={() => setShowAggregateModal(false)}
        title="Aggregate Assessment Report"
        maxWidth="700px"
      >
        {aggregateReport && (
          <>
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
                const statusInfo = getCompetencyStatus(score.score_percentage);

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
                        <StatusBadge status={statusInfo.status} label={statusInfo.label} />
                      </div>
                      <span style={{ fontWeight: '600', color: statusInfo.color }}>
                        {score.score_percentage}%
                      </span>
                    </div>

                    <ProgressBar
                      progress={score.score_percentage}
                      animated={false}
                      fillColor={statusInfo.color}
                      height={8}
                    />

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
                );
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
          </>
        )}
      </Modal>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </div>
  );
}
