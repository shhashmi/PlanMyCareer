import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Target, Clock, Building, ArrowRight, Loader2 } from 'lucide-react';
import { assessmentService } from '../services/assessmentService';
import type { ProfileFormData, Role } from '../types/api.types';

interface ProfileFormProps {
    initialData?: Partial<ProfileFormData>;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isLoading: boolean;
    submitButtonText?: string;
    showTitle?: boolean;
}

export default function ProfileForm({
    initialData,
    onSubmit,
    isLoading,
    submitButtonText = 'Save Profile',
    showTitle = true
}: ProfileFormProps) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [formData, setFormData] = useState<ProfileFormData>({
        experience_years: '',
        role: '',
        title: '',
        company: '',
        country: '',
        company_type: 'Enterprise',
        geography: '',
        goal: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                title: initialData.role || prev.role, // Default title to role if not provided
                geography: initialData.country || prev.country // Default geography to country if not provided
            }));
        }
    }, [initialData]);

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await assessmentService.getRoles();
            if (response.success && response.data) {
                setRoles(response.data);
            }
            setRolesLoading(false);
        };
        fetchRoles();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Sync title with role if role changes
            if (name === 'role') newData.title = value;
            // Sync geography with country if country changes
            if (name === 'country') newData.geography = value;
            return newData;
        });

        if (errors[name as keyof ProfileFormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};
        if (!formData.experience_years) newErrors.experience_years = 'Experience is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.company) newErrors.company = 'Company is required';
        if (!formData.country) newErrors.country = 'Country is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
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
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            style={{
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid var(--border)'
            }}
        >
            {showTitle && (
                <>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '600' }}>
                        Tell us about yourself
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                        We'll analyze the AI skills most relevant to your career
                    </p>
                </>
            )}

            <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Years of Experience *</label>
                        <div style={{ position: 'relative' }}>
                            <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="number"
                                name="experience_years"
                                placeholder="e.g., 5"
                                value={formData.experience_years}
                                onChange={handleChange}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.experience_years ? 'var(--error)' : 'var(--border)'
                                }}
                                min="0"
                                max="50"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.experience_years && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.experience_years}</span>}
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
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            {submitButtonText}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </motion.form>
    );
}
