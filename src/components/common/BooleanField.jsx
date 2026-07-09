import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { toBoolean } from "@/utils/boolean";
import { BRAND_PRIMARY } from "@/theme";

/**
 * Professional boolean toggle for forms (replaces "true/false" text inputs).
 */
export default function BooleanField({
  label,
  value = false,
  onChange,
  description,
  disabled = false,
  activeLabel = "On",
  inactiveLabel = "Off",
}) {
  const theme = useTheme();
  const checked = toBoolean(value);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 1.25,
        py: 0.5,
        minHeight: 40,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor:
          theme.palette.mode === "light"
            ? alpha(BRAND_PRIMARY, checked ? 0.04 : 0.02)
            : alpha(BRAND_PRIMARY, checked ? 0.12 : 0.06),
        transition: "background-color 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: alpha(BRAND_PRIMARY, 0.35),
        },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" fontWeight={500} fontSize="0.875rem">
          {label}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary" display="block">
            {description}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            mt: 0.25,
            display: "inline-block",
            fontWeight: 500,
            color: checked ? "success.main" : "text.disabled",
          }}
        >
          {checked ? activeLabel : inactiveLabel}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        color="primary"
        inputProps={{ "aria-label": label }}
      />
    </Box>
  );
}

/** Compact switch variant for inline use */
export function BooleanSwitch({ label, value, onChange, disabled }) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={toBoolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          color="primary"
        />
      }
      label={
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
      }
      sx={{ ml: 0, mr: 0 }}
    />
  );
}
