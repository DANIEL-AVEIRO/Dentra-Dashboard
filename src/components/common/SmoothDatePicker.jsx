import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  formatDateValue,
  parseDateValue,
  DISPLAY_DATE_FORMAT,
} from "@/utils/dateTimeValue";
import {
  buildPickerSlotProps,
  pickerRootSx,
} from "@/components/common/pickers/pickerSlotProps";

/**
 * Calendar date picker — outputs YYYY-MM-DD for API filters and forms.
 */
export default function SmoothDatePicker({
  label,
  hideLabel = false,
  fullWidth = false,
  placeholder,
  value = "",
  onChange,
  disabled = false,
  error = false,
  minDate,
  maxDate,
  filterBar = false,
  sx,
}) {
  const theme = useTheme();
  const showLabel = !hideLabel && label;

  return (
    <DatePicker
      label={showLabel ? label : undefined}
      value={parseDateValue(value)}
      onChange={(newValue) => onChange?.(formatDateValue(newValue))}
      disabled={disabled}
      format={DISPLAY_DATE_FORMAT}
      minDate={minDate ? parseDateValue(minDate) : undefined}
      maxDate={maxDate ? parseDateValue(maxDate) : undefined}
      reduceAnimations={false}
      dayOfWeekFormatter={(day) => day.format("dd")}
      slotProps={buildPickerSlotProps({
        theme,
        filterBar,
        fullWidth,
        hideLabel,
        label,
        placeholder,
        error,
        sx,
      })}
      sx={pickerRootSx(theme)}
    />
  );
}
