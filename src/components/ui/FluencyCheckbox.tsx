import type { SkillDimension } from '../../types/api.types';

export interface FluencyCheckboxProps {
  skill: SkillDimension;
  checked: boolean;
  disabled: boolean;
  onChange: (code: string, checked: boolean) => void;
}

/**
 * Reusable checkbox component for individual fluency items.
 * Displays skill name and description with checkbox styling.
 */
export function FluencyCheckbox({
  skill,
  checked,
  disabled,
  onChange,
}: FluencyCheckboxProps) {
  const handleChange = () => {
    if (!disabled || checked) {
      onChange(skill.code, !checked);
    }
  };

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        cursor: disabled && !checked ? 'not-allowed' : 'pointer',
        opacity: disabled && !checked ? 0.5 : 1,
        background: checked ? 'rgba(20, 184, 166, 0.08)' : 'transparent',
        transition: 'background 0.2s ease',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled && !checked}
        style={{
          width: '18px',
          height: '18px',
          accentColor: 'var(--primary)',
          cursor: disabled && !checked ? 'not-allowed' : 'pointer',
          marginTop: '2px',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          {skill.name}
        </div>
        {skill.description && (
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: '1.4',
            }}
          >
            {skill.description}
          </div>
        )}
      </div>
    </label>
  );
}

export default FluencyCheckbox;
