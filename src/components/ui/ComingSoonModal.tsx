import { Sparkles } from 'lucide-react';
import { Modal } from './Modal';

export interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Shared modal for "Coming Soon" features (e.g., Advanced Assessment).
 * Used in AssessmentChoice and AssessmentProgress pages.
 */
export function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          Something Awesome is Brewing!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
          Our Advanced Assessment is getting its final polish and will be ready to supercharge your AI journey very soon!
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
          In the meantime, take the Basic Assessment to get a head start on discovering your AI superpowers.
        </p>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
        >
          Sounds Great!
        </button>
      </div>
    </Modal>
  );
}

export default ComingSoonModal;
