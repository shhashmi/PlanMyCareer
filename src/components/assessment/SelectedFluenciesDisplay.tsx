import { Check } from 'lucide-react';
import type { SkillDimension } from '../../types/api.types';

export interface SelectedFluenciesDisplayProps {
  skills: SkillDimension[];
  maxCount: number;
}

/**
 * Non-editable display of selected fluencies.
 * Shows count and skill chips.
 */
export function SelectedFluenciesDisplay({
  skills,
  maxCount,
}: SelectedFluenciesDisplayProps) {
  return (
    <div style={{ marginTop: '16px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
        }}
      >
        Selected for Assessment ({skills.length}/{maxCount})
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {skills.map((skill) => (
          <div
            key={skill.code}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
            }}
          >
            <Check size={14} color="var(--primary-light)" />
            {skill.name}
          </div>
        ))}
        {skills.length === 0 && (
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            No skills selected
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectedFluenciesDisplay;
