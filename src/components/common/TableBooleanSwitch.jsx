import { Switch, useTheme } from "@mui/material";

/** Read-only active toggle for table cells (list view). */
export default function TableBooleanSwitch({ value, trueLabel, falseLabel }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const on = Boolean(value);

  return (
    <Switch
      checked={on}
      disabled
      size="small"
      inputProps={{
        "aria-label": on ? trueLabel || "Active" : falseLabel || "Inactive",
      }}
      sx={{
        "& .MuiSwitch-switchBase.Mui-disabled": {
          color: on ? primary : undefined,
        },
        "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
          opacity: on ? 1 : 0.5,
          bgcolor: on ? primary : undefined,
        },
      }}
    />
  );
}
