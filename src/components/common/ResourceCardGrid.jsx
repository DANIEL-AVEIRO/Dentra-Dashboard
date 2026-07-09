import {
  Box,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import { ArrowEmptyTableIcon } from "@/components/icons/ArrowTableIcons";
import { BRAND_PRIMARY } from "@/theme";
import { useTranslation } from "@/context/LanguageContext";
import { transition } from "@/constants/motion";
import { tablePaperSx } from "@/constants/tableStyles";
import TableCheckbox from "@/components/common/TableCheckbox";
import Skel from "@/components/common/skeletons/Skel";

function CardGridSkeleton({ count = 6 }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 2,
        p: 2,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Paper
          key={i}
          elevation={0}
          sx={{
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Skel variant="rectangular" height={160} sx={{ borderRadius: 0 }} />
          <Box sx={{ p: 1.5 }}>
            <Skel variant="text" width="70%" />
            <Skel variant="text" width="40%" sx={{ mt: 1 }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default function ResourceCardGrid({
  rows = [],
  count = 0,
  page = 1,
  onPageChange,
  loading,
  refreshing = false,
  renderCard,
  emptyMessage,
  rowsPerPage = 20,
  selectable = false,
  selectedIds,
  onToggleRow,
  onToggleAllPage,
  pageSelectState = { checked: false, indeterminate: false },
  rowIdKey = "id",
  embedded = false,
}) {
  const { t } = useTranslation();
  const resolvedEmpty = emptyMessage ?? t("table.noRecords");
  const hasSelect = selectable && selectedIds && onToggleRow && onToggleAllPage;

  const shellSx = embedded
    ? { ...tablePaperSx(), width: "100%" }
    : {
        ...tablePaperSx(),
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        transition: transition("border-color"),
      };

  const Shell = embedded ? Box : Paper;
  const shellProps = embedded ? { sx: shellSx } : { elevation: 0, sx: shellSx };

  return (
    <Shell {...shellProps}>
      {hasSelect && rows.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.25,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <TableCheckbox
            checked={pageSelectState.checked}
            indeterminate={pageSelectState.indeterminate}
            onChange={() => onToggleAllPage(rows)}
            disabled={loading || rows.length === 0}
            inputProps={{ "aria-label": "Select all on page" }}
          />
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {t("table.selectAllOnPage", { defaultValue: "Select all on this page" })}
          </Typography>
        </Box>
      )}

      {loading && rows.length === 0 ? (
        <CardGridSkeleton />
      ) : rows.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            py: 6,
            color: "text.secondary",
          }}
        >
          <ArrowEmptyTableIcon
            size={40}
            style={{ color: BRAND_PRIMARY, opacity: 0.45 }}
          />
          <Typography variant="body2" fontWeight={600}>
            {resolvedEmpty}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
            p: 2,
            opacity: refreshing ? 0.72 : 1,
            transition: transition("opacity"),
          }}
        >
          {rows.map((row) => {
            const id = row[rowIdKey];
            const selected = Boolean(selectedIds?.has(id));
            return (
              <Box key={id}>
                {renderCard(row, {
                  selected,
                  onToggleSelect: hasSelect ? () => onToggleRow(id) : undefined,
                  selectable: hasSelect,
                })}
              </Box>
            );
          })}
        </Box>
      )}

      {onPageChange &&
        (loading && rows.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 2,
              py: 1,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Skel variant="rounded" width={200} height={32} />
          </Box>
        ) : (
          <TablePagination
            component="div"
            count={count}
            page={Math.max(0, page - 1)}
            onPageChange={(_, p) => onPageChange(p + 1)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count: total }) =>
              `${from}–${to} of ${total !== -1 ? total : `more than ${to}`}`
            }
            sx={{
              borderTop: 1,
              borderColor: "divider",
              ".MuiTablePagination-toolbar": {
                minHeight: 52,
                justifyContent: "center",
                flexWrap: "wrap",
              },
              ".MuiTablePagination-spacer": { flex: "0 0 8px" },
              ".MuiTablePagination-selectLabel": { display: "none" },
              ".MuiTablePagination-select": { display: "none" },
              ".MuiTablePagination-actions": { ml: 1 },
              ".MuiTablePagination-displayedRows": {
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "text.secondary",
                margin: 0,
              },
            }}
          />
        ))}
    </Shell>
  );
}
