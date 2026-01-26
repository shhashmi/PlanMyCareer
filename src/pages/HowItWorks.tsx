import { motion } from 'framer-motion';
import { CheckCircle, Brain, Target, TrendingUp, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: CheckCircle,
      title: 'Complete Your Profile',
      description: 'Tell us about your role, experience, and career goals. This helps us tailor the assessment to your specific needs.'
    },
    {
      icon: Brain,
      title: 'Take the Assessment',
      description: 'Answer questions designed to evaluate your AI fluency across key dimensions like fundamentals, prompting, and ethics.'
    },
    {
      icon: Target,
      title: 'Get Your Results',
      description: 'Receive a detailed breakdown of your strengths and areas for improvement with actionable insights.'
    },
    {
      icon: TrendingUp,
      title: 'Follow Your Upskill Plan',
      description: 'Access personalized learning resources and weekly action plans to systematically improve your AI skills.'
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
            <Sparkles size={16} color="var(--primary-light)" />
            <span style={{ color: 'var(--primary-light)', fontSize: '14px', fontWeight: '500' }}>
              Simple 4-Step Process
            </span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            How It Works
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Discover your AI skill gaps and build a personalized learning path in just a few simple steps.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '32px' }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  padding: '32px',
                  background: 'var(--surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'var(--gradient-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={28} color="white" />
                </div>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{step.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
