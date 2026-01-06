import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, ArrowRight, Check, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AssessmentChoice() {
  const navigate = useNavigate()
  const { isLoggedIn, skills } = useApp()

  if (!isLoggedIn || skills.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Choose Your Assessment Type
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Select how you'd like to assess your AI skills
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/basic-assessment')}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ borderColor: 'var(--primary)', scale: 1.02 }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <ClipboardList size={28} color="var(--primary-light)" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Basic Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Quick self-evaluation to understand where you stand
            </p>

            <div style={{ 
              background: 'rgba(99, 102, 241, 0.1)', 
              padding: '16px', 
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>Free</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>5-10 minutes</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {[
                'Self-evaluation questionnaire',
                'Skill gap visualization',
                'Basic recommendations',
                'Instant results'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Start Basic Assessment
              <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/payment')}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: '24px',
              padding: '32px',
              border: '2px solid var(--primary)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'var(--gradient-1)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Crown size={14} />
              RECOMMENDED
            </div>

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Sparkles size={28} color="white" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
              Advanced Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              AI-powered deep analysis with personalized upskilling plan
            </p>

            <div style={{ 
              background: 'rgba(99, 102, 241, 0.15)', 
              padding: '16px', 
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>$49</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>one-time</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {[
                'AI-driven interactive assessment',
                'Short assignments & case studies',
                'Detailed skill analysis with reasoning',
                'Personalized weekly upskill plan',
                'Curated learning resources'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Get Advanced Assessment
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
