import { useTheme } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  formatDateTimeValue,
  parseDateTimeValue,
  DISPLAY_DATETIME_FORMAT,
} from "@/utils/dateTimeValue";
import {
  buildPickerSlotProps,
  pickerRootSx,
} from "@/components/common/pickers/pickerSlotProps";
import { analogClockViewRenderers } from "@/components/common/pickers/timeViewRenderers";

/**
 * Date + time picker — outputs YYYY-MM-DDTHH:mm (matches Django reminder parsing).
 */
export default function SmoothDateTimePicker({
  label,
  hideLabel = false,
  fullWidth = false,
  placeholder,
  value = "",
  onChange,
  disabled = false,
  error = false,
  minDateTime,
  maxDateTime,
  filterBar = false,
  sx,
}) {
  const theme = useTheme();
  const showLabel = !hideLabel && label;

  return (
    <DateTimePicker
      label={showLabel ? label : undefined}
      value={parseDateTimeValue(value)}
      onChange={(newValue) => onChange?.(formatDateTimeValue(newValue))}
      disabled={disabled}
      format={DISPLAY_DATETIME_FORMAT}
      ampm={false}
      minutesStep={5}
      minDateTime={minDateTime ? parseDateTimeValue(minDateTime) : undefined}
      maxDateTime={maxDateTime ? parseDateTimeValue(maxDateTime) : undefined}
      viewRenderers={analogClockViewRenderers}
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
