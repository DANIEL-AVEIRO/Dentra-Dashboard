import { Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckboxVisual from "@/components/common/CheckboxVisual";
import { tableCheckboxSx } from "@/constants/tableStyles";

/**
 * Row / header selection checkbox for data tables.
 * Matches global MuiCheckbox styling; accepts optional layout overrides via sx.
 */
export default function TableCheckbox({ sx, disabled, ...props }) {
  const theme = useTheme();

  return (
    <Checkbox
      size="small"
      disableRipple
      disabled={disabled}
      icon={<CheckboxVisual disabled={disabled} />}
      checkedIcon={<CheckboxVisual checked disabled={disabled} />}
      indeterminateIcon={<CheckboxVisual indeterminate disabled={disabled} />}
      sx={{ ...tableCheckboxSx(theme), ...sx }}
      {...props}
    />
  );
}
