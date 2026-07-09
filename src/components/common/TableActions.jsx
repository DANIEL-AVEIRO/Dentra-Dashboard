import { Box } from "@mui/material";
import TableActionButton from "@/components/common/TableActionButton";

/**
 * Standard action group for ResourceTable rows.
 */
export default function TableActions({ children, sx }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexWrap: { xs: "wrap", md: "nowrap" },
        maxWidth: { xs: 140, sm: "none" },
        gap: 0.25,
        justifyContent: "flex-end",
        alignItems: "center",
        whiteSpace: "nowrap",
        flexShrink: 0,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export { TableActionButton };
