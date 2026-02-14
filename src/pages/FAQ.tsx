import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { GetStartedCTA } from '../components/GetStartedCTA';
import SEOHead from '../components/SEOHead';
import { faqs } from '../data/faqData';

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }), []);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <SEOHead structuredData={faqStructuredData} />
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
        <GetStartedCTA
          buttonText="Get Started Free"
          showArrow={false}
          delay={0.5}
          style={{
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
        </GetStartedCTA>
      </section>
    </div>
  );
}
