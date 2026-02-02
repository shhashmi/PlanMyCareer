import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Crown, ArrowRight } from 'lucide-react';
import { ADVANCED_ASSESSMENT_FEATURES, IS_ADVANCED_ASSESSMENT_BETA } from '../../data/assessmentData';

interface AdvancedAssessmentTileProps {
  onClick: () => void;
  animationDelay?: number;
  animationDirection?: 'left' | 'right';
  buttonText?: string;
  style?: CSSProperties;
}

export function AdvancedAssessmentTile({
  onClick,
  animationDelay = 0.2,
  animationDirection = 'right',
  buttonText = 'Get Advanced Assessment',
  style
}: AdvancedAssessmentTileProps) {
  const xOffset = animationDirection === 'left' ? -20 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: '24px',
        padding: '32px',
        border: '2px solid var(--primary)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'var(--gradient-1)',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Crown size={14} />
        RECOMMENDED
      </div>

      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--gradient-1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <Sparkles size={28} color="white" />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        Advanced Assessment
        {IS_ADVANCED_ASSESSMENT_BETA && (
          <span style={{
            background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
            color: 'white',
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '12px',
            letterSpacing: '0.5px',
            lineHeight: '1.4'
          }}>
            BETA
          </span>
        )}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Comprehensive evaluation with structured learning and hands-on practice
      </p>

      <div style={{
        background: 'rgba(20, 184, 166, 0.15)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        {IS_ADVANCED_ASSESSMENT_BETA ? (
          <>
            <span style={{ fontSize: '26px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>$20</span>
            <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)', marginLeft: '10px' }}>Free</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>Complimentary during Beta</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-light)' }}>$20</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>one-time</span>
          </>
        )}
      </div>

      <ul style={{ listStyle: 'none', display: 'grid', gap: '12px', marginBottom: '24px', flex: 1 }}>
        {ADVANCED_ASSESSMENT_FEATURES.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <Check size={18} color="var(--secondary)" />
            {item}
          </li>
        ))}
      </ul>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
        {buttonText}
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
