import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLevelNumber, getLevelColor } from '../data/skillsData';

export default function BasicResults() {
  const navigate = useNavigate()
  const { assessmentResults, profileData } = useApp()

  if (!assessmentResults || assessmentResults.length === 0) {
    navigate('/')
    return null
  }

  const getGapStatus = (score, requiredLevel) => {
    const required = getLevelNumber(requiredLevel)
    const gap = required - score
    if (gap <= 0) return { status: 'met', label: 'Meets Expectations', color: 'var(--secondary)' }
    if (gap <= 2) return { status: 'close', label: 'Almost There', color: 'var(--accent)' }
    return { status: 'gap', label: 'Needs Improvement', color: 'var(--error)' }
  }

  const averageScore = Math.round(assessmentResults.reduce((acc, s) => acc + s.score, 0) / assessmentResults.length)
  const skillsNeedingWork = assessmentResults.filter(s => getGapStatus(s.score, s.level).status === 'gap').length

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Assessment Results
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Here's how you stand against the AI skills needed for your role
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-light)', marginBottom: '8px' }}>
              {averageScore}/10
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Average Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--secondary)', marginBottom: '8px' }}>
              {assessmentResults.length - skillsNeedingWork}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Skills On Track</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              {skillsNeedingWork}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Needs Improvement</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            Skill Gap Analysis
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {assessmentResults.map((skill, index) => {
              const required = getLevelNumber(skill.level)
              const gapInfo = getGapStatus(skill.score, skill.level)
              
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'var(--surface-light)',
                    borderRadius: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{skill.name}</h3>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${gapInfo.color}20`,
                        color: gapInfo.color
                      }}>
                        {gapInfo.label}
                      </span>
                    </div>
                    
                    <div style={{ position: 'relative', height: '8px', background: 'var(--surface)', borderRadius: '4px' }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${required * 10}%`,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px'
                      }} />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score * 10}%` }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          background: gapInfo.color,
                          borderRadius: '4px'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        left: `${required * 10}%`,
                        top: '-4px',
                        width: '2px',
                        height: '16px',
                        background: getLevelColor(skill.level),
                        borderRadius: '1px'
                      }} />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>Your level: {skill.score}/10</span>
                      <span>Required: {required}/10 ({skill.level})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {gapInfo.status === 'met' ? (
                      <CheckCircle size={24} color="var(--secondary)" />
                    ) : gapInfo.status === 'close' ? (
                      <TrendingUp size={24} color="var(--accent)" />
                    ) : (
                      <AlertCircle size={24} color="var(--error)" />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '24px',
            border: '1px solid var(--primary)'
          }}
        >
          <Sparkles size={40} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
            Want a Detailed Analysis & Upskill Plan?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Get AI-powered deep assessment with personalized learning paths, 
            curated resources, and weekly action plans
          </p>
          <button 
            onClick={() => navigate('/payment')}
            className="btn-primary"
            style={{ padding: '16px 32px', fontSize: '16px' }}
          >
            Get Advanced Assessment - $49
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
