import { Box, Chip, alpha, useTheme } from "@mui/material";
import { ACTIVE_STATUSES } from "@/config/statuses";
import { ArrowCheckIcon, ArrowCrossIcon } from "@/components/icons/ArrowTableIcons";
import { toBoolean } from "@/utils/boolean";
import { getStatusChipSx } from "@/utils/statusColors";
import HighlightText from "@/components/common/HighlightText";

/**
 * Table cell display for boolean columns.
 */
export default function BooleanCell({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
  variant = "chip",
}) {
  const theme = useTheme();
  const active = toBoolean(value);

  if (variant === "icon") {
    const tint = active ? "#059669" : "#64748B";
    const Icon = active ? ArrowCheckIcon : ArrowCrossIcon;
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: "6px",
          color: tint,
          bgcolor: alpha(tint, 0.12),
          border: `1px solid ${alpha(tint, 0.2)}`,
        }}
      >
        <Icon size={15} />
      </Box>
    );
  }

  const label = active ? trueLabel : falseLabel;
  const statusValue = active ? "active" : "inactive";

  return (
    <Chip
      label={<HighlightText text={label} component="span" />}
      size="small"
      variant="outlined"
      sx={{
        minWidth: 44,
        ...getStatusChipSx(theme, statusValue, ACTIVE_STATUSES),
      }}
    />
  );
}
