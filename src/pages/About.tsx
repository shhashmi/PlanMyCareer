import { motion } from 'framer-motion';
import { Target, Lightbulb, TrendingUp, Users, Zap, Clock } from 'lucide-react';
import { GetStartedCTA } from '../components/GetStartedCTA';
import SEOHead from '../components/SEOHead';

const values = [
  {
    icon: Target,
    title: 'Hyper-Personalized',
    description: 'Learning paths built around your role, your goals, and your reality — not generic curricula.',
    color: '#14b8a6'
  },
  {
    icon: Clock,
    title: 'Time-Conscious',
    description: 'Designed for busy professionals. Learn what matters, skip what doesn\'t.',
    color: '#6366f1'
  },
  {
    icon: TrendingUp,
    title: 'Always Current',
    description: 'AI evolves fast. Our assessments and recommendations evolve with it.',
    color: '#f59e0b'
  },
  {
    icon: Users,
    title: 'For Every Role',
    description: 'From marketers to engineers, we tailor AI skill development to your specific function.',
    color: '#ec4899'
  }
];

export default function About() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <SEOHead />
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 50%)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '20px'
          }}>
            The World Isn't Waiting
            <br />
            <span style={{
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>And Neither Should You</span>
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            AI is raising the bar while shrinking your time to clear it.
            <br />
            We help you leap smarter, not longer.
          </p>
        </motion.div>
      </section>

      {/* The Paradox Section */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap size={28} color="#f59e0b" />
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
              The AI Paradox
            </h2>
          </div>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '16px'
          }}>
            AI is evolving at an unprecedented pace, fundamentally reshaping how work gets done. But here's the paradox: <strong style={{ color: 'var(--text-primary)' }}>the very productivity AI enables is leaving professionals with less time to learn the skills they need to stay relevant.</strong>
          </p>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            margin: 0
          }}>
            You're expected to deliver more. Move faster. Do it with AI. Yet carving out hours for courses and certifications? That's a luxury most can't afford.
          </p>
        </motion.div>
      </section>

      {/* The Solution Section */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(20, 184, 166, 0.3)'
          }}>
            <Lightbulb size={16} color="var(--primary-light)" />
            <span style={{ fontSize: '14px', color: 'var(--primary-light)' }}>Our Solution</span>
          </div>

          <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>
            AI Fluens Breaks This Cycle
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '16px'
          }}>
            We don't believe in one-size-fits-all learning paths or endless course catalogs. Instead, we assess exactly where you stand, identify the AI skills that matter most for <em>your</em> career, and build a focused, actionable plan that respects the reality of your schedule.
          </p>
          <p style={{
            fontSize: '22px',
            fontWeight: '600',
            background: 'var(--gradient-1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '32px 0 0'
          }}>
            Learn what matters. Skip what doesn't. Get ahead — on your terms.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              { stat: '85%', label: 'of jobs will require AI skills by 2030' },
              { stat: '40%', label: 'productivity boost with AI proficiency' },
              { stat: '2x', label: 'career growth for AI-skilled professionals' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  background: 'var(--gradient-1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px'
                }}>
                  {item.stat}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <h2 style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'center', fontWeight: '600' }}>
            What Sets Us Apart
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                style={{
                  padding: '28px',
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${value.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <value.icon size={24} color={value.color} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <GetStartedCTA buttonText="Start Your Assessment" delay={0.9} style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Ready to break the cycle?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Discover your AI skill gaps and get a personalized plan in minutes.
          </p>
        </GetStartedCTA>
      </section>
    </div>
  );
}
