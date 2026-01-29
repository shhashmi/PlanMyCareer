import { motion } from 'framer-motion';
import { UserCircle, ClipboardCheck, Route, ArrowRight, Sparkles } from 'lucide-react';
import { GetStartedCTA } from '../components/GetStartedCTA';

const steps = [
  {
    number: 1,
    title: 'Tell Us About You',
    description: 'Fill in your role, company, years of experience, and career goals. This helps us understand your unique professional context.',
    icon: UserCircle,
    color: '#14b8a6'
  },
  {
    number: 2,
    title: 'Take the Assessment',
    description: 'Answer personalized AI skill questions tailored to your role. Our assessments adapt to your experience level and industry.',
    icon: ClipboardCheck,
    color: '#6366f1'
  },
  {
    number: 3,
    title: 'Get Your Plan',
    description: 'Receive a detailed skill gap analysis and a personalized learning roadmap with curated resources and hands-on assignments.',
    icon: Route,
    color: '#f59e0b'
  }
];

export default function HowItWorks() {
  return (
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 50%)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '14px', color: '#818cf8' }}>Simple 3-Step Process</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            How It Works
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover your AI skill gaps and build a personalized learning path in just three simple steps.
          </p>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start',
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid var(--border)',
                position: 'relative'
              }}
            >
              {/* Step Number Circle */}
              <div style={{
                minWidth: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `${step.color}20`,
                border: `2px solid ${step.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: step.color
              }}>
                {step.number}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <step.icon size={24} color={step.color} />
                  <h2 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>
                    {step.title}
                  </h2>
                </div>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '16px',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (except last) */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '-28px',
                  left: '53px',
                  color: 'var(--text-muted)',
                  zIndex: 1
                }}>
                  <ArrowRight size={20} style={{ transform: 'rotate(90deg)' }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <GetStartedCTA delay={0.8} style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Ready to discover your AI skill gaps?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Start your personalized assessment today — it's free!
          </p>
        </GetStartedCTA>
      </section>
    </main>
  );
}
