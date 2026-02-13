import { Sparkles, Check, Info } from 'lucide-react';
import type { SkillDimension } from '../../types/api.types';
import { splitSkillsByPriority, getSkillsByCodes } from '../../utils/profileUtils';
import { FluencyCheckbox } from '../ui/FluencyCheckbox';

export interface FluencySelectorProps {
  skills: SkillDimension[];
  selectedCodes: Set<string>;
  onSelectionChange: (codes: Set<string>) => void;
  maxSelections?: number;
}

/**
 * Main container for fluency selection.
 * Two-column layout: left has checkboxes, right has selected display.
 */
export function FluencySelector({
  skills,
  selectedCodes,
  onSelectionChange,
  maxSelections = 3,
}: FluencySelectorProps) {
  const { priority, remaining } = splitSkillsByPriority(skills, maxSelections);
  const isAtMax = selectedCodes.size >= maxSelections;
  const selectedSkills = getSkillsByCodes(skills, Array.from(selectedCodes));

  const handleChange = (code: string, checked: boolean) => {
    const next = new Set(selectedCodes);
    if (checked) {
      next.add(code);
    } else {
      next.delete(code);
    }
    onSelectionChange(next);
  };

  const renderSkillSection = (
    title: string,
    sectionSkills: SkillDimension[]
  ) => {
    if (sectionSkills.length === 0) return null;

    return (
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            paddingLeft: '4px',
          }}
        >
          {title}
        </div>
        <div>
          {sectionSkills.map((skill) => (
            <FluencyCheckbox
              key={skill.code}
              skill={skill}
              checked={selectedCodes.has(skill.code)}
              disabled={isAtMax && !selectedCodes.has(skill.code)}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'rgba(20, 184, 166, 0.06)',
        border: '1px solid rgba(20, 184, 166, 0.15)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '32px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <Sparkles size={18} color="var(--primary-light)" />
        <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Skill Selection
        </span>
      </div>

      {/* Hint message */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          lineHeight: '1.5',
        }}
      >
        You can select up to {maxSelections} skills, but we recommend focusing on one at a time for more structured learning.
      </p>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Left Column - Available Fluencies */}
        <div
          style={{
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            paddingRight: '24px',
          }}
        >
          {renderSkillSection('Top Priority Fluencies', priority)}
          {renderSkillSection('Next Priority Fluencies', remaining)}
        </div>

        {/* Right Column - Selected Fluencies */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}
          >
            Selected for Assessment ({selectedSkills.length}/{maxSelections})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedSkills.map((skill) => (
              <div
                key={skill.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '10px',
                }}
              >
                <Check size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {skill.name}
                  </div>
                </div>
              </div>
            ))}
            {selectedSkills.length === 0 && (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}
              >
                No skills selected
              </div>
            )}
            {selectedSkills.length > 0 && selectedSkills.length < maxSelections && (
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                }}
              >
                Select {maxSelections - selectedSkills.length} more
              </div>
            )}
            {selectedSkills.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  marginTop: '12px',
                  padding: '10px 12px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                }}
              >
                <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} color="var(--accent)" />
                <span>Tip: Assessing one fluency at a time leads to more focused learning. You can always assess more later.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FluencySelector;
