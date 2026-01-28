import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLevelColor } from '../data/skillsData';
import { engineeringRoles, getSkillDescription } from '../data/skillDescriptions';

export default function Skills() {
  const navigate = useNavigate()
  const { profileData, skills, isLoggedIn } = useApp()
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const isEngineeringRole = profileData?.role && engineeringRoles.some(
    r => profileData.role.toLowerCase().includes(r.toLowerCase())
  )

  useEffect(() => {
    if (!profileData) {
      navigate('/');
    }
  }, [profileData, navigate]);

  if (!profileData) {
    return null;
  }

  if (skills.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Loading skills for your role...</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    )
  }

  // Map proficiency levels (case-insensitive)
  const normalizeLevel = (level: string) => level.toLowerCase();

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
            As a <strong>{profileData.role}</strong> at <strong>{profileData.company}</strong>,
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
                    background: `${getLevelColor(normalizeLevel(skill.level))}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={20} color={getLevelColor(normalizeLevel(skill.level))} />
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
                  background: `${getLevelColor(normalizeLevel(skill.level))}20`,
                  color: getLevelColor(normalizeLevel(skill.level)),
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px'
                }}>
                  {skill.level} Required
                </span>
                {isEngineeringRole && getSkillDescription(skill.name, profileData.role) && (
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <Info size={14} />
                    <span>Hover for details</span>

                    <AnimatePresence>
                      {hoveredSkill === skill.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            right: 0,
                            marginBottom: '12px',
                            width: '380px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '16px',
                            background: '#0a1628',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                            zIndex: 100,
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: '#e2e8f0',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}>
                            {skill.name}
                          </div>
                          {getSkillDescription(skill.name, profileData.role)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
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
            onClick={() => navigate(isLoggedIn ? '/assessment' : '/login')}
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
