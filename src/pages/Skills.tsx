import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLevelColor } from '../data/skillsData';

export default function Skills() {
  const navigate = useNavigate()
  const { profileData, skills } = useApp()

  if (!profileData || skills.length === 0) {
    navigate('/')
    return null
  }

  const levelLabels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert'
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '20px',
            marginBottom: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <Sparkles size={16} color="var(--secondary)" />
            <span style={{ fontSize: '14px', color: 'var(--secondary)' }}>Skills Identified</span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
            AI Skills for Your Success
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            As a <strong>{profileData.title}</strong> at <strong>{profileData.company}</strong>, 
            here are the AI skills you need to thrive and grow
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${getLevelColor(skill.level)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={20} color={getLevelColor(skill.level)} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{skill.name}</h3>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', flex: 1 }}>
                {skill.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: `${getLevelColor(skill.level)}20`,
                  color: getLevelColor(skill.level),
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {levelLabels[skill.level]} Required
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: '12px'
                }}>
                  <Info size={14} />
                  <span>Hover for details</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
            Ready to Assess Your Skills?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Take our assessment to see where you stand against these requirements 
            and get a personalized upskilling plan
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ padding: '16px 40px', fontSize: '18px' }}
          >
            Take Assessment
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
