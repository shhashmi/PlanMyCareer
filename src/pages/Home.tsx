import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fluencyService } from '../services/fluencyService';
import ProfileForm from '../components/ProfileForm';
import type { ProfileFormData } from '../types/api.types';

export default function Home() {
  const navigate = useNavigate();
  const { setProfileData, setSkills, setApiProfile, user } = useApp();

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  // Check for profile and incomplete session on mount (if user is logged in)
  useEffect(() => {
    async function checkUserStatus() {
      if (!user) {
        // Not logged in, show normal home page
        setIsCheckingStatus(false);
        return;
      }

      try {
        // Check if user has a profile
        const profileResponse = await fluencyService.getProfile();

        if (!profileResponse.success || !profileResponse.data) {
          // No profile, redirect to /profile
          navigate('/profile');
          return;
        }

        // User has profile, check for incomplete assessment
        const incompleteResponse = await fluencyService.getIncompleteSession();

        if (incompleteResponse.success && incompleteResponse.data?.has_incomplete) {
          // Has incomplete session, redirect to assessment choice
          navigate('/assessment');
          return;
        }

        // User has profile and no incomplete session, show skills
        navigate('/skills');
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsCheckingStatus(false);
      }
    }

    checkUserStatus();
  }, [user, navigate]);

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

        // Store form data in context
        setProfileData({
          experience_years: formData.experience_years,
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
          description: skillDimension.description
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

  // Show loading while checking user status
  if (isCheckingStatus) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(20, 184, 166, 0.2)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Checking your profile...</p>
        </div>
      </div>
    );
  }

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
