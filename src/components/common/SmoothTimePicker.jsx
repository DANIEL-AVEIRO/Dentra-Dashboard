import { useTheme } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  formatTimeValue,
  parseTimeValue,
  DISPLAY_TIME_FORMAT,
} from "@/utils/dateTimeValue";
import {
  buildPickerSlotProps,
  pickerRootSx,
} from "@/components/common/pickers/pickerSlotProps";
import { analogClockViewRenderers } from "@/components/common/pickers/timeViewRenderers";

/**
 * 24h time picker — outputs HH:mm for API / Django TimeField.
 */
export default function SmoothTimePicker({
  label,
  hideLabel = false,
  fullWidth = false,
  placeholder,
  value = "",
  onChange,
  disabled = false,
  error = false,
  filterBar = false,
  sx,
}) {
  const theme = useTheme();
  const showLabel = !hideLabel && label;

  return (
    <TimePicker
      label={showLabel ? label : undefined}
      value={parseTimeValue(value)}
      onChange={(newValue) => onChange?.(formatTimeValue(newValue))}
      disabled={disabled}
      format={DISPLAY_TIME_FORMAT}
      ampm={false}
      minutesStep={1}
      viewRenderers={analogClockViewRenderers}
      reduceAnimations={false}
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
