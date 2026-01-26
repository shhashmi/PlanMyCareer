import { motion } from 'framer-motion';

export default function RefundPolicy() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
            Refund Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', textAlign: 'center', marginBottom: '48px' }}>
            Last updated: January 2026
          </p>

          <div style={{
            background: 'var(--surface)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border)'
          }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                1. Overview
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                At AI Fluens, we want you to be completely satisfied with your purchase. This Refund Policy outlines the terms under which refunds may be issued for our Advanced Assessment service.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                2. Eligibility for Refunds
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                You may be eligible for a refund under the following circumstances:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Technical issues that prevent you from completing the assessment</li>
                <li style={{ marginBottom: '8px' }}>Duplicate purchases made in error</li>
                <li style={{ marginBottom: '8px' }}>Service unavailability for an extended period</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                3. Refund Request Timeline
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Refund requests must be submitted within 14 days of your purchase date. Requests made after this period may not be eligible for a refund.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                4. Non-Refundable Situations
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                Refunds will not be issued in the following cases:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>You have completed the Advanced Assessment</li>
                <li style={{ marginBottom: '8px' }}>The request is made more than 14 days after purchase</li>
                <li style={{ marginBottom: '8px' }}>Dissatisfaction with assessment results or recommendations</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                5. How to Request a Refund
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                To request a refund, please contact our support team at{' '}
                <a href="mailto:support@aifluens.com" style={{ color: 'var(--primary-light)' }}>
                  support@aifluens.com
                </a>{' '}
                with your purchase details and reason for the refund request. We aim to respond to all refund requests within 3-5 business days.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                6. Refund Processing
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Approved refunds will be processed to your original payment method within 5-10 business days. Please note that your bank or credit card company may take additional time to reflect the refund in your account.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
