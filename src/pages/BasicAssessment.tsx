import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { assessmentService } from '../services/assessmentService';
import type { AssessmentStartResponse, AssessmentQuestion, SelectedOption, Dimension, DimensionCode } from '../types/api.types';

// Map option index to option letter
const OPTION_LETTERS: SelectedOption[] = ['A', 'B', 'C', 'D'];

export default function BasicAssessment() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get assessment data from route state
  const locationState = location.state as { assessmentData?: AssessmentStartResponse } | null

  const [assessmentData, setAssessmentData] = useState<AssessmentStartResponse | undefined>(locationState?.assessmentData)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, SelectedOption>>({})
  const [savingAnswer, setSavingAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState<Dimension[]>([])
  const [loading, setLoading] = useState(!assessmentData)

  // Fetch dimensions for display names
  useEffect(() => {
    const fetchDimensions = async () => {
      const dims = await assessmentService.getCachedDimensions()
      setDimensions(dims)
    }
    fetchDimensions()
  }, [])

  // Handle resume from URL if state is missing
  useEffect(() => {
    const handleResume = async () => {
      if (assessmentData) return

      const params = new URLSearchParams(location.search)
      const sessionId = params.get('session_id')
      const isResume = params.get('resume') === 'true'

      if (isResume && sessionId) {
        setLoading(true)
        try {
          const response = await assessmentService.resumeAssessment()
          // Note: resumeAssessment in service usually returns the last incomplete session
          // We need to verify if we should use the sessionId from URL
          if (response.success && response.data) {
            const data = response.data
            setAssessmentData(data)

            // Populate existing answers
            const existingAnswers: Record<number, SelectedOption> = {}
            let firstUnansweredIndex = -1

            data.questions.forEach((q, index) => {
              if (q.is_answered && q.selected_option) {
                existingAnswers[q.question_id] = q.selected_option
              } else if (firstUnansweredIndex === -1) {
                firstUnansweredIndex = index
              }
            })

            setAnswers(existingAnswers)

            // Start from first unanswered question, or the first one if all answered (shouldn't happen for incomplete)
            if (firstUnansweredIndex !== -1) {
              setCurrentQuestionIndex(firstUnansweredIndex)
            }
          } else {
            setError(response.error?.message || 'Failed to resume assessment')
          }
        } catch (err) {
          setError('An unexpected error occurred while resuming')
        } finally {
          setLoading(false)
        }
      } else {
        // No session data and not a resume attempt
        navigate('/assessment')
      }
    }

    handleResume()
  }, [assessmentData, location.search, navigate])

  // Get full dimension name from code
  const getDimensionName = (code: DimensionCode): string => {
    const dim = dimensions.find(d => d.dimension_code === code)
    return dim?.name || code
  }

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  if (!assessmentData || !assessmentData.questions || assessmentData.questions.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>No Questions Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>We couldn't find any questions for your profile. Please try again or update your profile.</p>
          <button onClick={() => navigate('/assessment')} className="btn-primary">Back to Selection</button>
        </div>
      </div>
    );
  }

  const questions = assessmentData.questions
  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const currentProgress = currentQuestionIndex + 1

  // Get options as array for the current question
  const getOptions = (question: AssessmentQuestion): string[] => {
    return [question.option_a, question.option_b, question.option_c, question.option_d]
  }

  const handleAnswer = (optionIndex: number) => {
    const selectedOption = OPTION_LETTERS[optionIndex]
    const questionId = currentQuestion.question_id
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }))
    setError(null)
  }

  const handleNext = async () => {
    const questionId = currentQuestion.question_id
    const selectedOption = answers[questionId]

    if (!selectedOption) return

    setSavingAnswer(true)
    setError(null)

    try {
      const response = await assessmentService.saveAnswer({
        session_id: assessmentData.session_id,
        question_id: questionId,
        selected_option: selectedOption,
      })

      if (!response.success) {
        setError(response.error?.message || 'Failed to save answer')
        return
      }

      // Move to next question or results
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Assessment complete - submit assessment before navigating to results
        const submitResponse = await assessmentService.submitAssessment({
          session_id: assessmentData.session_id,
        })

        if (!submitResponse.success) {
          setError(submitResponse.error?.message || 'Failed to submit assessment')
          return
        }

        navigate('/basic-results', { state: { sessionId: assessmentData.session_id } })
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSavingAnswer(false)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setError(null)
    }
  }

  const hasAnswer = answers[currentQuestion.question_id] !== undefined
  const options = getOptions(currentQuestion)

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
              {getDimensionName(currentQuestion.dimension)} • {currentQuestion.difficulty_level}
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

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.question_id}
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
              {currentQuestion.question_text}
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {options.map((option, index) => {
                const optionLetter = OPTION_LETTERS[index]
                const isSelected = answers[currentQuestion.question_id] === optionLetter

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={savingAnswer}
                    whileHover={{ scale: savingAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: savingAnswer ? 1 : 0.98 }}
                    style={{
                      padding: '16px 20px',
                      background: isSelected
                        ? 'rgba(20, 184, 166, 0.2)'
                        : 'var(--surface-light)',
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : '2px solid transparent',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '16px',
                      textAlign: 'left',
                      cursor: savingAnswer ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: savingAnswer && !isSelected ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--primary)' : 'var(--surface)',
                      color: isSelected ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {optionLetter}
                    </span>
                    {option}
                  </motion.button>
                )
              })}
            </div>

            {savingAnswer && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                color: 'var(--text-muted)',
                fontSize: '14px'
              }}>
                <Loader2 size={16} className="animate-spin" />
                Saving answer...
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px'
        }}>
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'transparent',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer || savingAnswer}
            className="btn-primary"
            style={{
              opacity: hasAnswer && !savingAnswer ? 1 : 0.5,
              cursor: hasAnswer && !savingAnswer ? 'pointer' : 'not-allowed'
            }}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? 'View Results'
              : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
