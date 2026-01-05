import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Briefcase, MapPin, Target, Clock, Building, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fluencyService } from '../services/fluencyService';
import type { ProfileFormData } from '../types/api.types';

const roles = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing Manager', 'Designer', 'HR Manager', 'Other'];
const companyTypes = ['Startup', 'Scale-up', 'Enterprise', 'Government', 'Non-profit', 'Freelance'];

export default function Home() {
  const navigate = useNavigate();
  const { setProfileData, setSkills, setApiProfile } = useApp();

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
    if (!formData.title) newErrors.title = 'Job title is required';
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.company_type) newErrors.company_type = 'Company type is required';
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
      // Map form data to API request format
      const requestData = fluencyService.mapFormDataToRequest(formData);

      // Call the API
      const response = await fluencyService.resolveProfile(requestData);

      if (response.success && response.data) {
        // Store the API profile response in context
        setApiProfile(response.data);

        // Store form data in context
        setProfileData({
          experience: formData.experience,
          role: formData.role,
          title: formData.title,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography || formData.country,
          goal: formData.goal
        });

        // Map API profile data to skills format
        const apiSkills = response.data.profile.map(skillDimension => ({
          name: skillDimension.name,
          level: skillDimension.proficiency.toLowerCase(),
          description: `${skillDimension.dimension}: ${skillDimension.proficiency} level proficiency required`
        }));

        setSkills(apiSkills);

        // Navigate to skills page
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
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 50%)'
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
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Sparkles size={16} color="var(--primary-light)" />
            <span style={{ fontSize: '14px', color: 'var(--primary-light)' }}>AI-Powered Skill Analysis</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            Discover Your AI Skill Gaps<br />
            <span style={{
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Build Your Future</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Get a personalized analysis of AI skills you need for your role,
            assess your current level, and get a tailored upskilling plan.
          </p>
        </motion.div>
      </section>

      <section className="container" style={{ paddingBottom: '60px' }}>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'var(--surface)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid var(--border)'
          }}
        >
          <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '600' }}>
            Tell us about yourself
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            We'll analyze the AI skills most relevant to your career
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                    disabled={isLoading}
                  >
                    <option value="">Select role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {errors.role && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.role}</span>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Job Title *</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? 'var(--error)' : 'var(--border)'
                  }}
                  disabled={isLoading}
                />
              </div>
              {errors.title && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.title}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Company Type *</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      borderColor: errors.company_type ? 'var(--error)' : 'var(--border)'
                    }}
                    disabled={isLoading}
                  >
                    <option value="">Select type</option>
                    {companyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {errors.company_type && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.company_type}</span>}
              </div>

              <div>
                <label style={labelStyle}>
                  Geography <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="geography"
                    placeholder="e.g., Asia Pacific"
                    value={formData.geography}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={isLoading}
                  />
                </div>
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
    </div>
  );
}
