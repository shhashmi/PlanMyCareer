import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, BookOpen, Lightbulb, ChevronDown, ChevronRight,
  Loader, Award, ExternalLink, CheckCircle, Zap, MessageSquare, Scale,
  HelpCircle, Star, Lock,
} from 'lucide-react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { useApp } from '../context/AppContext';
import { getStudyMaterial } from '../services/agentService';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';
import SEOHead from '../components/SEOHead';
import type { StudyMaterialContent } from '../types/api.types';
import './StudyMaterial.css';

function LevelBadge({ level }: { level: string }) {
  const badgeClass = `sm-badge sm-badge-${level}`;
  return <span className={badgeClass}>{level}</span>;
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
    <div className="card" style={{ marginBottom: '12px' }}>
      <div
        className="sm-collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <h3>{title}</h3>
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
      <div className="study-material-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          <Loader size={32} color="#5c6bc0" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666' }}>Loading study material...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="study-material-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Lock size={48} color="#999" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '12px', color: '#1a1a2e' }}>Unable to Load</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
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
    <div className="study-material-page">
      <SEOHead />
      <div className="sm-container">
        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="sm-back-btn" onClick={() => navigate('/upskill-plan')}>
            <ArrowLeft size={16} />
            Back to Plan
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          className="sm-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1>{content.subtopic_id}: {content.subtopic_title}</h1>
          <div className="sm-meta">
            <span className="sm-badge sm-badge-track">{content.track}</span>
            <span className="sm-badge sm-badge-fluency">{content.fluency_code}</span>
            <LevelBadge level={content.level} />
            <span className={`sm-badge sm-badge-${content.type}`}>{content.type}</span>
            {content.estimated_study_time_minutes && (
              <span className="sm-badge sm-badge-time">
                <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {content.estimated_study_time_minutes} min
              </span>
            )}
          </div>
        </motion.div>

        {/* TL;DR Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sm-tldr"
        >
          <div className="sm-tldr-label">TL;DR</div>
          <p style={{ lineHeight: 1.7 }}>{content.tldr_summary}</p>
        </motion.div>

        {/* Think Before You Read */}
        {content.think_before_you_read && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="sm-think-box"
          >
            <div className="sm-think-label">Think Before You Read</div>
            <p style={{ lineHeight: 1.7 }}>{content.think_before_you_read}</p>
          </motion.div>
        )}

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card card-accent"
        >
          <div className="sm-card-header">Learning Objectives</div>
          <ul className="sm-objectives-list">
            {content.learning_objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </motion.div>

        {/* Content Sections */}
        {content.content_sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="card"
          >
            <div className="sm-card-header">{section.heading}</div>
            <MarkdownRenderer content={section.body} />
            {section.key_points.length > 0 && (
              <div className="sm-key-points">
                <div className="sm-key-points-label">
                  <Star size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Key Points
                </div>
                <ul>
                  {section.key_points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}

        <div className="sm-divider" />

        {/* Exercises */}
        {content.exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="sm-section-heading">
              <BookOpen size={20} />
              <h2>Exercises</h2>
            </div>
            {content.exercises.map((exercise, i) => (
              <CollapsibleCard
                key={i}
                title={exercise.title}
                icon={<Award size={18} color="#5c6bc0" />}
                defaultOpen={i === 0}
              >
                <div style={{ marginBottom: '16px' }}>
                  <MarkdownRenderer content={exercise.instructions} />
                </div>
                {exercise.hints.length > 0 && (
                  <CollapsibleCard
                    title="Hints"
                    icon={<Lightbulb size={16} color="#f57f17" />}
                  >
                    <ul style={{ paddingLeft: '16px', display: 'grid', gap: '8px' }}>
                      {exercise.hints.map((hint, j) => (
                        <li key={j} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#444' }}>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleCard>
                )}
                <CollapsibleCard
                  title="Solution Guide"
                  icon={<CheckCircle size={16} color="#43a047" />}
                >
                  <MarkdownRenderer content={exercise.solution_guide} />
                </CollapsibleCard>
              </CollapsibleCard>
            ))}
          </motion.div>
        )}

        <div className="sm-divider" />

        {/* What Would You Do Scenarios */}
        {content.what_would_you_do_scenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div className="sm-section-heading">
              <HelpCircle size={20} />
              <h2>What Would You Do?</h2>
            </div>
            {content.what_would_you_do_scenarios.map((scenario, i) => (
              <CollapsibleCard
                key={i}
                title={`Scenario ${i + 1}`}
                icon={<MessageSquare size={18} color="#5c6bc0" />}
                defaultOpen={i === 0}
              >
                <p style={{ lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '16px', color: '#333' }}>
                  {scenario.scenario}
                </p>
                <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
                  {scenario.options.map((option, j) => (
                    <div key={j} className="sm-option">
                      <strong style={{ color: '#5c6bc0' }}>Option {String.fromCharCode(65 + j)}:</strong>{' '}
                      {option}
                    </div>
                  ))}
                </div>
                <CollapsibleCard
                  title="Discussion"
                  icon={<MessageSquare size={16} color="#43a047" />}
                >
                  <MarkdownRenderer content={scenario.discussion} />
                </CollapsibleCard>
              </CollapsibleCard>
            ))}
          </motion.div>
        )}

        <div className="sm-divider" />

        {/* Debate This */}
        {content.debate_this && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="sm-card-header">
              <Scale size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Debate This
            </div>
            <div className="sm-debate-statement">
              "{content.debate_this.statement}"
            </div>
            <div className="sm-args-grid">
              <div className="sm-args-for">
                <h4>For</h4>
                <ul>
                  {content.debate_this.for_arguments.map((arg, i) => (
                    <li key={i}>{arg}</li>
                  ))}
                </ul>
              </div>
              <div className="sm-args-against">
                <h4>Against</h4>
                <ul>
                  {content.debate_this.against_arguments.map((arg, i) => (
                    <li key={i}>{arg}</li>
                  ))}
                </ul>
              </div>
            </div>
            {content.debate_this.facilitator_note && (
              <div className="sm-facilitator-note">
                {content.debate_this.facilitator_note}
              </div>
            )}
          </motion.div>
        )}

        <div className="sm-divider" />

        {/* Quick Win */}
        {content.quick_win && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="sm-quick-win"
          >
            <div className="sm-quick-win-label">
              <Zap size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Quick Win
            </div>
            <p style={{ lineHeight: 1.7 }}>{content.quick_win}</p>
          </motion.div>
        )}

        {/* Self-Assessment Questions */}
        {content.self_assessment_questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="card card-accent" style={{ marginTop: '1.25rem' }}>
              <div className="sm-card-header">Self-Assessment</div>
              {content.self_assessment_questions.map((qa, i) => (
                <div key={i} className="sm-sa-question">
                  <div className="sm-sa-q-text">{qa.question}</div>
                  <CollapsibleCard
                    title="Show Answer"
                    icon={<CheckCircle size={16} color="#5c6bc0" />}
                  >
                    <MarkdownRenderer content={qa.answer} />
                  </CollapsibleCard>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="sm-divider" />

        {/* Key Takeaways */}
        {content.key_takeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="card card-green"
          >
            <div className="sm-card-header">
              <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Key Takeaways
            </div>
            <ol className="sm-takeaway-list">
              {content.key_takeaways.map((takeaway, i) => (
                <li key={i}>{takeaway}</li>
              ))}
            </ol>
          </motion.div>
        )}

        {/* Confidence Check */}
        {content.confidence_check && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
            style={{ marginTop: '1.25rem' }}
          >
            <div className="sm-card-header">Confidence Check</div>
            <div className="sm-confidence-prompt">
              <div className="sm-confidence-label">Before</div>
              {content.confidence_check.before_prompt}
            </div>
            <div className="sm-confidence-prompt">
              <div className="sm-confidence-label">After</div>
              {content.confidence_check.after_prompt}
            </div>
            {content.confidence_check.reflection && (
              <CollapsibleCard
                title="Reflection Prompt"
                icon={<Lightbulb size={16} color="#f57f17" />}
              >
                <MarkdownRenderer content={content.confidence_check.reflection} />
              </CollapsibleCard>
            )}
          </motion.div>
        )}

        <div className="sm-divider" />

        {/* Resources */}
        {content.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="card"
          >
            <div className="sm-card-header">
              <ExternalLink size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Resources
            </div>
            {content.resources.map((resource, i) => (
              <div key={i} className="sm-resource-item">
                <div>
                  <span className="sm-resource-title">{resource.title}</span>
                  <span className="sm-resource-type">{resource.type}</span>
                </div>
                <div className="sm-resource-desc">{resource.description}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bottom nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', padding: '2rem 0 1rem' }}
        >
          <button className="btn-primary" onClick={() => navigate('/upskill-plan')}>
            <ArrowLeft size={18} />
            Back to Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}
