import { useMemo } from 'react';

export default function StarRating({ value = 0, onChange, max = 5, size = 24, readOnly = false }) {
  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);
  return (
    <div style={{ display: 'inline-flex', gap: 6, cursor: readOnly ? 'default' : 'pointer' }}>
      {stars.map((n) => {
        const filled = n <= Math.round(value);
        return (
          <span
            key={n}
            onClick={() => !readOnly && onChange && onChange(n)}
            title={`${n}`}
            style={{ fontSize: size, lineHeight: 1, userSelect: 'none' }}
            aria-label={filled ? 'star filled' : 'star empty'}
          >
            {filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}