import { Chip, useTheme } from "@mui/material";
import { getStatusMeta } from "@/config/statuses";
import { useTranslation } from "@/context/LanguageContext";
import { getStatusChipSx } from "@/utils/statusColors";
import HighlightText from "@/components/common/HighlightText";

export default function StatusChip({
  value,
  statusList,
  size = "sm",
  translationNs = "statuses",
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const meta = getStatusMeta(statusList, value);
  const label = t(`${translationNs}.${value}`, { defaultValue: meta.label ?? value });

  if (value == null || value === "") {
    return null;
  }

  return (
    <Chip
      label={<HighlightText text={label} component="span" />}
      size="small"
      variant="outlined"
      sx={getStatusChipSx(theme, value, statusList, { size })}
    />
  );
}
