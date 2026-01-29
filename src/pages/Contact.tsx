import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { emailService } from '../services/emailService';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      // Map subject value to readable text
      const subjectLabels: Record<string, string> = {
        general: 'General Inquiry',
        support: 'Technical Support',
        feedback: 'Feedback & Suggestions',
        partnership: 'Partnership Inquiry',
        other: 'Other'
      };

      const subjectText = subjectLabels[formData.subject] || formData.subject;

      const response = await emailService.sendEmail({
        to: 'support@aifluens.com',
        subject: `[${subjectText}] Contact from ${formData.name}`,
        text: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${subjectText}\n\nMessage:\n${formData.message}`
      });

      if (response.success) {
        setIsSubmitted(true);
      } else {
        setApiError(response.error?.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    paddingLeft: '44px',
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  };

  if (isSubmitted) {
    return (
      <main style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            maxWidth: '500px',
            margin: '40px 24px'
          }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(20, 184, 166, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle size={36} color="var(--primary-light)" />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: '600' }}>
            Message Sent!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            Thank you for reaching out. We'll get back to you as soon as possible.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(20, 184, 166, 0.15) 0%, transparent 50%)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            Contact Us
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Direct Email Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
              background: 'rgba(20, 184, 166, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              marginBottom: '32px'
            }}
          >
            <Mail size={20} color="var(--primary-light)" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Or email us directly at{' '}
              <a
                href="mailto:support@aifluens.com"
                style={{
                  color: 'var(--primary-light)',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                support@aifluens.com
              </a>
            </span>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: 'clamp(20px, 5vw, 40px)',
              border: '1px solid var(--border)'
            }}
          >
            <h2 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: '600' }}>
              Write to Us
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
              Fill out the form below and we'll get back to you shortly.
            </p>

            {apiError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: 'var(--error)',
                marginBottom: '24px',
                fontSize: '14px'
              }}>
                <AlertCircle size={18} />
                {apiError}
              </div>
            )}

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Name & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        ...inputStyle,
                        borderColor: errors.name ? 'var(--error)' : 'var(--border)'
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.name}</span>}
                </div>

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        ...inputStyle,
                        borderColor: errors.email ? 'var(--error)' : 'var(--border)'
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={labelStyle}>Subject *</label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      borderColor: errors.subject ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.subject && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.subject}</span>}
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message *</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    style={{
                      ...inputStyle,
                      paddingLeft: '16px',
                      resize: 'vertical',
                      minHeight: '120px',
                      borderColor: errors.message ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  {errors.message ? (
                    <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.message}</span>
                  ) : (
                    <span />
                  )}
                  <span style={{
                    fontSize: '12px',
                    color: formData.message.length >= 450 ? 'var(--error)' : 'var(--text-muted)'
                  }}>
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send size={18} />}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
