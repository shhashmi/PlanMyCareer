import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowLeft, Briefcase, MapPin, Target, Clock, Building, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
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
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, profileData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    role: '',
    company: '',
    country: '',
    goal: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await assessmentService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      experience: profileData?.experience || '',
      role: profileData?.role || '',
      company: profileData?.company || '',
      country: profileData?.country || '',
      goal: profileData?.goal || ''
    });
  }, [user, profileData]);

  if (!isLoggedIn) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      experience: profileData?.experience || '',
      role: profileData?.role || '',
      company: profileData?.company || '',
      country: profileData?.country || '',
      goal: profileData?.goal || ''
    });
    setIsEditing(false);
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
                  onChange={handleChange}
                  readOnly={!isEditing}
                  style={inputStyle(isEditing)}
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
                  Years of Experience
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
                  Role / Function
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
                  Company
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
                  Country
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
    </div>
  );
}
