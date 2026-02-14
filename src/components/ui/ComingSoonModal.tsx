import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import api from '../../services/api';

export interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RequestState = 'idle' | 'submitting' | 'success';

/**
 * Invitation-only access modal for non-paid users.
 * Allows requesting preview access via POST /api/v1/preview-access.
 */
export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const [requestState, setRequestState] = useState<RequestState>('idle');

  const handleRequestInvitation = async () => {
    setRequestState('submitting');
    try {
      await api.post('/v1/preview-access');
      setRequestState('success');
      setTimeout(() => {
        setRequestState('idle');
        onClose();
      }, 1000);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // Already requested — treat as success
        setRequestState('success');
        setTimeout(() => {
          setRequestState('idle');
          onClose();
        }, 1000);
      } else {
        setRequestState('idle');
      }
    }
  };

  const handleClose = () => {
    if (requestState === 'submitting') return;
    setRequestState('idle');
    onClose();
  };

  if (requestState === 'success') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        showCloseButton={false}
        maxWidth="400px"
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(20, 184, 166, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <Sparkles size={28} color="var(--primary-light)" />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Your request is in review, you will hear back soon through an email
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      maxWidth="480px"
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--gradient-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Sparkles size={32} color="white" />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
          Invitation Only Access
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
          This functionality is available to limited users through invitation only. Request an invitation and we'll get back to you soon.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClose}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={requestState === 'submitting'}
          >
            Cancel
          </button>
          <button
            onClick={handleRequestInvitation}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={requestState === 'submitting'}
          >
            {requestState === 'submitting' ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Requesting...
              </>
            ) : (
              'Request Invitation'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ComingSoonModal;
