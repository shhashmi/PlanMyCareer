import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, HelpCircle, DollarSign, User, Mail, Shield, ScrollText, RefreshCcw, Map } from 'lucide-react';

export default function Sitemap() {
  const sections = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', path: '/', icon: Home },
        { name: 'How It Works', path: '/how-it-works', icon: FileText },
        { name: 'FAQ', path: '/faq', icon: HelpCircle },
        { name: 'Pricing', path: '/pricing', icon: DollarSign }
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Login', path: '/login', icon: User },
        { name: 'Profile', path: '/profile', icon: User }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', icon: Shield },
        { name: 'Terms & Conditions', path: '/terms-of-use', icon: ScrollText },
        { name: 'Refund Policy', path: '/refund-policy', icon: RefreshCcw }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', path: '/contact-us', icon: Mail },
        { name: 'About Us', path: '/about-us', icon: HelpCircle }
      ]
    }
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '60px 24px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(20, 184, 166, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Map size={32} color="var(--primary-light)" />
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
            Sitemap
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Find your way around AI Fluens
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * sectionIndex }}
              style={{
                background: 'var(--surface)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border)'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-light)' }}>
                {section.title}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path} style={{ marginBottom: '12px' }}>
                      <Link
                        to={link.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '14px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <Icon size={16} />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
