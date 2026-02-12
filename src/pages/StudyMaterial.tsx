import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, BookOpen, Target, Lightbulb, ChevronDown, ChevronRight,
  Loader, Award, ExternalLink, CheckCircle, Zap, MessageSquare, Scale,
  HelpCircle, Star, Lock,
} from 'lucide-react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { useApp } from '../context/AppContext';
import { getStudyMaterial } from '../services/agentService';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';
import SEOHead from '../components/SEOHead';
import type { StudyMaterialContent } from '../types/api.types';

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    basic: { bg: 'rgba(16, 185, 129, 0.12)', color: 'var(--secondary)' },
    intermediate: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' },
    advanced: { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' },
    expert: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
  };
  const style = colors[level] ?? colors.basic;

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      textTransform: 'capitalize',
    }}>
      {level}
    </span>
  );
}

function CollapsibleCard({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '16px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudyMaterial() {
  const { track, fluencyCode, subtopicId } = useParams<{
    track: string;
    fluencyCode: string;
    subtopicId: string;
  }>();
  const navigate = useNavigateWithParams();
  const { isPaid } = useApp();

  const [content, setContent] = useState<StudyMaterialContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (!isPaid) {
      navigate('/pricing');
      return;
    }

    if (!track || !fluencyCode || !subtopicId) {
      setError('Invalid study material URL.');
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const data = await getStudyMaterial(track, fluencyCode, subtopicId);
        setContent(data);
      } catch (err: any) {
        if (err?.response?.status === 403) {
          navigate('/pricing');
          return;
        }
        setError(err?.response?.data?.message || 'Failed to load study material.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [track, fluencyCode, subtopicId, isPaid, navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading study material...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Lock size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '12px' }}>Unable to Load</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {error || 'Study material not found.'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/upskill-plan')}>
            Back to Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <SEOHead />
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => navigate('/upskill-plan')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary-light)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              padding: 0,
              marginBottom: '24px',
            }}
          >
            <ArrowLeft size={16} />
            Back to Plan
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <LevelBadge level={content.level} />
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(20, 184, 166, 0.1)',
              color: 'var(--primary-light)',
            }}>
              {content.fluency_code}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'var(--surface-light)',
              color: 'var(--text-muted)',
              textTransform: 'capitalize',
            }}>
              {content.type}
            </span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.3, marginBottom: '12px' }}>
            {content.subtopic_title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              {content.estimated_study_time_minutes} min
            </span>
          </div>
        </motion.div>

        {/* TL;DR Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{
            marginBottom: '24px',
            background: 'var(--gradient-1)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Zap size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TL;DR
              </h3>
              <p style={{ lineHeight: 1.7, fontSize: '15px' }}>{content.tldr_summary}</p>
            </div>
          </div>
        </motion.div>

        {/* Think Before You Read */}
        {content.think_before_you_read && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card"
            style={{
              marginBottom: '24px',
              borderLeft: '4px solid var(--accent)',
              background: 'rgba(245, 158, 11, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MessageSquare size={20} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--accent)' }}>
                  Think Before You Read
                </h3>
                <p style={{ lineHeight: 1.7, fontSize: '15px', fontStyle: 'italic' }}>
                  {content.think_before_you_read}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ marginBottom: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Target size={20} color="var(--primary-light)" />
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Learning Objectives</h2>
          </div>
          <ol style={{ paddingLeft: '20px', display: 'grid', gap: '10px' }}>
            {content.learning_objectives.map((obj, i) => (
              <li key={i} style={{ lineHeight: 1.6, fontSize: '15px' }}>{obj}</li>
            ))}
          </ol>
        </motion.div>

        {/* Content Sections */}
        {content.content_sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="card"
            style={{ marginBottom: '24px' }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
              {section.heading}
            </h2>
            <MarkdownRenderer content={section.body} />
            {section.key_points.length > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'var(--surface-light)',
                borderRadius: '12px',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={14} color="var(--accent)" />
                  Key Points
                </h4>
                <ul style={{ paddingLeft: '16px', display: 'grid', gap: '6px' }}>
                  {section.key_points.map((point, j) => (
                    <li key={j} style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}

        {/* Exercises */}
        {content.exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <BookOpen size={20} color="var(--primary-light)" />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Exercises</h2>
            </div>
            {content.exercises.map((exercise, i) => (
              <CollapsibleCard
                key={i}
                title={exercise.title}
                icon={<Award size={18} color="var(--primary-light)" />}
                defaultOpen={i === 0}
              >
                <div style={{ marginBottom: '16px' }}>
                  <MarkdownRenderer content={exercise.instructions} />
                </div>
                {exercise.hints.length > 0 && (
                  <CollapsibleCard
                    title="Hints"
                    icon={<Lightbulb size={16} color="var(--accent)" />}
                  >
                    <ul style={{ paddingLeft: '16px', display: 'grid', gap: '8px' }}>
                      {exercise.hints.map((hint, j) => (
                        <li key={j} style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleCard>
                )}
                <CollapsibleCard
                  title="Solution Guide"
                  icon={<CheckCircle size={16} color="var(--secondary)" />}
                >
                  <MarkdownRenderer content={exercise.solution_guide} />
                </CollapsibleCard>
              </CollapsibleCard>
            ))}
          </motion.div>
        )}

        {/* What Would You Do Scenarios */}
        {content.what_would_you_do_scenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <HelpCircle size={20} color="var(--primary-light)" />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>What Would You Do?</h2>
            </div>
            {content.what_would_you_do_scenarios.map((scenario, i) => (
              <CollapsibleCard
                key={i}
                title={`Scenario ${i + 1}`}
                icon={<MessageSquare size={18} color="var(--primary-light)" />}
                defaultOpen={i === 0}
              >
                <p style={{ lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
                  {scenario.scenario}
                </p>
                <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                  {scenario.options.map((option, j) => (
                    <div
                      key={j}
                      style={{
                        padding: '12px 16px',
                        background: 'var(--surface-light)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: 'var(--primary-light)' }}>Option {String.fromCharCode(65 + j)}:</strong>{' '}
                      {option}
                    </div>
                  ))}
                </div>
                <CollapsibleCard
                  title="Discussion"
                  icon={<MessageSquare size={16} color="var(--secondary)" />}
                >
                  <MarkdownRenderer content={scenario.discussion} />
                </CollapsibleCard>
              </CollapsibleCard>
            ))}
          </motion.div>
        )}

        {/* Debate This */}
        {content.debate_this && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Scale size={20} color="var(--primary-light)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Debate This</h2>
            </div>
            <p style={{
              fontSize: '16px',
              fontWeight: 500,
              fontStyle: 'italic',
              lineHeight: 1.7,
              marginBottom: '20px',
              padding: '16px',
              background: 'var(--surface-light)',
              borderRadius: '12px',
            }}>
              "{content.debate_this.statement}"
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--secondary)', marginBottom: '10px' }}>
                  For
                </h4>
                <ul style={{ paddingLeft: '16px', display: 'grid', gap: '8px' }}>
                  {content.debate_this.for_arguments.map((arg, i) => (
                    <li key={i} style={{ fontSize: '14px', lineHeight: 1.6 }}>{arg}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '10px' }}>
                  Against
                </h4>
                <ul style={{ paddingLeft: '16px', display: 'grid', gap: '8px' }}>
                  {content.debate_this.against_arguments.map((arg, i) => (
                    <li key={i} style={{ fontSize: '14px', lineHeight: 1.6 }}>{arg}</li>
                  ))}
                </ul>
              </div>
            </div>
            {content.debate_this.facilitator_note && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.06)',
                borderRadius: '10px',
                borderLeft: '3px solid var(--accent)',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  {content.debate_this.facilitator_note}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Win */}
        {content.quick_win && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card"
            style={{
              marginBottom: '24px',
              borderLeft: '4px solid var(--secondary)',
              background: 'rgba(16, 185, 129, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Zap size={20} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--secondary)' }}>
                  Quick Win (15 min)
                </h3>
                <p style={{ lineHeight: 1.7, fontSize: '15px' }}>{content.quick_win}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Self-Assessment Questions */}
        {content.self_assessment_questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <HelpCircle size={20} color="var(--primary-light)" />
              <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Self-Assessment</h2>
            </div>
            {content.self_assessment_questions.map((qa, i) => (
              <CollapsibleCard
                key={i}
                title={`Question ${i + 1}`}
                icon={<HelpCircle size={16} color="var(--primary-light)" />}
              >
                <p style={{ fontWeight: 500, lineHeight: 1.7, marginBottom: '12px' }}>
                  {qa.question}
                </p>
                <div style={{
                  padding: '12px 16px',
                  background: 'var(--surface-light)',
                  borderRadius: '10px',
                }}>
                  <MarkdownRenderer content={qa.answer} />
                </div>
              </CollapsibleCard>
            ))}
          </motion.div>
        )}

        {/* Resources */}
        {content.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="card"
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ExternalLink size={20} color="var(--primary-light)" />
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Resources</h2>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {content.resources.map((resource, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--surface-light)',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, fontSize: '15px' }}>{resource.title}</span>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: 'var(--surface)',
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize',
                    }}>
                      {resource.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Takeaways */}
        {content.key_takeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
            style={{
              marginBottom: '24px',
              background: 'var(--gradient-1)',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <CheckCircle size={20} />
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Key Takeaways</h2>
            </div>
            <ul style={{ paddingLeft: '16px', display: 'grid', gap: '10px' }}>
              {content.key_takeaways.map((takeaway, i) => (
                <li key={i} style={{ lineHeight: 1.7, fontSize: '15px' }}>{takeaway}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Bottom nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ textAlign: 'center', paddingBottom: '20px' }}
        >
          <button
            onClick={() => navigate('/upskill-plan')}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '16px' }}
          >
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            Back to Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}
