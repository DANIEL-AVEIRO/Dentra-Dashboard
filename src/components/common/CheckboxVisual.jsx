import { Box } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { alpha, useTheme } from "@mui/material/styles";
import { transition } from "@/constants/motion";
import { TABLE_CHECKBOX_VISUAL_CLASS } from "@/constants/tableStyles";

const VISUAL_CLASS = TABLE_CHECKBOX_VISUAL_CLASS;

/**
 * 20×20 selection tile — filled primary when checked, neutral outline when idle.
 * Used by TableCheckbox and global MuiCheckbox theme defaults.
 */
export default function CheckboxVisual({
  checked = false,
  indeterminate = false,
  disabled = false,
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const isLight = theme.palette.mode === "light";
  const active = checked || indeterminate;

  return (
    <Box
      aria-hidden
      className={`${VISUAL_CLASS}${active ? ` ${VISUAL_CLASS}--active` : ""}`}
      sx={{
        width: 20,
        height: 20,
        borderRadius: 1.25,
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: "2px solid",
        borderColor: active
          ? primary
          : alpha(theme.palette.text.primary, isLight ? 0.2 : 0.38),
        bgcolor: active
          ? primary
          : isLight
            ? theme.palette.background.paper
            : alpha(theme.palette.common.white, 0.05),
        boxShadow: active
          ? `0 2px 6px ${alpha(primary, 0.28)}`
          : isLight
            ? `0 1px 2px ${alpha(theme.palette.common.black, 0.04)}`
            : "none",
        transition: transition(
          "border-color, background-color, box-shadow, transform",
          160
        ),
        opacity: disabled ? 0.42 : 1,
      }}
    >
      {indeterminate ? (
        <RemoveRoundedIcon
          sx={{
            fontSize: 14,
            color: "#fff",
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.5)",
            transition: transition("opacity, transform", 160, "cubic-bezier(0.34, 1.2, 0.64, 1)"),
          }}
        />
      ) : (
        <CheckRoundedIcon
          sx={{
            fontSize: 15,
            color: "#fff",
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.5)",
            transition: transition("opacity, transform", 160, "cubic-bezier(0.34, 1.2, 0.64, 1)"),
          }}
        />
      )}
    </Box>
  );
}
