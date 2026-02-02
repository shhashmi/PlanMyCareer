import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GetStartedCTA } from '../components/GetStartedCTA';
import { IS_ADVANCED_ASSESSMENT_BETA } from '../data/assessmentData';

const plans = [
  {
    name: 'Basic Assessment',
    price: 'Free',
    priceSubtext: 'No credit card required',
    description: 'Quick AI skill evaluation to get you started',
    icon: Zap,
    color: '#14b8a6',
    features: [
      { text: 'AI skill gap analysis', included: true },
      { text: 'Basic competency scoring', included: true },
      { text: 'Instant results', included: true },
      { text: 'General learning recommendations', included: true },
      { text: 'Detailed weekly learning plan', included: false },
      { text: 'Hands-on assignments', included: false },
      { text: 'Curated resource library', included: false },
      { text: 'Progress tracking', included: false }
    ],
    cta: 'Start Free Assessment',
    highlighted: false
  },
  {
    name: 'Advanced Assessment',
    price: IS_ADVANCED_ASSESSMENT_BETA ? 'Free' : '$20',
    originalPrice: IS_ADVANCED_ASSESSMENT_BETA ? '$20' : undefined,
    priceSubtext: IS_ADVANCED_ASSESSMENT_BETA ? 'Complimentary during Beta' : 'One-time payment',
    isBeta: IS_ADVANCED_ASSESSMENT_BETA,
    description: 'Comprehensive analysis with personalized learning plan',
    icon: Crown,
    color: '#6366f1',
    features: [
      { text: 'AI skill gap analysis', included: true },
      { text: 'Detailed competency scoring', included: true },
      { text: 'In-depth results & insights', included: true },
      { text: 'Personalized recommendations', included: true },
      { text: 'Detailed weekly learning plan', included: true },
      { text: 'Hands-on assignments', included: true },
      { text: 'Curated resource library', included: true },
      { text: 'Progress tracking', included: true }
    ],
    cta: 'Get Advanced Assessment',
    highlighted: true
  }
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(20, 184, 166, 0.15) 0%, transparent 50%)'
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
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(20, 184, 166, 0.3)'
          }}>
            <Sparkles size={16} color="var(--primary-light)" />
            <span style={{ fontSize: '14px', color: 'var(--primary-light)' }}>Simple Pricing</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            Choose Your Assessment
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Start with a free basic assessment or unlock the full potential with our advanced analysis.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '24px'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{
                background: plan.highlighted
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
                  : 'var(--surface)',
                borderRadius: '20px',
                padding: '32px',
                border: plan.highlighted
                  ? '2px solid rgba(99, 102, 241, 0.5)'
                  : '1px solid var(--border)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--gradient-1)',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `${plan.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <plan.icon size={28} color={plan.color} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {plan.name}
                  {plan.isBeta && (
                    <span style={{
                      background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      letterSpacing: '0.5px',
                      lineHeight: '1.4'
                    }}>
                      BETA
                    </span>
                  )}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: '4px' }}>
                  {plan.originalPrice && (
                    <span style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'line-through', marginRight: '10px' }}>
                      {plan.originalPrice}
                    </span>
                  )}
                  <span style={{ fontSize: '42px', fontWeight: '700', color: plan.color }}>
                    {plan.price}
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {plan.priceSubtext}
                </span>
              </div>

              {/* Features List */}
              <div style={{ flex: 1, marginBottom: '24px' }}>
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: i < plan.features.length - 1 ? '1px solid var(--border)' : 'none'
                    }}
                  >
                    {feature.included ? (
                      <Check size={18} color="#14b8a6" />
                    ) : (
                      <X size={18} color="var(--text-muted)" />
                    )}
                    <span style={{
                      fontSize: '14px',
                      color: feature.included ? 'var(--text-secondary)' : 'var(--text-muted)'
                    }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <GetStartedCTA delay={0.4} style={{ marginTop: '48px' }} />

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '48px'
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            Have questions?{' '}
            <span
              onClick={() => navigate('/faq')}
              style={{
                color: 'var(--primary-light)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Check our FAQ
            </span>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
