import { Box, TableCell, TableRow } from "@mui/material";
import { TABLE_CHECKBOX_WIDTH } from "@/constants/tableStyles";
import Skel from "@/components/common/skeletons/Skel";

export default function TableSkeleton({
  columnCount = 5,
  hasActions = false,
  hasSelect = false,
  rows = 8,
}) {
  const colCount = columnCount + (hasSelect ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: colCount }).map((__, j) => {
            const isSelectCol = hasSelect && j === 0;
            return (
              <TableCell
                key={j}
                sx={
                  isSelectCol
                    ? {
                        width: "1%",
                        minWidth: TABLE_CHECKBOX_WIDTH,
                        maxWidth: TABLE_CHECKBOX_WIDTH,
                        px: 0.25,
                        textAlign: "center",
                      }
                    : undefined
                }
              >
                {isSelectCol ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Skel variant="rounded" width={20} height={20} sx={{ borderRadius: 1 }} />
                  </Box>
                ) : (
                  <Skel
                    variant="text"
                    width={
                      j === (hasSelect ? 1 : 0)
                        ? "55%"
                        : j === colCount - 1 && hasActions
                          ? 72
                          : "75%"
                    }
                    height={18}
                  />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
