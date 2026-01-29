import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Briefcase, MapPin, Target, Clock, Building, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profileService, type CreateProfileRequest, type UserProfile } from '../services/profileService';
import { fluencyService } from '../services/fluencyService';
import { Modal, ErrorAlert, LoadingSpinner } from '../components/ui';

interface ProfileFormData {
  name: string;
  experience: string;
  role: string;
  company: string;
  country: string;
  goal: string;
  company_type: string;
  geography: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setProfileData, setSkills, roles, rolesLoading } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [serverProfile, setServerProfile] = useState<UserProfile | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    experience: '',
    role: '',
    company: '',
    country: '',
    goal: '',
    company_type: '',
    geography: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await profileService.getProfile();

        if (profileResponse.success && profileResponse.data) {
          setServerProfile(profileResponse.data);
          setFormData({
            name: profileResponse.data.name || user?.name || '',
            experience: String(profileResponse.data.experience_years || ''),
            role: profileResponse.data.role || '',
            company: profileResponse.data.company || '',
            country: profileResponse.data.country || '',
            goal: profileResponse.data.goal || '',
            company_type: profileResponse.data.company_type || '',
            geography: profileResponse.data.geography || ''
          });
        } else {
          setFormData(prev => ({
            ...prev,
            name: user?.name || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn, user]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveMessage(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveMessage(null);
  };

  const handleSaveClick = () => {
    if (!formData.role || !formData.company || !formData.country || !formData.experience) {
      setSaveMessage({ type: 'error', text: 'Please fill in required fields: Role, Company, Country, and Experience' });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setSaveMessage(null);

    try {
      const profileData: CreateProfileRequest = {
        role: formData.role,
        experience_years: parseInt(formData.experience) || 0,
        company: formData.company,
        country: formData.country,
        name: formData.name || undefined,
        company_type: formData.company_type || undefined,
        geography: formData.geography || undefined,
        goal: formData.goal || undefined
      };

      const response = await profileService.createProfile(profileData);

      if (response.success && response.data) {
        setServerProfile(response.data);
        const updatedProfileData = {
          experience: formData.experience,
          role: formData.role,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography,
          goal: formData.goal
        };
        setProfileData(updatedProfileData);

        // Regenerate skills based on updated profile
        const fluencyResult = await fluencyService.resolveProfile({
          experience_years: parseInt(formData.experience) || 0,
          role: formData.role,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography || formData.country,
          goal: formData.goal
        });

        if (fluencyResult.success && fluencyResult.data) {
          const updatedSkills = fluencyResult.data.profile.map(skillDimension => ({
            name: skillDimension.name,
            level: skillDimension.proficiency.toLowerCase(),
            description: skillDimension.description
          }));
          setSkills(updatedSkills);
        }

        setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
        setIsEditing(false);
      } else {
        setSaveMessage({ type: 'error', text: response.error?.message || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (serverProfile) {
      setFormData({
        name: serverProfile.name || user?.name || '',
        experience: String(serverProfile.experience_years || ''),
        role: serverProfile.role || '',
        company: serverProfile.company || '',
        country: serverProfile.country || '',
        goal: serverProfile.goal || '',
        company_type: serverProfile.company_type || '',
        geography: serverProfile.geography || ''
      });
    }
    setIsEditing(false);
    setSaveMessage(null);
  };

  const inputStyle = (editable: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    background: editable ? 'var(--surface)' : 'var(--surface-light)',
    border: `1px solid ${editable ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    cursor: editable ? 'text' : 'default'
  });

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    display: 'block'
  };

  if (fetchingProfile) {
    return <LoadingSpinner fullPage message="Loading profile..." />;
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

            {!isEditing ? (
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
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCancel}
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
                <button
                  onClick={handleSaveClick}
                  disabled={loading}
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
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {saveMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${saveMessage.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '12px',
              color: saveMessage.type === 'success' ? '#10b981' : '#ef4444',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              {saveMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {saveMessage.text}
            </div>
          )}

          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: 'clamp(20px, 5vw, 40px)',
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
                {formData.name || 'User'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {formData.role || 'Member'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>
                  <User size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Years of Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Role / Function *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  disabled={!isEditing || rolesLoading}
                  style={{
                    ...inputStyle(isEditing),
                    cursor: isEditing ? 'pointer' : 'default',
                    appearance: isEditing ? 'auto' : 'none'
                  }}
                >
                  <option value="">{rolesLoading ? 'Loading roles...' : 'Select role'}</option>
                  {roles.map(role => (
                    <option key={role.role_id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  <Building size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="Country"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>
                  <Target size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Career Goal (Optional)
                </label>
                <textarea
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={{
                    ...inputStyle(isEditing),
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="What are your career aspirations?"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        maxWidth="480px"
        showCloseButton={false}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(251, 191, 36, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={22} color="#d97706" />
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Confirm Profile Update
          </h3>
        </div>

        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0
          }}>
            Your assessment history is linked to your current profile. Updating your profile will
            <strong style={{ color: '#d97706' }}> reset your assessment progress</strong>.
            However, your <strong style={{ color: 'var(--text-primary)' }}>learning plan will remain intact</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowConfirmModal(false)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              background: 'var(--gradient-1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Yes, Update Profile
          </button>
        </div>
      </Modal>
    </div>
  );
}
