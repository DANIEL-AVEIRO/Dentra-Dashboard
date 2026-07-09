import { useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useTableColumnVisibility } from "@/hooks/useTableColumnVisibility";
import { resolveResourceTableColumns } from "@/utils/resourceTableColumns";

export function useResourceTableColumnVisibility(
  columns,
  storageKey,
  { includeMetaColumns = true } = {}
) {
  const theme = useTheme();
  const isMobileTable = useMediaQuery(theme.breakpoints.down("md"));
  const resolvedColumns = useMemo(
    () =>
      resolveResourceTableColumns(columns, {
        includeMetaColumns: includeMetaColumns && !isMobileTable,
      }),
    [columns, includeMetaColumns, isMobileTable]
  );
  return useTableColumnVisibility(resolvedColumns, storageKey);
}
