import { MenuItem, TextField, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  outlinedInputRootSx,
  filterOutlinedInputRootSx,
  inputLabelSx,
  filterInputLabelSx,
  inputBaseSx,
  filterInputBaseSx,
  SELECT_MENU_PROPS,
  selectMenuPaperSx,
} from "@/components/common/form/fieldStyles";

/**
 * Native MUI Select (TextField select) — filters, simple dropdowns.
 */
export default function ProSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  includeEmpty = false,
  emptyLabel = "All",
  disabled = false,
  filterBar = false,
  fullWidth = true,
  sx,
  ...props
}) {
  const theme = useTheme();
  const rootSx = filterBar ? filterOutlinedInputRootSx : outlinedInputRootSx;

  const resolveOptionLabel = (selected) => {
    const opt = options.find(
      (o) => String(typeof o === "object" ? o.value : o) === String(selected)
    );
    if (typeof opt === "object") return opt.label;
    return opt ?? selected;
  };

  return (
    <TextField
      select
      variant="outlined"
      size="small"
      label={label}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{ width: fullWidth ? "100%" : undefined, minWidth: fullWidth ? 0 : 160, ...sx }}
      InputLabelProps={{
        shrink: true,
        sx: filterBar ? filterInputLabelSx(theme) : inputLabelSx(theme),
      }}
      InputProps={{
        sx: rootSx(theme),
      }}
      slotProps={{
        input: { sx: filterBar ? filterInputBaseSx() : inputBaseSx() },
        select: {
          displayEmpty: includeEmpty,
          renderValue: (selected) => {
            if (includeEmpty && (selected === "" || selected == null)) {
              return (
                <span style={{ opacity: 0.75, fontStyle: "normal" }}>{emptyLabel}</span>
              );
            }
            return resolveOptionLabel(selected);
          },
          IconComponent: KeyboardArrowDownIcon,
          MenuProps: {
            ...SELECT_MENU_PROPS,
            PaperProps: {
              sx: selectMenuPaperSx(theme),
            },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
          sx: {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        },
      }}
      {...props}
    >
      {includeEmpty && (
        <MenuItem value="">
          <em style={{ fontStyle: "normal", opacity: 0.75 }}>{emptyLabel}</em>
        </MenuItem>
      )}
      {options.map((opt) => {
        const val = typeof opt === "object" ? opt.value : opt;
        const lab = typeof opt === "object" ? opt.label : opt;
        return (
          <MenuItem key={String(val)} value={val}>
            {lab}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
