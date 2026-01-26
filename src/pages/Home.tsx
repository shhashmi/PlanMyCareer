import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fluencyService } from '../services/fluencyService';
import ProfileForm from '../components/ProfileForm';
import type { ProfileFormData } from '../types/api.types';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, setProfileData, setSkills, setApiProfile } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  // Logged-in users without a profile are redirected here by App.tsx
  // After creating profile, logged-in users go to /assessment, others go to /skills

  const handleSubmit = async (formData: ProfileFormData) => {
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

        const profileDataToSave = {
          experience_years: formData.experience_years,
          role: formData.role,
          title: formData.title,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography || formData.country,
          goal: formData.goal
        };

        // If user is logged in, persist profile to backend
        if (isLoggedIn) {
          const createResponse = await fluencyService.createProfile(profileDataToSave);
          if (!createResponse.success) {
            console.error('Failed to save profile:', createResponse.error?.message);
            // Continue anyway - profile is in context
          }
        }

        // Store form data in context
        setProfileData(profileDataToSave);

        // Map API profile data to skills format
        const apiSkills = response.data.profile.map(skillDimension => ({
          name: skillDimension.name,
          level: skillDimension.proficiency.toLowerCase(),
          description: skillDimension.description
        }));

        setSkills(apiSkills);

        // Navigate to skills page for non-logged-in users, assessment for logged-in users
        navigate(isLoggedIn ? '/assessment' : '/skills');
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

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      <section style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(20, 184, 166, 0.15) 0%, transparent 50%)'
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
            background: 'rgba(20, 184, 166, 0.1)',
            borderRadius: '20px',
            marginBottom: '24px',
            border: '1px solid rgba(20, 184, 166, 0.3)'
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
        {apiError && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 24px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: 'var(--error)',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {apiError}
          </div>
        )}

        <ProfileForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Analyze My Skills"
        />
      </section>
    </div>
  );
}
