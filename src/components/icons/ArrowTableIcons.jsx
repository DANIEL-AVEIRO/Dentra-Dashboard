/**
 * Custom Arrow table icons — rounded stroke style, distinct from default MUI sets.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ArrowEditIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path
        {...stroke}
        d="M12.2 3.8l4 4M4 16h4l8.2-8.2a1.4 1.4 0 0 0 0-2l-2.6-2.6a1.4 1.4 0 0 0-2 0L4 12v4z"
      />
      <circle cx="13.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowArchiveIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path
        {...stroke}
        d="M4 7h12M6 7V5.5A1.5 1.5 0 0 1 7.5 4h5A1.5 1.5 0 0 1 14 5.5V7M5 7v7.5A1.5 1.5 0 0 0 6.5 16h7a1.5 1.5 0 0 0 1.5-1.5V7"
      />
      <path {...stroke} d="M8 10.5h4M10 10.5V13" />
    </svg>
  );
}

export function ArrowDeleteForeverIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path
        {...stroke}
        d="M6 7h8M7.5 7V5.5A1.5 1.5 0 0 1 9 4h2a1.5 1.5 0 0 1 1.5 1.5V7M5.5 7v8A1.5 1.5 0 0 0 7 16.5h6a1.5 1.5 0 0 0 1.5-1.5V7"
      />
      <path {...stroke} d="M8.5 9v4M11.5 9v4" />
      <path {...stroke} d="M4 6.5h12" />
    </svg>
  );
}

export function ArrowRestoreIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path
        {...stroke}
        d="M5.5 8.5A4.5 4.5 0 1 1 10 14.5c1.6 0 3-.8 3.8-2"
      />
      <path {...stroke} d="M5 5.5V9H8.5" />
      <circle cx="14" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowViewIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path
        {...stroke}
        d="M3.5 10s2.8-5 6.5-5 6.5 5 6.5 5-2.8 5-6.5 5-6.5-5-6.5-5z"
      />
      <circle {...stroke} cx="10" cy="10" r="2.25" />
      <circle cx="10" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowAssignIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <circle {...stroke} cx="8.5" cy="7" r="2.75" />
      <path
        {...stroke}
        d="M4 15.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
      />
      <path {...stroke} d="M14.5 6v4M12.5 8h4" />
      <circle cx="14.5" cy="6" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowDuplicateIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <rect {...stroke} x="7.5" y="7.5" width="9" height="10" rx="1.5" />
      <path {...stroke} d="M5.5 13V6.5A1.5 1.5 0 0 1 7 5h5.5" />
      <path {...stroke} d="M9.5 11h4M9.5 13.5h2.5" opacity="0.85" />
    </svg>
  );
}

export function ArrowStatusIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <path {...stroke} d="M4 6h12M4 10h8M4 14h10" />
      <circle cx="15" cy="10" r="2" {...stroke} />
      <path {...stroke} d="M15 8.2v3.6" />
    </svg>
  );
}

export function ArrowCheckIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <circle cx="10" cy="10" r="7.5" {...stroke} />
      <path {...stroke} d="M7 10.2l2 2 4-3.8" />
    </svg>
  );
}

export function ArrowCrossIcon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden {...props}>
      <circle cx="10" cy="10" r="7.5" {...stroke} opacity="0.7" />
      <path {...stroke} d="M8 8l4 4M12 8l-4 4" />
    </svg>
  );
}

export function ArrowEmptyTableIcon({ size = 48, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden {...props}>
      <rect
        x="8"
        y="12"
        width="32"
        height="26"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M16 22h16M16 28h10"
        opacity="0.5"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M28 8l8 8"
        opacity="0.7"
      />
    </svg>
  );
}
