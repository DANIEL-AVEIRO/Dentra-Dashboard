import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { toBoolean } from "@/utils/boolean";
import { FIELD_MIN_HEIGHT, FIELD_RADIUS } from "@/components/common/form/fieldStyles";

/**
 * Professional boolean toggle for forms (replaces "true/false" text inputs).
 * Set `showLabel={false}` when wrapped in FormField so control height matches selects.
 */
export default function BooleanField({
  label,
  value = false,
  onChange,
  description,
  disabled = false,
  activeLabel = "On",
  inactiveLabel = "Off",
  showLabel = true,
}) {
  const theme = useTheme();
  const checked = toBoolean(value);
  const primary = theme.palette.primary.main;

  const surfaceSx = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    px: 1.25,
    minHeight: showLabel ? 40 : FIELD_MIN_HEIGHT,
    borderRadius: showLabel ? 1 : `${FIELD_RADIUS}px`,
    border: 1,
    borderColor: "divider",
    bgcolor:
      theme.palette.mode === "light"
        ? alpha(primary, checked ? 0.04 : 0.02)
        : alpha(primary, checked ? 0.12 : 0.06),
    transition: "background-color 0.2s, border-color 0.2s",
    "&:hover": {
      borderColor: alpha(primary, 0.35),
    },
  };

  if (!showLabel) {
    return (
      <Box sx={surfaceSx}>
        <Typography
          variant="body2"
          fontWeight={500}
          fontSize="0.875rem"
          sx={{
            color: checked ? "success.main" : "text.secondary",
          }}
        >
          {checked ? activeLabel : inactiveLabel}
        </Typography>
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

  return (
    <Box sx={{ ...surfaceSx, py: 0.5 }}>
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
