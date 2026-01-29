import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Target, Clock, Building, Zap, Lightbulb, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fluencyService } from '../services/fluencyService';
import { profileService, type CreateProfileRequest } from '../services/profileService';
import type { ProfileFormData } from '../types/api.types';

const values = [
  {
    icon: Target,
    title: 'Hyper-Personalized',
    description: 'Learning paths built around your role, your goals, and your reality.',
    color: '#14b8a6'
  },
  {
    icon: Clock,
    title: 'Time-Conscious',
    description: 'Designed for busy professionals. Learn what matters, skip what doesn\'t.',
    color: '#6366f1'
  },
  {
    icon: TrendingUp,
    title: 'Always Current',
    description: 'AI evolves fast. Our assessments and recommendations evolve with it.',
    color: '#f59e0b'
  },
  {
    icon: Users,
    title: 'For Every Role',
    description: 'From marketers to engineers, we tailor AI skills to your function.',
    color: '#ec4899'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, setProfileData, setSkills, setApiProfile, roles, rolesLoading } = useApp();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    experience: '',
    role: '',
    title: '',
    company: '',
    country: '',
    company_type: '',
    geography: '',
    goal: ''
  });

  formData.title = formData.role;
  formData.company_type = 'Enterprise';
  formData.geography = formData.country;

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const requestData = fluencyService.mapFormDataToRequest(formData);
      const response = await fluencyService.resolveProfile(requestData);

      if (response.success && response.data) {
        setApiProfile(response.data);

        if (isLoggedIn) {
          const profileData: CreateProfileRequest = {
            role: formData.role,
            experience_years: parseInt(formData.experience) || 0,
            company: formData.company,
            country: formData.country,
            company_type: formData.company_type || undefined,
            geography: formData.geography || formData.country,
            goal: formData.goal || undefined
          };
          await profileService.createProfile(profileData);
        }

        setProfileData({
          experience: formData.experience,
          role: formData.role,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography || formData.country,
          goal: formData.goal
        });

        const apiSkills = response.data.profile.map(skillDimension => ({
          name: skillDimension.name,
          level: skillDimension.proficiency.toLowerCase(),
          description: skillDimension.description,
          priority: skillDimension.priority
        }));

        setSkills(apiSkills);
        navigate('/skills');
      } else {
        setApiError(response.error?.message || 'Failed to analyze your profile. Please try again.');
      }
    } catch (error) {
      console.error('Error calling fluency API:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: '700',
            lineHeight: '1.15',
            marginBottom: '24px'
          }}>
            The World Isn't Waiting
            <br />
            <span style={{
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>And Neither Should You</span>
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            AI is raising the bar while shrinking your time to clear it.
            <br />
            We help you leap smarter, not longer.
          </p>

          <button
            onClick={scrollToForm}
            className="btn-primary"
            style={{ padding: '16px 40px', fontSize: '17px' }}
          >
            Start Free Assessment <ArrowRight size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ marginTop: '60px' }}
          >
            <ChevronDown
              size={32}
              color="var(--text-muted)"
              style={{
                animation: 'bounce 2s infinite',
                cursor: 'pointer'
              }}
              onClick={scrollToForm}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* The Paradox Section */}
      <section className="container" style={{ padding: '60px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap size={28} color="#f59e0b" />
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
              The AI Paradox
            </h2>
          </div>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '16px'
          }}>
            AI is evolving at an unprecedented pace, fundamentally reshaping how work gets done. But here's the paradox: <strong style={{ color: 'var(--text-primary)' }}>the very productivity AI enables is leaving professionals with less time to learn the skills they need to stay relevant.</strong>
          </p>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            margin: 0
          }}>
            You're expected to deliver more. Move faster. Do it with AI. Yet carving out hours for courses and certifications? That's a luxury most can't afford.
          </p>
        </motion.div>
      </section>

      {/* The Solution Section */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(20, 184, 166, 0.3)'
          }}>
            <Lightbulb size={16} color="var(--primary-light)" />
            <span style={{ fontSize: '14px', color: 'var(--primary-light)' }}>Our Solution</span>
          </div>

          <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: '600' }}>
            AI Fluens Breaks This Cycle
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '16px'
          }}>
            We assess exactly where you stand, identify the AI skills that matter most for <em>your</em> career, and build a focused, actionable plan that respects the reality of your schedule.
          </p>
          <p style={{
            fontSize: '22px',
            fontWeight: '600',
            background: 'var(--gradient-1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '32px 0 0'
          }}>
            Learn what matters. Skip what doesn't. Get ahead — on your terms.
          </p>
        </motion.div>
      </section>

      {/* What Sets Us Apart */}
      <section className="container" style={{ padding: '40px 24px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  padding: '24px',
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${value.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <value.icon size={24} color={value.color} />
                </div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Profile Form Section */}
      <section
        className="container"
        style={{
          padding: 'clamp(30px, 6vw, 60px) 24px clamp(40px, 8vw, 80px)',
          background: 'radial-gradient(ellipse at bottom, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
        }}
      >
        <motion.form
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'var(--surface)',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 40px)',
            border: '1px solid var(--border)'
          }}
        >
          <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '600', textAlign: 'center' }}>
            Start Your Free Assessment
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
            Tell us about yourself and we'll analyze the AI skills most relevant to your career
          </p>

          {apiError && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: 'var(--error)',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {apiError}
            </div>
          )}

          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Years of Experience *</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    name="experience"
                    placeholder="e.g., 5"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      borderColor: errors.experience ? 'var(--error)' : 'var(--border)'
                    }}
                    min="0"
                    max="50"
                    disabled={isLoading}
                  />
                </div>
                {errors.experience && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.experience}</span>}
              </div>

              <div>
                <label style={labelStyle}>Role/Function *</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      borderColor: errors.role ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isLoading || rolesLoading}
                  >
                    <option value="">{rolesLoading ? 'Loading roles...' : 'Select role'}</option>
                    {roles.map(role => (
                      <option key={role.role_id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                {errors.role && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.role}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Company *</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g., Google"
                    value={formData.company}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      borderColor: errors.company ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isLoading}
                  />
                </div>
                {errors.company && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.company}</span>}
              </div>

              <div>
                <label style={labelStyle}>Country *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="country"
                    placeholder="e.g., United States"
                    value={formData.country}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      borderColor: errors.country ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isLoading}
                  />
                </div>
                {errors.country && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.country}</span>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Career Goal <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Target size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-muted)' }} />
                <textarea
                  name="goal"
                  placeholder="e.g., Become an AI/ML engineer within 2 years..."
                  value={formData.goal}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    ...inputStyle,
                    paddingTop: '14px',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Skills'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </div>
        </motion.form>
      </section>

      {/* CSS for bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
