import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, BookOpen, ExternalLink, CheckCircle, Play, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { studyMaterials, getLevelNumber } from '../data/skillsData'

const timeOptions = [
  { value: 2, label: '2 hours/week', intensity: 'Light' },
  { value: 5, label: '5 hours/week', intensity: 'Moderate' },
  { value: 10, label: '10 hours/week', intensity: 'Intensive' },
  { value: 15, label: '15+ hours/week', intensity: 'Immersive' }
]

export default function UpskillPlan() {
  const navigate = useNavigate()
  const { advancedResults, setUpskillPlan, profileData } = useApp()
  const [selectedTime, setSelectedTime] = useState(null)
  const [showPlan, setShowPlan] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState(null)

  if (!advancedResults || advancedResults.length === 0) {
    navigate('/')
    return null
  }

  const focusSkills = advancedResults
    .filter(s => s.score < getLevelNumber(s.level))
    .sort((a, b) => (getLevelNumber(a.level) - a.score) - (getLevelNumber(b.level) - b.score))
    .reverse()

  const generatePlan = () => {
    const weeksNeeded = Math.ceil(focusSkills.length * 2)
    const hoursPerSkill = selectedTime / focusSkills.length

    const plan = []
    let currentWeek = 1

    focusSkills.forEach((skill, skillIndex) => {
      const materials = studyMaterials[skill.name] || studyMaterials['default']
      const weeksForSkill = Math.max(1, Math.ceil(2 * (10 - skill.score) / 5))

      for (let w = 0; w < weeksForSkill && currentWeek <= 12; w++) {
        const weekTasks = []
        
        if (w === 0) {
          weekTasks.push({
            type: 'learn',
            title: `Introduction to ${skill.name}`,
            description: 'Review fundamentals and core concepts',
            duration: Math.round(hoursPerSkill * 0.4),
            resources: materials.slice(0, 2)
          })
        }

        weekTasks.push({
          type: 'practice',
          title: w === 0 ? `${skill.name} Fundamentals Practice` : `${skill.name} Advanced Practice`,
          description: w === 0 ? 'Complete beginner exercises' : 'Work on intermediate challenges',
          duration: Math.round(hoursPerSkill * 0.4),
          resources: materials.slice(0, 1)
        })

        if (w === weeksForSkill - 1) {
          weekTasks.push({
            type: 'project',
            title: `${skill.name} Mini Project`,
            description: 'Apply your learning in a practical project',
            duration: Math.round(hoursPerSkill * 0.2),
            resources: []
          })
        }

        plan.push({
          week: currentWeek,
          skill: skill.name,
          skillLevel: skill.level,
          currentScore: skill.score,
          targetScore: getLevelNumber(skill.level),
          tasks: weekTasks,
          totalHours: selectedTime
        })

        currentWeek++
      }
    })

    setGeneratedPlan(plan.slice(0, 12))
    setUpskillPlan(plan.slice(0, 12))
    setShowPlan(true)
  }

  const getTaskIcon = (type) => {
    switch (type) {
      case 'learn': return <BookOpen size={16} />
      case 'practice': return <Play size={16} />
      case 'project': return <Target size={16} />
      default: return <CheckCircle size={16} />
    }
  }

  const getTaskColor = (type) => {
    switch (type) {
      case 'learn': return 'var(--primary-light)'
      case 'practice': return 'var(--secondary)'
      case 'project': return 'var(--accent)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Your Personalized Upskill Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            A structured learning path to close your AI skill gaps
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showPlan ? (
            <motion.div
              key="time-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Clock size={28} color="var(--primary-light)" />
                <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
                  How much time can you commit?
                </h2>
              </div>

              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                Select your weekly time commitment and we'll create an optimized learning schedule for you
              </p>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
                {timeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSelectedTime(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '20px 24px',
                      background: selectedTime === option.value 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'var(--surface-light)',
                      border: selectedTime === option.value 
                        ? '2px solid var(--primary)' 
                        : '2px solid transparent',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: selectedTime === option.value 
                          ? '2px solid var(--primary)' 
                          : '2px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedTime === option.value && (
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--primary)'
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: '500' }}>{option.label}</span>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary-light)'
                    }}>
                      {option.intensity}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={generatePlan}
                disabled={!selectedTime}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '16px',
                  opacity: selectedTime ? 1 : 0.5,
                  cursor: selectedTime ? 'pointer' : 'not-allowed'
                }}
              >
                <Calendar size={20} />
                Generate My Learning Plan
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                padding: '20px 24px',
                background: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {generatedPlan?.length}-Week Learning Journey
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    {selectedTime} hours per week commitment
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['learn', 'practice', 'project'].map(type => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: getTaskColor(type)
                      }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {generatedPlan?.map((week, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card"
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '20px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'var(--gradient-1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '18px'
                        }}>
                          W{week.week}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{week.skill}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            Current: {week.currentScore}/10 → Target: {week.targetScore}/10
                          </p>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'var(--surface-light)',
                        borderRadius: '8px'
                      }}>
                        <Clock size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {week.totalHours}h total
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {week.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          style={{
                            padding: '16px',
                            background: 'var(--surface-light)',
                            borderRadius: '12px',
                            borderLeft: `3px solid ${getTaskColor(task.type)}`
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <div style={{ color: getTaskColor(task.type) }}>
                                  {getTaskIcon(task.type)}
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: '500' }}>{task.title}</h4>
                              </div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                                {task.description}
                              </p>
                              {task.resources.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {task.resources.map((resource, rIndex) => (
                                    <a
                                      key={rIndex}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        background: 'var(--surface)',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: 'var(--primary-light)',
                                        textDecoration: 'none'
                                      }}
                                    >
                                      {resource.title}
                                      <ExternalLink size={12} />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{
                              padding: '6px 10px',
                              background: 'var(--surface)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap'
                            }}>
                              ~{task.duration}h
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  marginTop: '40px',
                  textAlign: 'center',
                  padding: '32px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                  Your Learning Journey is Ready!
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Follow this plan consistently and you'll be AI-ready in {generatedPlan?.length} weeks
                </p>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                >
                  Download Plan
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
