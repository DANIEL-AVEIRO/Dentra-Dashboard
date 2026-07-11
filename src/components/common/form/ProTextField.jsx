import { useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ProSelect from "@/components/common/form/ProSelect";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { toast } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import {
  outlinedInputRootSx,
  filterOutlinedInputRootSx,
  inputLabelSx,
  filterInputLabelSx,
  inputBaseSx,
  filterInputBaseSx,
} from "@/components/common/form/fieldStyles";
import { multilineTextFieldProps } from "@/utils/fieldTypes";

function generateStrongPassword(length = 8) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = upper + lower + digits + special;
  const pick = (pool) => pool[Math.floor(Math.random() * pool.length)];
  const chars = [
    pick(upper),
    pick(lower),
    pick(digits),
    pick(special),
    ...Array.from({ length: length - 4 }, () => pick(all)),
  ];
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/**
 * Pro-level MUI Outlined TextField — shared styling for forms & filters.
 * Password fields get a show/hide toggle automatically.
 */
export default function ProTextField({
  slotProps: slotPropsProp,
  InputProps,
  InputLabelProps,
  filterBar = false,
  passwordTools = true,
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
  const { t } = useTranslation();
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

  const passwordIconBtnSx = {
    p: "4px",
    width: 26,
    height: 26,
    flexShrink: 0,
    color: alpha(theme.palette.text.secondary, 0.82),
    borderRadius: "6px",
    "&:hover": {
      color: theme.palette.primary.main,
      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.1 : 0.18),
    },
    "&.Mui-disabled": {
      color: theme.palette.action.disabled,
    },
  };

  const handleGeneratePassword = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const generated = generateStrongPassword(8);
    onChange?.({ target: { value: generated } });
    setShowPassword(true);
    toast.success(t("fields.passwordGenerated"));
  };

  const handleCopyPassword = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const text = value == null ? "" : String(value);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("fields.passwordCopied"));
    } catch {
      toast.error(t("fields.passwordCopyFailed"));
    }
  };

  const passwordAdornment = isPassword ? (
    <InputAdornment
      position="end"
      sx={{
        ml: 0.25,
        mr: 0.25,
        maxHeight: "none",
        height: "auto",
        alignSelf: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "1px",
          lineHeight: 0,
        }}
      >
        {passwordTools ? (
          <>
            <Tooltip title={t("fields.generatePassword")}>
              <IconButton
                type="button"
                size="small"
                disabled={disabled}
                onClick={handleGeneratePassword}
                aria-label={t("fields.generatePassword")}
                tabIndex={-1}
                sx={passwordIconBtnSx}
              >
                <KeyOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("fields.copyPassword")}>
              <IconButton
                type="button"
                size="small"
                disabled={disabled || !value}
                onClick={handleCopyPassword}
                aria-label={t("fields.copyPassword")}
                tabIndex={-1}
                sx={passwordIconBtnSx}
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : null}
        <IconButton
          type="button"
          size="small"
          disabled={disabled}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
          sx={passwordIconBtnSx}
        >
          {showPassword ? (
            <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
          ) : (
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Box>
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
          endAdornment: passwordAdornment
            ? existingEnd
              ? (
                  <>
                    {existingEnd}
                    {passwordAdornment}
                  </>
                )
              : passwordAdornment
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
