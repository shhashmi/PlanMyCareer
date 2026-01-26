import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic Assessment',
      price: 'Free',
      description: 'Perfect for getting started with AI skill assessment',
      icon: Zap,
      features: [
        '15 assessment questions',
        '5 AI skill dimensions evaluated',
        'Strengths & improvement areas',
        'Competency breakdown',
        'Unlimited retakes',
        'Aggregate results tracking'
      ],
      cta: 'Start Free Assessment',
      primary: false,
      onClick: () => navigate('/assessment')
    },
    {
      name: 'Advanced Assessment',
      price: '$20',
      priceNote: 'one-time',
      description: 'Comprehensive analysis with personalized upskilling plan',
      icon: Crown,
      features: [
        'Everything in Basic, plus:',
        '30+ in-depth questions',
        'AI-powered analysis',
        'Personalized learning paths',
        'Curated resources library',
        'Weekly action plans',
        'Progress tracking dashboard',
        'Certificate of completion'
      ],
      cta: 'Get Advanced Assessment',
      primary: true,
      onClick: () => navigate('/payment')
    }
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
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
              Simple Pricing
            </span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            Choose Your Assessment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Start with our free Basic Assessment or unlock the full potential with our Advanced Assessment.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                style={{
                  background: plan.primary
                    ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : 'var(--surface)',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: plan.primary ? '2px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {plan.primary && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 12px',
                    background: 'var(--gradient-1)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: plan.primary ? 'var(--gradient-1)' : 'var(--surface-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <Icon size={28} color={plan.primary ? 'white' : 'var(--primary-light)'} />
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                  {plan.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '42px', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      {plan.priceNote}
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
                  {plan.description}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px',
                        color: 'var(--text-secondary)',
                        fontSize: '15px'
                      }}
                    >
                      <Check size={18} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.onClick}
                  className={plan.primary ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px 24px',
                    fontSize: '16px'
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
