export default function RubricRadioGroup({
  name,
  label,
  max = 5,
  value = null,
  onChange,
  description = ''
}) {
  const options = Array.from({ length: max + 1 }, (_, i) => i);

  // Qualitative tier label calculation
  const getTierLabel = (val) => {
    if (val === null) return null;
    const pct = val / max;
    if (pct === 1) return { text: 'Exemplary', color: '#10B981', bg: '#ECFDF5' };
    if (pct >= 0.75) return { text: 'Strong', color: '#059669', bg: '#F0FDF4' };
    if (pct >= 0.5) return { text: 'Satisfactory', color: '#2563EB', bg: '#EFF6FF' };
    if (pct >= 0.25) return { text: 'Basic', color: '#D97706', bg: '#FFFBEB' };
    return { text: 'Needs Work', color: '#DC2626', bg: '#FEF2F2' };
  };

  const tier = getTierLabel(value);

  return (
    <div
      className="rubric-radio-group"
      style={{
        marginBottom: '20px',
        padding: '18px 20px',
        background: 'var(--white)',
        border: `1.5px solid ${value !== null ? 'rgba(255, 107, 0, 0.4)' : 'var(--border)'}`,
        borderRadius: '14px',
        boxShadow: value !== null ? '0 4px 14px rgba(255, 107, 0, 0.08)' : 'var(--shadow-sm)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Parameter Header */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <label
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: '0.96rem',
              color: 'var(--navy)',
              cursor: 'default',
              display: 'block'
            }}
          >
            {label}
          </label>
          {description && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
              {description}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tier && (
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: tier.color,
                background: tier.bg,
                padding: '3px 9px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {tier.text}
            </span>
          )}

          <span
            className="pill-badge"
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              background: value !== null ? 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)' : 'var(--off-white)',
              color: value !== null ? '#FFFFFF' : 'var(--text-secondary)',
              border: `1px solid ${value !== null ? '#FF6B00' : 'var(--border)'}`,
              padding: '3px 12px',
              borderRadius: '14px',
              minWidth: '50px',
              textAlign: 'center'
            }}
          >
            {value !== null ? `${value} / ${max}` : `— / ${max}`}
          </span>
        </div>
      </div>

      {/* Horizontal Radio Options List */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          marginTop: '12px'
        }}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((score) => {
          const isSelected = value === score;
          const inputId = `${name}-score-${score}`;

          return (
            <label
              key={score}
              htmlFor={inputId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: max > 10 ? '5px 10px' : '7px 14px',
                borderRadius: '10px',
                background: isSelected ? 'linear-gradient(135deg, #0B192C 0%, #1E293B 100%)' : '#F8FAFC',
                color: isSelected ? '#FFFFFF' : 'var(--navy)',
                border: `1.5px solid ${isSelected ? '#0B192C' : '#E2E8F0'}`,
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '0.88rem',
                fontWeight: isSelected ? 800 : 600,
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 10px rgba(11, 25, 44, 0.25)' : 'none',
                flexGrow: max > 10 ? 1 : 0
              }}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={score}
                checked={isSelected}
                onChange={() => onChange(score)}
                style={{
                  cursor: 'pointer',
                  accentColor: '#FF6B00',
                  width: '14px',
                  height: '14px'
                }}
              />
              <span>{score}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
