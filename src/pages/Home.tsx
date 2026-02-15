import { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Target, Clock, Building, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import { fluencyService } from '../services/fluencyService';
import { profileService, type CreateProfileRequest } from '../services/profileService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import { trackEvent } from '../lib/analytics';
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

const trustSignals = [
  { label: '3-Min Setup', icon: Clock },
  { label: 'Instant Results', icon: Sparkles },
  { label: 'Personalized Plan', icon: Target }
];

export default function Home() {
  const navigate = useNavigateWithParams();
  const { isLoggedIn, loading, setProfileData, setSkills, setApiProfile, roles, rolesLoading } = useApp();
  const { smartNavigate, isNavigating } = useSmartNavigation();
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

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (!loading && isLoggedIn) {
      smartNavigate();
    }
  }, [loading, isLoggedIn, smartNavigate]);

  if (loading || (isLoggedIn && isNavigating)) {
    return <LoadingSpinner fullPage message="Loading..." />;
  }

  formData.title = formData.role;
  formData.company_type = 'Enterprise';
  formData.geography = formData.country;

  const scrollToForm = () => {
    trackEvent('cta_click', 'engagement', 'hero_start_assessment');
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
    padding: '12px 14px',
    paddingLeft: '40px',
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '500' as const,
    color: 'var(--text-secondary)'
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <SEOHead />

      {/* Hero Section — Split Layout */}
      <section className="home-hero" style={{
        padding: '60px 24px 40px',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="home-hero-grid" style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column — Messaging */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Beta Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 14px',
              background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
              borderRadius: '20px',
              marginBottom: '24px'
            }}>
              <Sparkles size={14} color="white" />
              <span style={{
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.3px'
              }}>
                Free During Beta
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: '700',
              lineHeight: '1.15',
              marginBottom: '20px'
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
              fontSize: '18px',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '28px',
              maxWidth: '500px'
            }}>
              Get a personalized AI skills assessment and actionable learning plan tailored to your role and career goals.
            </p>

            {/* Trust Signals */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {trustSignals.map((signal) => (
                <div
                  key={signal.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'var(--surface)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}
                >
                  <signal.icon size={14} color="var(--primary-light)" />
                  {signal.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 32px)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '6px', fontWeight: '600' }}>
                Start Your Free Assessment
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
                Tell us about yourself and we'll analyze the AI skills most relevant to your career
              </p>

              {apiError && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--error)',
                  marginBottom: '20px',
                  fontSize: '13px'
                }}>
                  {apiError}
                </div>
              )}

              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="home-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Experience *</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="number"
                        name="experience"
                        placeholder="Years"
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
                    {errors.experience && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.experience}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Role *</label>
                    <div style={{ position: 'relative' }}>
                      <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                        <option value="">{rolesLoading ? 'Loading...' : 'Select role'}</option>
                        {roles.map(role => {
                          const isAvailable = role.name.toLowerCase().includes('engineering manager');
                          return (
                            <option key={role.role_id} value={isAvailable ? role.name : ''} disabled={!isAvailable}>
                              {isAvailable ? role.name : `${role.name} — Coming Soon`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {errors.role && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.role}</span>}
                  </div>
                </div>

                <div className="home-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Company *</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                    {errors.company && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.company}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Country *</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
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
                    {errors.country && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.country}</span>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Career Goal <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Target size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                    <textarea
                      name="goal"
                      placeholder="e.g., Become an AI/ML engineer within 2 years..."
                      value={formData.goal}
                      onChange={handleChange}
                      rows={2}
                      style={{
                        ...inputStyle,
                        paddingTop: '12px',
                        resize: 'vertical',
                        minHeight: '60px'
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
            </form>
          </motion.div>
        </div>
      </section>

      {/* Value Props + Condensed Message */}
      <section className="container" style={{ padding: '40px 24px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          <div className="home-value-grid" style={{
            display: 'grid',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  padding: '16px',
                  background: 'var(--surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${value.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <value.icon size={20} color={value.color} />
                </div>
                <h3 style={{ fontSize: '14px', marginBottom: '6px', fontWeight: '600' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Condensed Problem/Solution */}
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '20px'
            }}>
              AI is reshaping every role, but most professionals don't have time to figure out what to learn.
              We assess exactly where you stand and build a focused plan that respects your schedule.
            </p>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '28px'
            }}>
              Learn what matters. Skip what doesn't. Get ahead — on your terms.
            </p>
            <button
              onClick={scrollToForm}
              className="btn-primary"
              style={{ padding: '14px 36px', fontSize: '16px' }}
            >
              Start Free Assessment <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .home-hero-grid {
          grid-template-columns: 55fr 45fr;
        }
        .home-value-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 900px) {
          .home-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .home-hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .home-hero {
            min-height: auto !important;
            padding-top: 40px !important;
            padding-bottom: 24px !important;
          }
        }
        @media (max-width: 700px) {
          .home-value-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .home-form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
