import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, Loader, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUpskillPlan, markPlanItemsDone, updateUpskillPlan } from '../services/agentService';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import SEOHead from '../components/SEOHead';
import type { UpskillPlanResponse, UpskillPlanItem } from '../types/api.types';

interface LocationState {
  plan?: UpskillPlanResponse;
}

interface FluencyProgress {
  code: string;
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

function computeFluencyProgress(plan: UpskillPlanResponse): FluencyProgress[] {
  const map = new Map<string, { name: string; completed: number; total: number }>();

  for (const week of plan.weeks) {
    for (const item of week.items) {
      const entry = map.get(item.fluency_code) || { name: item.fluency_name, completed: 0, total: 0 };
      entry.total++;
      if (item.status === 'done') entry.completed++;
      map.set(item.fluency_code, entry);
    }
  }

  return Array.from(map.entries()).map(([code, data]) => ({
    code,
    name: data.name,
    completed: data.completed,
    total: data.total,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));
}

function formatCooldownDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function UpskillPlan() {
  const navigate = useNavigateWithParams();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { advancedSessionId } = useApp();

  const [plan, setPlan] = useState<UpskillPlanResponse | null>(locationState?.plan ?? null);
  const [isLoading, setIsLoading] = useState(!locationState?.plan);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isMarking, setIsMarking] = useState(false);
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [expandedRationales, setExpandedRationales] = useState<Set<number>>(new Set());
  const hasFetched = useRef(false);

  const sessionId = plan?.session_id ?? advancedSessionId;

  // Fetch plan from API if not passed via location state
  useEffect(() => {
    if (plan || hasFetched.current) return;
    hasFetched.current = true;

    if (!advancedSessionId) {
      navigate('/');
      return;
    }

    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const response = await getUpskillPlan(advancedSessionId);
        setPlan(response.data);
      } catch {
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [plan, advancedSessionId, navigate]);

  const fluencyProgress = useMemo(() => (plan ? computeFluencyProgress(plan) : []), [plan]);

  const toggleItem = (itemId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleRationale = (itemId: number) => {
    setExpandedRationales(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleMarkComplete = async () => {
    if (!sessionId || selectedIds.size === 0) return;
    setIsMarking(true);
    try {
      await markPlanItemsDone(sessionId, Array.from(selectedIds));
      // Refresh plan data
      const response = await getUpskillPlan(sessionId);
      setPlan(response.data);
      setSelectedIds(new Set());
    } catch {
      alert('Failed to mark items as complete. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };

  const handleTakeFreshAssessment = async () => {
    if (!plan || !sessionId) return;

    const createdAt = new Date(plan.created_at);
    const oneWeekAfter = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now < oneWeekAfter) {
      setShowCooldownModal(true);
      return;
    }

    setIsDeactivating(true);
    try {
      await updateUpskillPlan(sessionId, { is_active: false });
      navigate('/assessment');
    } catch {
      alert('Failed to deactivate plan. Please try again.');
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your upskill plan...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px', paddingBottom: selectedIds.size > 0 ? '100px' : '40px' }}>
      <SEOHead />
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Personalized Upskill Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            {plan.total_items} items across {plan.total_weeks} weeks &middot; {plan.hours_per_week}h/week
          </p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={24} color="var(--primary-light)" />
              Progress by Fluency
            </h2>
            <span style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--secondary)',
            }}>
              {plan.progress.percentage}% overall
            </span>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {fluencyProgress.map((fp, index) => (
              <div key={fp.code}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{fp.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {fp.completed}/{fp.total} ({fp.percentage}%)
                  </span>
                </div>
                <ProgressBar
                  progress={fp.percentage}
                  height={8}
                  delay={0.1 + index * 0.05}
                  fillColor={fp.percentage === 100 ? 'var(--secondary)' : 'var(--gradient-1)'}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Plan Items */}
        <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
          {plan.weeks.map((week, weekIndex) => (
            <motion.div
              key={week.week_number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + weekIndex * 0.05 }}
              className="card"
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--gradient-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  W{week.week_number}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Week {week.week_number}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    {week.items.filter(i => i.status === 'done').length}/{week.items.length} completed
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {week.items.map((item) => {
                  const isDone = item.status === 'done';
                  const isSelected = selectedIds.has(item.item_id);

                  return (
                    <div
                      key={item.item_id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px 16px',
                        background: isDone ? 'rgba(16, 185, 129, 0.06)' : 'var(--surface-light)',
                        borderRadius: '12px',
                        borderLeft: `3px solid ${isDone ? 'var(--secondary)' : isSelected ? 'var(--primary)' : 'transparent'}`,
                        opacity: isDone ? 0.7 : 1,
                        cursor: isDone ? 'default' : 'pointer',
                      }}
                      onClick={() => !isDone && toggleItem(item.item_id)}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        border: isDone ? 'none' : `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                        background: isDone ? 'var(--secondary)' : isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}>
                        {(isDone || isSelected) && (
                          <CheckCircle size={14} color="white" />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          textDecoration: isDone ? 'line-through' : 'none',
                          color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                          marginBottom: '4px',
                        }}>
                          {item.subtopic_title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {item.module_title}
                        </div>
                        {item.rationale && (
                          <>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRationale(item.item_id);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '6px',
                                fontSize: '12px',
                                color: 'var(--primary-light)',
                                cursor: 'pointer',
                                userSelect: 'none',
                              }}
                            >
                              {expandedRationales.has(item.item_id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              Why this is in your plan
                            </div>
                            <AnimatePresence>
                              {expandedRationales.has(item.item_id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div style={{
                                    marginTop: '8px',
                                    padding: '10px 12px',
                                    background: 'var(--surface)',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5',
                                  }}>
                                    {item.rationale}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>

                      {/* Study link + Badges */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {plan.track && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/study-material/${plan.track}/${item.fluency_code}/${item.subtopic_id}`);
                            }}
                            title="Study this topic"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              height: '32px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid rgba(20, 184, 166, 0.3)',
                              background: 'rgba(20, 184, 166, 0.15)',
                              cursor: 'pointer',
                              color: 'var(--primary-light)',
                              flexShrink: 0,
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            <BookOpen size={16} />
                            Study
                          </button>
                        )}
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: 'rgba(20, 184, 166, 0.1)',
                          color: 'var(--primary-light)',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.fluency_name}
                        </span>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: 'var(--surface)',
                          color: 'var(--text-muted)',
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.level}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Take Fresh Assessment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'var(--gradient-1)',
            borderRadius: '24px',
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Ready for a Fresh Assessment?
          </h2>
          <p style={{ marginBottom: '24px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 24px' }}>
            Take a new assessment to measure your progress and get an updated upskill plan
          </p>
          <button
            onClick={handleTakeFreshAssessment}
            disabled={isDeactivating}
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
              cursor: isDeactivating ? 'wait' : 'pointer',
              opacity: isDeactivating ? 0.7 : 1,
            }}
          >
            {isDeactivating ? (
              <>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Preparing...
              </>
            ) : (
              <>
                Take Fresh Assessment
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Floating Mark as Complete Button */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
          }}
        >
          <button
            onClick={handleMarkComplete}
            disabled={isMarking}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: isMarking ? 'wait' : 'pointer',
              boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)',
            }}
          >
            {isMarking ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Mark {selectedIds.size} Item{selectedIds.size > 1 ? 's' : ''} as Complete
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Cooldown Modal */}
      <Modal
        isOpen={showCooldownModal}
        onClose={() => setShowCooldownModal(false)}
        title="Assessment Not Available Yet"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <Clock size={48} color="var(--accent)" />
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            You can take your next assessment after a week of your latest upskill plan creation.
            Please try after <strong>{formatCooldownDate(plan.created_at)}</strong>.
          </p>
          <button
            onClick={() => setShowCooldownModal(false)}
            className="btn-primary"
            style={{ marginTop: '8px', padding: '12px 32px' }}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}
