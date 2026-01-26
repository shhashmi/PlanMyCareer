import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Edit2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fluencyService } from '../services/fluencyService';
import ProfileForm from '../components/ProfileForm';
import ConfirmationModal from '../components/ConfirmationModal';
import type { ProfileFormData } from '../types/api.types';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setProfileData, setSkills, setApiProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [apiError, setApiError] = useState<string>('');

  const [profile, setProfile] = useState<Partial<ProfileFormData> | null>(null);

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ProfileFormData | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await fluencyService.getProfile();
        if (response.success && response.data) {
          const profileData = response.data;
          const mappedProfile: Partial<ProfileFormData> = {
            experience_years: profileData.experience_years?.toString() || '',
            role: profileData.role || '',
            title: profileData.title || '',
            company: profileData.company || '',
            country: profileData.country || '',
            company_type: profileData.company_type || 'Enterprise',
            geography: profileData.geography || profileData.country || '',
            goal: profileData.goal || ''
          };
          setProfile(mappedProfile);

          // Also update context if needed
          setProfileData(mappedProfile as ProfileFormData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn, setProfileData]);

  const handleSave = async (formData: ProfileFormData) => {
    setLoading(true);
    setApiError('');
    try {
      // If this is an update (profile exists), show modern modal
      if (profile) {
        setPendingFormData(formData);
        setShowConfirmModal(true);
        setLoading(false);
        return;
      }

      // Proceed with profile creation if no existing profile
      await proceedWithUpdate(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
      setApiError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const proceedWithUpdate = async (formData: ProfileFormData) => {
    setLoading(true);
    try {
      const response = await fluencyService.createProfile(formData);
      if (response.success) {
        setProfile(formData);
        setProfileData(formData);
        setIsEditing(false);

        // After saving, also analyze skills to get full context
        const analyzeResponse = await fluencyService.resolveProfile(fluencyService.mapFormDataToRequest(formData));
        if (analyzeResponse.success && analyzeResponse.data) {
          setApiProfile(analyzeResponse.data);
          const apiSkills = analyzeResponse.data.profile.map(skillDimension => ({
            name: skillDimension.name,
            level: skillDimension.proficiency.toLowerCase(),
            description: skillDimension.description
          }));
          setSkills(apiSkills);

          // Redirect to skills after successful save/update
          navigate('/skills');
        }
      } else {
        setApiError(response.error?.message || 'Failed to save profile');
      }
    } catch (error) {
      setApiError('An unexpected error occurred during update');
    } finally {
      setLoading(false);
    }
  };

  const confirmResetAndUpdate = async () => {
    if (!pendingFormData) return;

    setIsResetting(true);
    try {
      // 1. Check for and mark the session as complete/inactive if exists
      const sessionResponse = await fluencyService.getIncompleteSession();
      if (sessionResponse.success && sessionResponse.data?.has_incomplete) {
        const resetResponse = await fluencyService.resetSession(sessionResponse.data.session.session_id);

        if (!resetResponse.success) {
          setApiError(resetResponse.error?.message || 'Failed to deactivate current session');
          setIsResetting(false);
          setShowConfirmModal(false);
          return;
        }
      }

      // 2. Close modal and proceed with update
      setShowConfirmModal(false);
      await proceedWithUpdate(pendingFormData);
    } catch (error) {
      setApiError('Failed to process update confirmation');
    } finally {
      setIsResetting(false);
      setPendingFormData(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to login...</p>
      </div>
    );
  }

  if (profileLoading) {
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'var(--gradient-1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          {!isEditing && profile ? (
            <div
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--gradient-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <User size={36} color="white" />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                  {user?.name || 'User'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {profile.role || 'Professional'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={infoBlockStyle}>
                  <p style={infoLabelStyle}>Experience</p>
                  <p style={infoValueStyle}>{profile.experience_years} Years</p>
                </div>
                <div style={infoBlockStyle}>
                  <p style={infoLabelStyle}>Company</p>
                  <p style={infoValueStyle}>{profile.company}</p>
                </div>
                <div style={infoBlockStyle}>
                  <p style={infoLabelStyle}>Location</p>
                  <p style={infoValueStyle}>{profile.country}</p>
                </div>
                <div style={infoBlockStyle}>
                  <p style={infoLabelStyle}>Goal</p>
                  <p style={infoValueStyle}>{profile.goal || 'No goal set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                initialData={profile || {}}
                onSubmit={handleSave}
                isLoading={loading}
                submitButtonText={profile ? "Update Profile" : "Create Profile"}
                showTitle={!profile}
              />
            </>
          )}
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmResetAndUpdate}
        title="Update Profile?"
        message="Your assessment data is linked to your current profile and will be lost upon update. Your weekly plan will remain intact."
        confirmText="Update Anyway"
        isLoading={isResetting}
      />
    </div>
  );
}

const infoBlockStyle = {
  padding: '16px',
  background: 'rgba(20, 184, 166, 0.05)',
  borderRadius: '12px',
  border: '1px solid var(--border)'
};

const infoLabelStyle = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: '4px'
};

const infoValueStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--text-primary)'
};
