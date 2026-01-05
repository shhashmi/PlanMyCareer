import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight, MessageSquare, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLevelNumber, getLevelColor } from '../data/skillsData';

export default function AdvancedResults() {
  const navigate = useNavigate()
  const { advancedResults, profileData } = useApp()

  if (!advancedResults || advancedResults.length === 0) {
    navigate('/')
    return null
  }

  const getGapStatus = (score, requiredLevel) => {
    const required = getLevelNumber(requiredLevel)
    const gap = required - score
    if (gap <= 0) return { status: 'met', label: 'Exceeds', color: 'var(--secondary)' }
    if (gap <= 2) return { status: 'close', label: 'Almost There', color: 'var(--accent)' }
    return { status: 'gap', label: 'Focus Area', color: 'var(--error)' }
  }

  const averageScore = Math.round(advancedResults.reduce((acc, s) => acc + s.score, 0) / advancedResults.length)
  const topSkills = advancedResults.filter(s => s.score >= getLevelNumber(s.level)).slice(0, 3)
  const focusSkills = advancedResults.filter(s => s.score < getLevelNumber(s.level) - 1).slice(0, 3)

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Detailed AI Skill Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Comprehensive assessment based on your interactive evaluation
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Target size={24} color="var(--primary-light)" />
              <span style={{ color: 'var(--text-muted)' }}>Overall Score</span>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-light)' }}>
              {averageScore}/10
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={24} color="var(--secondary)" />
              <span style={{ color: 'var(--text-muted)' }}>Your Strengths</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topSkills.map(skill => (
                <span key={skill.name} style={{
                  padding: '6px 12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--secondary)'
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <TrendingUp size={24} color="var(--accent)" />
              <span style={{ color: 'var(--text-muted)' }}>Growth Areas</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {focusSkills.map(skill => (
                <span key={skill.name} style={{
                  padding: '6px 12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--accent)'
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare size={24} color="var(--primary-light)" />
            Detailed Skill Analysis
          </h2>

          <div style={{ display: 'grid', gap: '24px' }}>
            {advancedResults.map((skill, index) => {
              const required = getLevelNumber(skill.level)
              const gapInfo = getGapStatus(skill.score, skill.level)
              
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  style={{
                    padding: '20px',
                    background: 'var(--surface-light)',
                    borderRadius: '16px',
                    borderLeft: `4px solid ${gapInfo.color}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{skill.name}</h3>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: `${gapInfo.color}20`,
                          color: gapInfo.color
                        }}>
                          {gapInfo.label}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{skill.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: gapInfo.color }}>
                        {skill.score}/10
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Required: {required}/10
                      </div>
                    </div>
                  </div>

                  <div style={{ position: 'relative', height: '8px', background: 'var(--surface)', borderRadius: '4px', marginBottom: '16px' }}>
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
                  </div>

                  <div style={{
                    padding: '12px 16px',
                    background: 'var(--surface)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>AI Analysis: </strong>
                    {skill.reasoning}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            background: 'var(--gradient-1)',
            borderRadius: '24px'
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Ready to Close Your Skill Gaps?
          </h2>
          <p style={{ marginBottom: '24px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 24px' }}>
            Get a personalized weekly upskilling plan with curated resources and exercises
          </p>
          <button 
            onClick={() => navigate('/upskill-plan')}
            style={{
              background: 'white',
              color: 'var(--primary-dark)',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            Create My Upskill Plan
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
