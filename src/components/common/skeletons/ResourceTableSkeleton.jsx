import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import {
  tableHeadCellSx,
  tableHeaderBg,
  tablePaperSx,
} from "@/constants/tableStyles";
import Skel from "@/components/common/skeletons/Skel";
import TableSkeleton from "@/components/common/skeletons/TableSkeleton";

export default function ResourceTableSkeleton({
  columns = [],
  hasActions = false,
  rows = 8,
  embedded = false,
}) {
  const theme = useTheme();
  const columnCount = columns.length || 5;
  const headSx = tableHeadCellSx(theme, tableHeaderBg(theme));

  const inner = (
    <>
      <TableContainer sx={{ maxHeight: { md: "calc(100vh - 280px)" } }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableCell key={i} sx={headSx}>
                  <Skel
                    variant="text"
                    width={columns[i]?.label ? "70%" : 64}
                    height={14}
                  />
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="right" sx={headSx}>
                  <Skel variant="text" width={48} height={14} sx={{ ml: "auto" }} />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton
              columnCount={columnCount}
              hasActions={hasActions}
              rows={rows}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          px: 0.75,
          py: 0.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Skel variant="text" width={100} height={28} />
        <Skel variant="rounded" width={200} height={32} />
      </Box>
    </>
  );

  if (embedded) {
    return <Box sx={{ ...tablePaperSx(), width: "100%" }}>{inner}</Box>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        ...tablePaperSx(),
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      {inner}
    </Paper>
  );
}
