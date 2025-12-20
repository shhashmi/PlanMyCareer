import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getLevelNumber } from '../data/skillsData'

const aiResponses = [
  "Great! Let's start by understanding your experience with AI tools in your daily work. Can you describe a recent project where you used AI assistance?",
  "That's insightful! Now, let's dive deeper into prompt engineering. When you need an AI to generate specific output, what's your approach to crafting the prompt?",
  "Excellent response! I can see you have some practical experience. Let me give you a quick scenario: You need to build a feature that summarizes customer feedback using an LLM. Walk me through your approach.",
  "Very thorough! Now for a quick assessment: What do you think are the main challenges in integrating AI APIs into production systems?",
  "Great points! Final question: How do you stay updated with the rapidly evolving AI landscape? What resources do you rely on?",
  "Thank you for your detailed responses! I've gathered enough information to provide a comprehensive analysis of your AI skills. Click below to see your personalized results."
]

export default function AdvancedAssessment() {
  const navigate = useNavigate()
  const { skills, setAdvancedResults, profileData } = useApp()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (skills.length === 0) {
      navigate('/')
      return
    }
    
    setTimeout(() => {
      setMessages([{
        type: 'bot',
        content: `Hello! I'm your AI assessment assistant. I'll be evaluating your skills in ${skills.length} key areas for your role as ${profileData?.title || 'your position'}. Let's begin with an interactive conversation.`,
        timestamp: new Date()
      }])
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: aiResponses[0],
          timestamp: new Date()
        }])
      }, 1500)
    }, 500)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = { type: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    const nextQ = currentQuestion + 1
    
    if (nextQ < aiResponses.length) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: aiResponses[nextQ],
        timestamp: new Date()
      }])
      setCurrentQuestion(nextQ)
      
      if (nextQ === aiResponses.length - 1) {
        setIsComplete(true)
      }
    }

    setIsTyping(false)
  }

  const handleViewResults = () => {
    const results = skills.map(skill => {
      const base = getLevelNumber(skill.level)
      const variance = Math.floor(Math.random() * 4) - 2
      const score = Math.max(1, Math.min(10, base + variance))
      
      const reasonings = [
        `Based on your responses, you demonstrated ${score >= base ? 'strong' : 'developing'} understanding of ${skill.name.toLowerCase()}.`,
        `Your practical examples showed ${score >= base ? 'solid applied knowledge' : 'room for growth'} in this area.`,
        `The depth of your answers indicates ${score >= base ? 'proficiency' : 'foundational understanding'} that ${score >= base ? 'meets' : 'is building towards'} expectations.`
      ]
      
      return {
        ...skill,
        score,
        reasoning: reasonings[Math.floor(Math.random() * reasonings.length)]
      }
    })
    
    setAdvancedResults(results)
    navigate('/advanced-results')
  }

  return (
    <div style={{ 
      height: 'calc(100vh - 80px)', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={24} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>AI Assessment Assistant</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Interactive skill evaluation
          </p>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingRight: '8px'
      }}>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: msg.type === 'user' ? 'var(--surface-light)' : 'var(--gradient-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.type === 'user' ? <User size={18} /> : <Bot size={18} color="white" />}
              </div>
              <div style={{
                maxWidth: '70%',
                padding: '14px 18px',
                borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.type === 'user' ? 'var(--primary)' : 'var(--surface)',
                color: 'var(--text-primary)',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--surface)'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '24px' }}
        >
          <button
            onClick={handleViewResults}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
          >
            <Sparkles size={20} />
            View Your Detailed Results
          </button>
        </motion.div>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '24px',
          padding: '4px',
          background: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '16px',
              outline: 'none'
            }}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: input.trim() && !isTyping ? 'var(--gradient-1)' : 'var(--surface-light)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: input.trim() && !isTyping ? 1 : 0.5
            }}
          >
            {isTyping ? <Loader size={20} /> : <Send size={20} color="white" />}
          </button>
        </div>
      )}
    </div>
  )
}
