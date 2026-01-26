import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is AI Fluens?',
    answer: 'AI Fluens is a comprehensive AI skill assessment platform that helps professionals identify their AI skill gaps and provides personalized upskilling plans. Our assessments evaluate your proficiency across key AI dimensions including fundamentals, prompting, AI-assisted development, ethics, and collaboration.'
  },
  {
    question: 'How long does the assessment take?',
    answer: 'The Basic Assessment typically takes 10-15 minutes to complete. The Advanced Assessment is more comprehensive and may take 25-30 minutes, but provides deeper insights and a more detailed upskilling plan.'
  },
  {
    question: 'What is the difference between Basic and Advanced assessments?',
    answer: 'The Basic Assessment provides a quick overview of your AI fluency with key strengths and improvement areas. The Advanced Assessment ($20) offers in-depth analysis, personalized learning paths, curated resources, and weekly action plans tailored to your specific role and goals.'
  },
  {
    question: 'Do I need to create an account to take the assessment?',
    answer: 'You can start the assessment without an account, but we recommend signing in with Google, GitHub, or LinkedIn to save your progress, view your assessment history, and access your personalized upskilling plan anytime.'
  },
  {
    question: 'How are my results calculated?',
    answer: 'Your results are calculated based on your performance across five key AI dimensions. We analyze your correct answers, identify patterns in your responses, and compare your performance against industry benchmarks to provide accurate skill gap analysis.'
  },
  {
    question: 'Can I retake the assessment?',
    answer: 'Yes! You can retake the Basic Assessment as many times as you like to track your progress over time. Your aggregate results show improvement across all assessments.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We take data privacy seriously. Your assessment data is encrypted and stored securely. We never share your personal information with third parties without your consent. See our Privacy Policy for more details.'
  },
  {
    question: 'What happens after I complete the assessment?',
    answer: 'After completing the assessment, you\'ll receive immediate results showing your strengths and areas for improvement. You can view detailed breakdowns by dimension, access aggregate results across all your assessments, and with the Advanced Assessment, get a personalized weekly upskilling plan.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '100px',
            marginBottom: '24px'
          }}>
            <HelpCircle size={16} color="var(--primary-light)" />
            <span style={{ color: 'var(--primary-light)', fontSize: '14px', fontWeight: '500' }}>
              Got Questions?
            </span>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Find answers to common questions about AI Fluens assessments and upskilling.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              style={{
                background: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)', paddingRight: '16px' }}>
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  color="var(--text-muted)"
                  style={{
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    flexShrink: 0
                  }}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 24px 20px',
                      color: 'var(--text-secondary)',
                      fontSize: '15px',
                      lineHeight: '1.7'
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
