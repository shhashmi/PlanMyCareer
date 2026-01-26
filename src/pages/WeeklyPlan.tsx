import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, Target, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WeeklyPlan() {
  const navigate = useNavigate();

  const weeklyTasks = [
    {
      day: 'Monday',
      focus: 'AI Fundamentals',
      tasks: [
        'Review core ML concepts',
        'Complete practice exercises'
      ],
      duration: '45 min'
    },
    {
      day: 'Tuesday',
      focus: 'Prompt Engineering',
      tasks: [
        'Study prompt patterns',
        'Practice with examples'
      ],
      duration: '30 min'
    },
    {
      day: 'Wednesday',
      focus: 'AI-Assisted Development',
      tasks: [
        'Explore AI coding tools',
        'Build a small project'
      ],
      duration: '60 min'
    },
    {
      day: 'Thursday',
      focus: 'Ethics & Responsibility',
      tasks: [
        'Read AI ethics guidelines',
        'Case study analysis'
      ],
      duration: '30 min'
    },
    {
      day: 'Friday',
      focus: 'Review & Practice',
      tasks: [
        'Weekly quiz',
        'Reflect on learnings'
      ],
      duration: '30 min'
    }
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '100px',
            marginBottom: '24px'
          }}>
            <Calendar size={16} color="var(--primary-light)" />
            <span style={{ color: 'var(--primary-light)', fontSize: '14px', fontWeight: '500' }}>
              Your Learning Journey
            </span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            Your Weekly Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            A structured approach to building your AI fluency, one week at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid var(--primary)',
            marginBottom: '40px',
            textAlign: 'center'
          }}
        >
          <Lock size={48} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
            Unlock Your Personalized Plan
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Complete the Advanced Assessment to get a weekly plan tailored to your specific skill gaps and learning goals.
          </p>
          <button
            onClick={() => navigate('/payment')}
            className="btn-primary"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            Get Advanced Assessment - $20
            <ArrowRight size={18} />
          </button>
        </motion.div>

        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: 'var(--text-muted)' }}>
          Sample Weekly Plan Preview
        </h3>

        <div style={{ display: 'grid', gap: '16px', opacity: 0.6 }}>
          {weeklyTasks.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + 0.05 * index }}
              style={{
                background: 'var(--surface)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  {item.day}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: '13px'
                }}>
                  <Clock size={14} />
                  {item.duration}
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <Target size={16} color="var(--primary-light)" />
                  <span style={{ fontWeight: '500' }}>{item.focus}</span>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  {item.tasks.map((task, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-secondary)',
                      fontSize: '14px'
                    }}>
                      <BookOpen size={14} />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                padding: '8px 16px',
                background: 'var(--surface-light)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                Locked
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
