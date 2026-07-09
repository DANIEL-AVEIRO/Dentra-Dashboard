import { Box } from "@mui/material";
import { TABLE_FILTER_FIELD_SX } from "@/constants/layout";

/** Single filter control cell inside TableFilterSelectGrid. */
export default function TableFilterField({ children, sx }) {
  return <Box sx={{ ...TABLE_FILTER_FIELD_SX, ...sx }}>{children}</Box>;
}
