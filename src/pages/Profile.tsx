import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowLeft, Briefcase, MapPin, Target, Clock, Building, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { profileService, type CreateProfileRequest, type UserProfile } from '../services/profileService';
import type { Role } from '../types/api.types';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  role: string;
  company: string;
  country: string;
  goal: string;
  title: string;
  company_type: string;
  geography: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, setProfileData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [serverProfile, setServerProfile] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    role: '',
    company: '',
    country: '',
    goal: '',
    title: '',
    company_type: '',
    geography: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, profileResponse] = await Promise.all([
          assessmentService.getRoles(),
          profileService.getProfile()
        ]);

        if (rolesResponse.success && rolesResponse.data) {
          setRoles(rolesResponse.data);
        }

        if (profileResponse.success && profileResponse.data) {
          setServerProfile(profileResponse.data);
          setFormData({
            name: profileResponse.data.name || user?.name || '',
            email: user?.email || '',
            phone: '',
            experience: String(profileResponse.data.experience_years || ''),
            role: profileResponse.data.role || '',
            company: profileResponse.data.company || '',
            country: profileResponse.data.country || '',
            goal: profileResponse.data.goal || '',
            title: profileResponse.data.title || '',
            company_type: profileResponse.data.company_type || '',
            geography: profileResponse.data.geography || ''
          });
        } else {
          setFormData(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setFetchingProfile(false);
        setRolesLoading(false);
      }
    };
    
    if (isLoggedIn) {
      fetchData();
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

  const handleSave = async () => {
    if (!formData.role || !formData.company || !formData.country || !formData.experience) {
      setSaveMessage({ type: 'error', text: 'Please fill in required fields: Role, Company, Country, and Experience' });
      return;
    }

    setLoading(true);
    setSaveMessage(null);

    try {
      const profileData: CreateProfileRequest = {
        role: formData.role,
        experience_years: parseInt(formData.experience) || 0,
        company: formData.company,
        country: formData.country,
        name: formData.name || undefined,
        title: formData.title || undefined,
        company_type: formData.company_type || undefined,
        geography: formData.geography || undefined,
        goal: formData.goal || undefined
      };

      const response = await profileService.createProfile(profileData);

      if (response.success && response.data) {
        setServerProfile(response.data);
        setProfileData({
          experience: formData.experience,
          role: formData.role,
          title: formData.title,
          company: formData.company,
          country: formData.country,
          company_type: formData.company_type,
          geography: formData.geography,
          goal: formData.goal
        });
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
        email: user?.email || '',
        phone: '',
        experience: String(serverProfile.experience_years || ''),
        role: serverProfile.role || '',
        company: serverProfile.company || '',
        country: serverProfile.country || '',
        goal: serverProfile.goal || '',
        title: serverProfile.title || '',
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
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
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
                  onClick={handleSave}
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
                {formData.name || 'User'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {formData.role || 'Member'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                  <Mail size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  style={inputStyle(false)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Phone size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="+1 234 567 890"
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

              <div>
                <label style={labelStyle}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: '6px' }} />
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
                  placeholder="e.g., Senior Developer"
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
    </div>
  );
}
