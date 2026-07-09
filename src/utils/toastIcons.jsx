/** Lightweight SVG icons for toasts (avoid MUI — portaled toasts may lack theme context). */

const iconStyle = (colorVar) => ({
  width: 20,
  height: 20,
  display: "block",
  flexShrink: 0,
  color: colorVar,
});

function Icon({ children, colorVar }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={iconStyle(colorVar)}
    >
      {children}
    </svg>
  );
}

export const toastIcons = {
  success: (
    <Icon colorVar="var(--arrow-success)">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
    </Icon>
  ),
  error: (
    <Icon colorVar="var(--arrow-error)">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </Icon>
  ),
  warning: (
    <Icon colorVar="var(--arrow-warning)">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </Icon>
  ),
  info: (
    <Icon colorVar="var(--arrow-info)">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </Icon>
  ),
  loading: (
    <Icon colorVar="var(--arrow-loading)">
      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
    </Icon>
  ),
};
