import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentQuestions } from '../data/skillsData';

export default function BasicAssessment() {
  const navigate = useNavigate()
  const { skills, setAssessmentResults } = useApp()
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  if (skills.length === 0) {
    navigate('/')
    return null
  }

  const currentSkill = skills[currentSkillIndex]
  const questions = assessmentQuestions[currentSkill.name] || assessmentQuestions['default']
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = skills.length * 2
  const currentProgress = currentSkillIndex * 2 + currentQuestionIndex + 1

  const handleAnswer = (optionIndex) => {
    const key = `${currentSkill.name}-${currentQuestionIndex}`
    setAnswers(prev => ({ ...prev, [key]: optionIndex }))
  }

  const calculateScore = (skillName) => {
    const q1 = answers[`${skillName}-0`] || 0
    const q2 = answers[`${skillName}-1`] || 0
    return Math.min(10, Math.round(((q1 + q2) / 6) * 10) + 1)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSkillIndex < skills.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      const results = skills.map(skill => ({
        skillName: skill.name,
        score: calculateScore(skill.name),
        level: skill.level,
        name: skill.name,
        description: skill.description
      }))
      setAssessmentResults(results)
      navigate('/basic-results')
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentSkillIndex > 0) {
      setCurrentSkillIndex(currentSkillIndex - 1)
      setCurrentQuestionIndex(1)
    }
  }

  const currentAnswerKey = `${currentSkill.name}-${currentQuestionIndex}`
  const hasAnswer = answers[currentAnswerKey] !== undefined

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Question {currentProgress} of {totalQuestions}
            </span>
            <span style={{ color: 'var(--primary-light)', fontSize: '14px', fontWeight: '500' }}>
              {currentSkill.name}
            </span>
          </div>
          <div style={{ 
            height: '6px', 
            background: 'var(--surface-light)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentProgress / totalQuestions) * 100}%` }}
              style={{
                height: '100%',
                background: 'var(--gradient-1)',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnswerKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid var(--border)'
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.4' }}>
              {currentQuestion.question}
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '16px 20px',
                    background: answers[currentAnswerKey] === index 
                      ? 'rgba(99, 102, 241, 0.2)' 
                      : 'var(--surface-light)',
                    border: answers[currentAnswerKey] === index 
                      ? '2px solid var(--primary)' 
                      : '2px solid transparent',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '24px' 
        }}>
          <button
            onClick={handlePrev}
            disabled={currentSkillIndex === 0 && currentQuestionIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'transparent',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              opacity: currentSkillIndex === 0 && currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentSkillIndex === 0 && currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="btn-primary"
            style={{
              opacity: hasAnswer ? 1 : 0.5,
              cursor: hasAnswer ? 'pointer' : 'not-allowed'
            }}
          >
            {currentSkillIndex === skills.length - 1 && currentQuestionIndex === questions.length - 1 
              ? 'View Results' 
              : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
