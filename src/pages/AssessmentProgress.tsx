import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, RotateCcw, CheckCircle, Clock, Target, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import type { Dimension } from '../types/api.types';

export default function AssessmentProgress() {
  const navigate = useNavigate();
  const { isLoggedIn, incompleteAssessment, setIncompleteAssessment, apiProfile } = useApp();
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!incompleteAssessment) {
      navigate('/skills');
      return;
    }

    const fetchDimensions = async () => {
      const response = await assessmentService.getDimensions();
      if (response.success && response.data) {
        setDimensions(response.data);
      }
    };
    fetchDimensions();
  }, [isLoggedIn, incompleteAssessment, navigate]);

  if (!incompleteAssessment) {
    return null;
  }

  const getDimensionName = (code: string) => {
    const dim = dimensions.find(d => d.dimension_code === code);
    return dim?.name || code;
  };

  const getUniqueDimensions = () => {
    const dimensionCodes = new Set<string>();
    incompleteAssessment.questions.forEach(q => {
      dimensionCodes.add(q.dimension);
    });
    return Array.from(dimensionCodes);
  };

  const handleResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.resumeAssessment();
      if (response.success && response.data) {
        setIncompleteAssessment(response.data);
        navigate('/basic-assessment', { state: { resumeData: response.data } });
      } else {
        setError(response.error?.message || 'Failed to resume assessment. Please try again.');
      }
    } catch (err) {
      console.error('Failed to resume assessment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!apiProfile) {
      setError('Profile data not found. Please go back and try again.');
      return;
    }

    setResetLoading(true);
    setError(null);
    try {
      const startRequest = await assessmentService.buildStartRequest(apiProfile, 'basic', 15);
      const response = await assessmentService.startAssessment(startRequest);
      
      if (response.success && response.data) {
        setIncompleteAssessment(null);
        navigate('/basic-assessment', { state: { sessionData: response.data } });
      } else {
        setError(response.error?.message || 'Failed to start new assessment. Please try again.');
      }
    } catch (err) {
      console.error('Failed to reset assessment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const progress = Math.round((incompleteAssessment.answered_count / incompleteAssessment.total_questions) * 100);
  const uniqueDimensions = getUniqueDimensions();

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '600px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'rgba(20, 184, 166, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Clock size={40} color="var(--primary-light)" />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
            Assessment In Progress
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
            You have an unfinished assessment. Pick up where you left off or start fresh.
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Progress</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
              {incompleteAssessment.answered_count} / {incompleteAssessment.total_questions} questions
            </span>
          </div>
          
          <div style={{
            height: '8px',
            background: 'var(--surface-light)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                background: 'var(--gradient-1)',
                borderRadius: '4px'
              }}
            />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'right' }}>
            {progress}% complete
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Skills Being Assessed</h3>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {uniqueDimensions.map(code => (
              <div
                key={code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(20, 184, 166, 0.2)'
                }}
              >
                <CheckCircle size={14} color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {getDimensionName(code)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={handleReset}
            disabled={resetLoading}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: resetLoading ? 0.7 : 1
            }}
          >
            <RotateCcw size={18} />
            {resetLoading ? 'Resetting...' : 'Reset Assessment'}
          </button>
          
          <button
            onClick={handleResume}
            disabled={loading}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'var(--gradient-1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            <PlayCircle size={18} />
            {loading ? 'Resuming...' : 'Resume Assessment'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
