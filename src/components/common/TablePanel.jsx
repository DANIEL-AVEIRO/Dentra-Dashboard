import { Paper } from "@mui/material";
import { tablePanelPaperSx } from "@/constants/tablePanel";

/**
 * One continuous surface: filter toolbar → table.
 * Bulk actions (when embedded) render as a floating bar via Portal.
 */
export default function TablePanel({ filters, bulkBar, children, sx }) {
  return (
    <Paper elevation={0} sx={{ ...tablePanelPaperSx, ...sx }}>
      {filters}
      {bulkBar}
      {children}
    </Paper>
  );
}
