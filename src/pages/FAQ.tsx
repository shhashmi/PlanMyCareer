import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: 'What is AI Fluens?',
    answer: 'AI Fluens is an AI-powered platform that helps professionals identify their AI skill gaps and provides personalized learning paths. We analyze your current role, experience, and goals to create a tailored assessment and upskilling plan that helps you stay competitive in an AI-driven world.'
  },
  {
    question: 'How long does the assessment take?',
    answer: 'The Basic Assessment takes approximately 10-15 minutes to complete. The Advanced Assessment is more comprehensive and typically takes 20-30 minutes. Both assessments adapt to your responses, so the exact time may vary slightly based on your answers.'
  },
  {
    question: 'What skills are assessed?',
    answer: 'We assess a range of AI-related competencies tailored to your role, including AI/ML fundamentals, prompt engineering, AI tool proficiency, data literacy, AI ethics and governance, and role-specific AI applications. The specific skills evaluated depend on your job function and industry.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All personal information and assessment results are encrypted and stored securely. We never sell your data to third parties. You can review our full Privacy Policy for detailed information about how we protect and use your data.'
  },
  {
    question: 'Can I retake the assessment?',
    answer: 'Yes! You can retake the assessment anytime to track your progress as you develop new AI skills. We recommend retaking the assessment every few months to measure your improvement and update your learning plan.'
  },
  {
    question: "What's included in the Advanced plan?",
    answer: 'The Advanced Assessment ($20 one-time) includes a comprehensive skill gap analysis, detailed competency scores with insights, a personalized weekly learning plan, hands-on assignments to practice your skills, a curated library of learning resources, and progress tracking to monitor your improvement over time.'
  },
  {
    question: 'How is the learning plan personalized?',
    answer: 'Your learning plan is generated based on your assessment results, current role, experience level, and career goals. Our AI analyzes your skill gaps and creates a week-by-week roadmap with specific resources, exercises, and milestones tailored to your needs.'
  },
  {
    question: 'Do I need technical experience to use AI Fluens?',
    answer: 'No technical experience is required. AI Fluens is designed for professionals at all levels, from beginners exploring AI for the first time to experienced practitioners looking to expand their expertise. The assessment adapts to your background and experience level.'
  }
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        border: `1px solid ${isOpen ? 'rgba(20, 184, 166, 0.3)' : 'var(--border)'}`,
        overflow: 'hidden',
        transition: 'border-color 0.2s'
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{
          fontSize: '16px',
          fontWeight: '500',
          color: isOpen ? 'var(--primary-light)' : 'var(--text-primary)'
        }}>
          {question}
        </span>
        <ChevronDown
          size={20}
          color={isOpen ? 'var(--primary-light)' : 'var(--text-muted)'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            flexShrink: 0
          }}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p style={{
              padding: '0 24px 20px',
              margin: 0,
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              fontSize: '15px'
            }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.15) 0%, transparent 50%)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <HelpCircle size={16} color="#fbbf24" />
            <span style={{ fontSize: '14px', color: '#fbbf24' }}>Got Questions?</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            Frequently Asked Questions
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to know about AI Fluens and how we can help you upskill.
          </p>
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '60px',
            padding: '40px',
            background: 'var(--surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            maxWidth: '600px',
            margin: '60px auto 0'
          }}
        >
          <Sparkles size={32} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>
            Still have questions?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Start your free assessment to experience AI Fluens firsthand, or contact us for more information.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ padding: '14px 32px' }}
          >
            Get Started Free
          </button>
        </motion.div>
      </section>
    </main>
  );
}
