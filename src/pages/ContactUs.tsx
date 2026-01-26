import { motion } from 'framer-motion';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function ContactUs() {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Have questions? We're here to help.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {[
            {
              icon: Mail,
              title: 'Email Support',
              description: 'Get in touch with our team',
              action: 'support@aifluens.com',
              href: 'mailto:support@aifluens.com'
            },
            {
              icon: MessageCircle,
              title: 'General Inquiries',
              description: 'For partnerships and other inquiries',
              action: 'hello@aifluens.com',
              href: 'mailto:hello@aifluens.com'
            },
            {
              icon: HelpCircle,
              title: 'Help Center',
              description: 'Browse our FAQ for quick answers',
              action: 'View FAQ',
              href: '/faq'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                style={{
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                whileHover={{ borderColor: 'var(--primary)' }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={28} color="var(--primary-light)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                    {item.description}
                  </p>
                  <span style={{ color: 'var(--primary-light)', fontSize: '14px', fontWeight: '500' }}>
                    {item.action}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
