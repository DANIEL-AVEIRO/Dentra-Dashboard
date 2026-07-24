import { Box } from "@mui/material";
import { TABLE_FILTER_GRID_COLUMNS } from "@/constants/layout";

/**
 * Uniform grid for table toolbar selects — fixed cell width, no stretch on wide screens.
 */
export default function TableFilterSelectGrid({ children, columns, sx }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: columns ?? TABLE_FILTER_GRID_COLUMNS,
        gap: 1,
        flex: "0 1 auto",
        minWidth: 0,
        width: { xs: "100%", md: "fit-content" },
        maxWidth: "100%",
        alignItems: "end",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
