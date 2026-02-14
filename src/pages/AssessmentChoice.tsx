import { useState, useCallback } from 'react';
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComingSoonModal, ErrorAlert, Modal } from '../components/ui';
import { AdvancedAssessmentTile, FluencySelector } from '../components/assessment';
import { splitSkillsByPriority } from '../utils/profileUtils';
import SEOHead from '../components/SEOHead';

export default function AssessmentChoice() {
  const navigate = useNavigateWithParams()
  const { isLoggedIn, loading, apiProfile, isPaid, refreshPaidStatus } = useApp()
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null)
  const [showMultiFluencyWarning, setShowMultiFluencyWarning] = useState(false)

  const MAX_SELECTIONS = 3;

  // Initialize selected skill codes with top priority skills
  const [selectedSkillCodes, setSelectedSkillCodes] = useState<Set<string>>(() => {
    if (!apiProfile?.profile) return new Set();
    const sorted = splitSkillsByPriority(apiProfile.profile, MAX_SELECTIONS);
    return new Set([sorted.priority[0]?.code].filter(Boolean));
  });

  const handleFluencyChange = useCallback((codes: Set<string>) => {
    setSelectionWarning(null);
    if (codes.size > MAX_SELECTIONS) {
      setSelectionWarning(`Maximum ${MAX_SELECTIONS} fluencies can be selected. Uncheck one to select another.`);
      return;
    }
    setSelectedSkillCodes(codes);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Loading...</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    navigate('/login')
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Redirecting...</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    )
  }

  const handleAdvancedFlow = async () => {
    await refreshPaidStatus();
    if (isPaid) {
      navigate('/advanced-assessment', {
        state: { selectedSkillCodes: Array.from(selectedSkillCodes) }
      });
    } else {
      setShowComingSoon(true);
    }
  };

  const handleStartAdvancedClick = async () => {
    if (selectedSkillCodes.size > 1) {
      setShowMultiFluencyWarning(true);
      return;
    }
    await handleAdvancedFlow();
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <SEOHead />
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>
            Start Your Assessment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            Select how you'd like to assess your AI skills
          </p>
        </motion.div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Selection Warning */}
        {selectionWarning && (
          <ErrorAlert
            message={selectionWarning}
            variant="warning"
            onDismiss={() => setSelectionWarning(null)}
          />
        )}

        {/* Skill Selection */}
        {apiProfile?.profile && apiProfile.profile.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <FluencySelector
              skills={apiProfile.profile}
              selectedCodes={selectedSkillCodes}
              onSelectionChange={handleFluencyChange}
              maxSelections={MAX_SELECTIONS}
            />
          </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AdvancedAssessmentTile
            onClick={handleStartAdvancedClick}
            animationDelay={0.2}
            animationDirection="right"
            showPaymentTier={!isPaid}
            style={{ maxWidth: '480px', width: '100%' }}
          />
        </div>
      </div>

      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />

      <Modal
        isOpen={showMultiFluencyWarning}
        onClose={() => setShowMultiFluencyWarning(false)}
        title="Assess Multiple Fluencies?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Assessing fewer fluencies leads to more focused learning and a shorter assessment. You can always assess remaining fluencies later.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '10px',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            <Clock size={16} color="var(--accent)" />
            {selectedSkillCodes.size} fluencies &times; 12 min = ~{selectedSkillCodes.size * 12} min
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => setShowMultiFluencyWarning(false)}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Reduce Fluencies
            </button>
            <button
              onClick={() => {
                setShowMultiFluencyWarning(false);
                handleAdvancedFlow();
              }}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Continue with {selectedSkillCodes.size} Fluencies
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
