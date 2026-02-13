import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Check, Clock } from 'lucide-react';
import { BASIC_ASSESSMENT_FEATURES } from '../../data/assessmentData';

interface BasicAssessmentTileProps {
  onClick?: () => void;
  cursor?: string;
  dimmed?: boolean;
  animationDelay?: number;
  animationDirection?: 'left' | 'right';
  children: ReactNode;
  style?: CSSProperties;
  showPaymentTier?: boolean;
  showDescription?: boolean;
  estimatedMinutes?: number;
}

export function BasicAssessmentTile({
  onClick,
  cursor,
  dimmed,
  animationDelay = 0.1,
  animationDirection = 'left',
  children,
  style,
  showPaymentTier = true,
  showDescription = true,
  estimatedMinutes
}: BasicAssessmentTileProps) {
  const xOffset = animationDirection === 'left' ? -20 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: '24px',
        padding: '32px',
        border: '2px solid var(--border)',
        cursor: cursor ?? (onClick ? 'pointer' : undefined),
        transition: 'all 0.3s ease',
        opacity: dimmed ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      whileHover={onClick ? { borderColor: 'var(--primary)', scale: 1.02 } : {}}
    >
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'rgba(20, 184, 166, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <ClipboardList size={28} color="var(--primary-light)" />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
        Basic Assessment
      </h2>
      {showDescription && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          A quick, personalized evaluation with instant insights
        </p>
      )}

      {showPaymentTier && (
        <div style={{
          background: 'rgba(20, 184, 166, 0.1)',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>Free</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            {estimatedMinutes ? `~${estimatedMinutes} minutes` : '5-10 minutes'}
          </span>
        </div>
      )}

      {showDescription && (
        <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px' }}>
          {BASIC_ASSESSMENT_FEATURES.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
              <Check size={18} color="var(--secondary)" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {children}
    </motion.div>
  );
}
