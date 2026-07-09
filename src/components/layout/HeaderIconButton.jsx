import { IconButton, Tooltip } from "@mui/material";

/** App bar icon — consistent size, hover, and light-on-brand contrast. */
export default function HeaderIconButton({
  title,
  onClick,
  children,
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
}) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          color="inherit"
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel ?? title}
          sx={{
            width: 36,
            height: 36,
            bgcolor: active ? "rgba(255,255,255,0.16)" : "transparent",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.12)",
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
