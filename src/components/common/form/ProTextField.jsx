import { useState } from "react";
import { IconButton, InputAdornment, TextField, useTheme } from "@mui/material";
import ProSelect from "@/components/common/form/ProSelect";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  outlinedInputRootSx,
  filterOutlinedInputRootSx,
  inputLabelSx,
  filterInputLabelSx,
  inputBaseSx,
  filterInputBaseSx,
  adornmentIconSx,
  inputAdornmentSx,
} from "@/components/common/form/fieldStyles";
import { multilineTextFieldProps } from "@/utils/fieldTypes";

/**
 * Pro-level MUI Outlined TextField — shared styling for forms & filters.
 * Password fields get a show/hide toggle automatically.
 */
export default function ProTextField({
  slotProps: slotPropsProp,
  InputProps,
  InputLabelProps,
  filterBar = false,
  labelPlacement = "outlined",
  fullWidth = true,
  required: showRequired,
  type,
  sx,
  label,
  placeholder,
  helperText,
  id,
  select,
  selectOptions,
  children,
  value,
  onChange,
  disabled,
  multiline,
  rows,
  minRows,
  maxRows,
  ...props
}) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  if (select) {
    return (
      <ProSelect
        id={id}
        label={label}
        labelPlacement={labelPlacement}
        value={value}
        onChange={onChange}
        options={selectOptions ?? []}
        placeholder={placeholder}
        disabled={disabled}
        filterBar={filterBar}
        fullWidth={fullWidth}
        includeEmpty={false}
        sx={sx}
        {...props}
      />
    );
  }
  const topLabel = labelPlacement === "top";
  const showOutlinedLabel = !topLabel && label;
  const resolvedPlaceholder =
    placeholder ?? (topLabel && label ? label : undefined);
  const showHelperOnField = !topLabel && helperText;
  const rootSx = filterBar ? filterOutlinedInputRootSx : outlinedInputRootSx;
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const multilineProps = multiline
    ? multilineTextFieldProps({
        multiline: true,
        rows,
        minRows: minRows ?? rows,
        maxRows,
      })
    : {};

  const passwordToggle = isPassword ? (
    <InputAdornment position="end" sx={inputAdornmentSx(theme, "end")}>
      <IconButton
        type="button"
        edge="end"
        size="small"
        onClick={() => setShowPassword((v) => !v)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
        sx={{
          p: 0,
          width: 24,
          height: 24,
          color: "inherit",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        {showPassword ? (
          <VisibilityOffOutlinedIcon sx={adornmentIconSx(theme)} />
        ) : (
          <VisibilityOutlinedIcon sx={adornmentIconSx(theme)} />
        )}
      </IconButton>
    </InputAdornment>
  ) : null;

  const inputSlot = slotPropsProp?.input ?? {};
  const existingEnd = inputSlot.endAdornment ?? InputProps?.endAdornment;
  const existingStart = inputSlot.startAdornment ?? InputProps?.startAdornment;

  return (
    <TextField
      id={id}
      variant="outlined"
      size="small"
      fullWidth={fullWidth}
      type={resolvedType}
      label={showOutlinedLabel ? label : undefined}
      placeholder={resolvedPlaceholder}
      helperText={showHelperOnField ? helperText : undefined}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      {...multilineProps}
      {...props}
      sx={{ width: fullWidth ? "100%" : undefined, ...sx }}
      InputLabelProps={
        showOutlinedLabel
          ? {
              shrink: props.placeholder ? true : undefined,
              required: Boolean(showRequired),
              ...InputLabelProps,
              sx: {
                ...(filterBar ? filterInputLabelSx(theme) : inputLabelSx(theme)),
                ...InputLabelProps?.sx,
              },
            }
          : { ...InputLabelProps, sx: { display: "none" } }
      }
      InputProps={{
        ...InputProps,
        sx: {
          ...rootSx(theme),
          ...InputProps?.sx,
        },
      }}
      slotProps={{
        ...slotPropsProp,
        input: {
          ...inputSlot,
          startAdornment: existingStart,
          endAdornment: passwordToggle
            ? existingEnd
              ? (
                  <>
                    {existingEnd}
                    {passwordToggle}
                  </>
                )
              : passwordToggle
            : existingEnd,
          sx: {
            ...(filterBar ? filterInputBaseSx() : inputBaseSx()),
            ...inputSlot?.sx,
          },
        },
      }}
    />
  );
}
