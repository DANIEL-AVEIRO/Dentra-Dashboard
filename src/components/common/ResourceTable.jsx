import { useMemo, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { ArrowEmptyTableIcon } from "@/components/icons/ArrowTableIcons";
import { ProSearchField } from "@/components/common/form";
import TableColumnToggle from "@/components/common/TableColumnToggle";
import { useTranslation } from "@/context/LanguageContext";
import { transition, DURATION, EASE_SOFT } from "@/constants/motion";
import { TABLE_BORDER_RADIUS, TABLE_MAX_HEIGHT, TABLE_MAX_HEIGHT_MOBILE } from "@/constants/layout";
import {
  TABLE_ACTIONS_MIN_WIDTH,
  TABLE_ACTIONS_WIDTH,
  TABLE_HEAD_FONT_SIZE,
  tableBodyCellSx,
  tableCheckboxCellSx,
  tableRowIndexCellSx,
  tableContainerScrollSx,
  tableHeadBorder,
  tableHeadCellSx,
  tableHeaderBg,
  tablePaperSx,
  tableActionCellSx,
  tableRowSx,
} from "@/constants/tableStyles";
import TableCheckbox from "@/components/common/TableCheckbox";
import TableRowPreviewDrawer from "@/components/common/TableRowPreviewDrawer";
import TableSkeleton from "@/components/common/skeletons/TableSkeleton";
import Skel from "@/components/common/skeletons/Skel";
import { TableHighlightContext } from "@/context/TableHighlightContext";
import { renderTableCell } from "@/utils/renderTableCell";
import { resolveResourceTableColumns } from "@/utils/resourceTableColumns";
import {
  isColumnSortable,
  resolveColumnOrderField,
} from "@/utils/columnOrdering";
import {
  buildPreviewFieldsFromColumns,
  canShowPreviewOpenDetail,
  inferPreviewIdKey,
  inferPreviewStatusKey,
  resolvePreviewDetailPath,
} from "@/utils/tableRowPreview";
import { useTableColumnVisibility } from "@/hooks/useTableColumnVisibility";
import { useTableDensity } from "@/hooks/useTableDensity";

function EmptyState({ message, colSpan }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ border: 0, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            color: "text.secondary",
          }}
        >
          <ArrowEmptyTableIcon
            size={36}
            style={{ color: primary, opacity: 0.45 }}
          />
          <Typography variant="body2" fontWeight={600}>
            {message}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function ResourceTable({
  columns,
  rows,
  count = 0,
  page = 1,
  onPageChange,
  loading,
  refreshing = false,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  actions,
  emptyMessage,
  rowsPerPage = 20,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50, 100],
  showRowNumbers = true,
  rowNumberOffset = 0,
  stickyActionsColumn = false,
  summaryFooter,
  sortIndex,
  onInlinePatch,
  inlinePatchKeys = [],
  copyableKeys = [],
  cellRenderOptions,
  selectable = false,
  selectedIds,
  isRowSelected,
  onToggleRow,
  onToggleAllPage,
  pageSelectState = { checked: false, indeterminate: false },
  rowIdKey = "id",
  isRowSelectable,
  /** Active search string — matching substrings are highlighted in cells */
  highlightQuery = "",
  /** Inside TablePanel — no outer Paper/border */
  embedded = false,
  /** Server-side sort: active field name (ORM), direction, column click handler */
  sortField,
  sortDirection,
  onColumnSort,
  /** When false, skip auto-appending created/updated audit columns */
  includeMetaColumns = true,
  /** comfortable | compact — optional controlled density */
  density: densityProp,
  onDensityChange,
  showDensityToggle = true,
  /** Show column visibility picker (persisted per column set) */
  showColumnToggle = true,
  columnStorageKey,
  /** When set, column visibility is controlled by the parent (e.g. TableFilters toolbar). */
  displayColumns: displayColumnsProp,
  /** Row click (ignored when clicking checkbox, links, buttons) */
  onRowClick,
  /** Offcanvas row overview — enables row click when onRowClick is omitted */
  rowPreview,
  /** Controlled preview row (optional — for view buttons outside the table) */
  previewRow: previewRowProp,
  onPreviewRowChange,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobileTable = useMediaQuery(theme.breakpoints.down("md"));
  const effectiveIncludeMeta = includeMetaColumns && !isMobileTable;
  const resolvedEmpty = emptyMessage ?? t("table.noRecords");
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const internalDensityState = useTableDensity();
  const density = densityProp ?? internalDensityState.density;
  const isCompact = density === "compact";
  const resolvedColumns = useMemo(
    () =>
      resolveResourceTableColumns(columns, { includeMetaColumns: effectiveIncludeMeta }),
    [columns, effectiveIncludeMeta]
  );
  const internalColumnVisibility = useTableColumnVisibility(resolvedColumns, columnStorageKey);
  const displayColumns = displayColumnsProp ?? internalColumnVisibility.displayColumns;
  const hasSelect = selectable && selectedIds && onToggleRow && onToggleAllPage;
  const showRowIndex = showRowNumbers;
  const colSpan =
    displayColumns.length +
    (hasSelect ? 1 : 0) +
    (showRowIndex ? 1 : 0) +
    (actions ? 1 : 0);

  const resolvedCellOptions = {
    onInlinePatch,
    inlinePatchKeys,
    copyableKeys,
    ...cellRenderOptions,
  };

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const headerBg = tableHeaderBg(theme);
  const compactSx = isCompact
    ? { py: 0.5, px: 1, fontSize: "0.8125rem", minWidth: 100 }
    : {};
  const headSx = { ...tableHeadCellSx(theme, headerBg), ...compactSx };
  const bodySx = { ...tableBodyCellSx(), ...compactSx };
  const stickyActionSx = stickyActionsColumn
    ? {
        position: "sticky",
        right: 0,
        zIndex: 2,
        boxShadow: (th) =>
          `-4px 0 8px ${th.palette.mode === "light" ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.25)"}`,
      }
    : {};
  const stickyHeadSx = { ...headSx, ...stickyActionSx, bgcolor: headerBg, zIndex: 3 };
  const actionBodySx = tableActionCellSx(theme, {
    sticky: stickyActionsColumn,
    compactSx: isCompact ? { py: 0.5, px: 0.75 } : {},
  });

  const setDensity = (next) => {
    if (densityProp == null) {
      internalDensityState.setDensity(next);
    }
    onDensityChange?.(next);
  };

  const toggleDensity = () => {
    setDensity(isCompact ? "comfortable" : "compact");
  };

  const showColumnPicker =
    showColumnToggle && !displayColumnsProp && internalColumnVisibility.canToggle;
  const showDensityInTable = showDensityToggle && densityProp == null;
  const showTableToolbar = onSearchChange || showColumnPicker || showDensityInTable;

  const tableToolbarActions = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
      {showColumnPicker ? (
        <TableColumnToggle
          columns={internalColumnVisibility.allColumns}
          visibleColumnKeys={internalColumnVisibility.visibleColumnKeys}
          onToggle={internalColumnVisibility.toggleColumnVisibility}
          disabled={loading}
        />
      ) : null}
      {showDensityInTable ? (
        <Tooltip
          title={
            isCompact
              ? t("table.densityComfortable", { defaultValue: "Comfortable rows" })
              : t("table.densityCompact", { defaultValue: "Compact rows" })
          }
        >
          <IconButton
            size="small"
            onClick={toggleDensity}
            aria-label={t("table.densityToggle", { defaultValue: "Toggle table density" })}
            sx={{ border: 1, borderColor: "divider" }}
          >
            {isCompact ? <ViewComfyIcon fontSize="small" /> : <ViewCompactIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );

  const [internalPreviewRow, setInternalPreviewRow] = useState(null);
  const previewRow = previewRowProp !== undefined ? previewRowProp : internalPreviewRow;
  const setPreviewRow = onPreviewRowChange ?? setInternalPreviewRow;
  const effectiveOnRowClick =
    onRowClick ?? (rowPreview ? (row) => setPreviewRow(row) : undefined);

  const resolvedRowPreview = useMemo(() => {
    if (!rowPreview || !previewRow) return null;
    const idKey =
      typeof rowPreview.idKey === "function"
        ? inferPreviewIdKey(previewRow, displayColumns, rowIdKey)
        : rowPreview.idKey ?? inferPreviewIdKey(previewRow, displayColumns, rowIdKey);
    const displayId =
      typeof rowPreview.idKey === "function" ? rowPreview.idKey(previewRow) : undefined;
    const statusKey =
      rowPreview.statusKey ??
      inferPreviewStatusKey(previewRow, displayColumns);
    const fields =
      typeof rowPreview.fields === "function"
        ? rowPreview.fields(previewRow, displayColumns)
        : rowPreview.fields ?? buildPreviewFieldsFromColumns(displayColumns);
    const detailPath = resolvePreviewDetailPath(
      previewRow,
      rowPreview.detailPath,
      rowPreview.rowIdKey || rowIdKey
    );
    const showOpenDetail = canShowPreviewOpenDetail(rowPreview, previewRow);
    const title =
      typeof rowPreview.title === "function"
        ? rowPreview.title(previewRow)
        : rowPreview.title;
    const imageUrls =
      typeof rowPreview.imageUrls === "function"
        ? rowPreview.imageUrls(previewRow)
        : rowPreview.imageUrls;

    return {
      title,
      idKey,
      displayId,
      statusKey,
      statusList: rowPreview.statusList,
      fields,
      detailPath,
      showOpenDetail,
      imageKey: rowPreview.imageKey,
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      onOpenDetail: rowPreview.onOpenDetail,
    };
  }, [rowPreview, previewRow, displayColumns, rowIdKey]);

  const [rowSlideEpoch, setRowSlideEpoch] = useState(0);
  const rowListSignature = useMemo(
    () => rows.map((row) => String(row[rowIdKey])).join("\u0001"),
    [rows, rowIdKey]
  );

  useEffect(() => {
    if (loading || refreshing || rows.length === 0) return;
    setRowSlideEpoch((epoch) => epoch + 1);
  }, [rowListSignature, page, loading, refreshing, rows.length]);

  const isRowAnimating = rowSlideEpoch > 0;

  const handleRowClick = (row) => (event) => {
    if (!effectiveOnRowClick) return;
    if (
      event.target.closest(
        "button, a, input, label, [role='checkbox'], [role='switch'], .MuiSwitch-root"
      )
    ) {
      return;
    }
    effectiveOnRowClick(row);
  };

  const canSelectRow = (row) => !isRowSelectable || isRowSelectable(row);

  const shellSx = embedded
    ? { ...tablePaperSx(), width: "100%" }
    : {
        ...tablePaperSx(),
        borderRadius: TABLE_BORDER_RADIUS,
        border: 1,
        borderColor: "divider",
        transition: transition("border-color"),
      };

  const Shell = embedded ? Box : Paper;
  const shellProps = embedded ? { sx: shellSx } : { elevation: 0, sx: shellSx };

  return (
    <Shell {...shellProps}>
      {showTableToolbar ? (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: onSearchChange ? "flex-start" : "flex-end",
          }}
        >
          {onSearchChange ? (
            <ProSearchField
              type="search"
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={handleSearch}
              sx={{ minWidth: { xs: "100%", sm: 320 }, maxWidth: 400, flex: 1 }}
            />
          ) : null}
          {tableToolbarActions}
        </Box>
      ) : null}

      <TableContainer
        className={isRowAnimating ? "table-scroll-animating" : undefined}
        sx={{
          ...tableContainerScrollSx(theme, {
            xs: TABLE_MAX_HEIGHT_MOBILE,
            md: TABLE_MAX_HEIGHT,
          }),
          position: "relative",
        }}
      >
        <Table
          stickyHeader
          size={isCompact ? "small" : "medium"}
          aria-label="data table"
          sx={{
            width: "max-content",
            minWidth: "100%",
            tableLayout: "auto",
          }}
        >
          <TableHead>
            <TableRow>
              {hasSelect && (
                <TableCell
                  sx={{
                    ...tableCheckboxCellSx(),
                    bgcolor: headerBg,
                    backgroundImage: "none",
                    borderBottom: tableHeadBorder(theme),
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <TableCheckbox
                      checked={pageSelectState.checked}
                      indeterminate={pageSelectState.indeterminate}
                      onChange={() => onToggleAllPage(rows)}
                      disabled={loading || rows.length === 0}
                      inputProps={{ "aria-label": "Select all on page" }}
                    />
                  </Box>
                </TableCell>
              )}
              {showRowIndex ? (
                <TableCell
                  align="center"
                  sx={{
                    ...tableRowIndexCellSx({
                      bgcolor: headerBg,
                      backgroundImage: "none",
                      borderBottom: tableHeadBorder(theme),
                      fontSize: TABLE_HEAD_FONT_SIZE,
                      fontWeight: 400,
                      color: "text.primary",
                    }),
                  }}
                >
                  #
                </TableCell>
              ) : null}
              {displayColumns.map((col) => {
                const sortable = onColumnSort && isColumnSortable(col);
                const colOrderField = resolveColumnOrderField(col);
                const active =
                  sortable && sortField && colOrderField && sortField === colOrderField;
                const orderBadge =
                  typeof sortIndex === "function" ? sortIndex(col) : -1;
                return (
                  <TableCell key={col.key} align={col.align || "left"} sx={headSx}>
                    {sortable ? (
                      <TableSortLabel
                        active={active}
                        direction={active ? sortDirection || "asc" : "asc"}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onColumnSort(col, event);
                        }}
                        sx={{
                          cursor: "pointer",
                          maxWidth: "100%",
                          verticalAlign: "inherit",
                        }}
                      >
                        {col.label}
                        {orderBadge > 0 ? ` (${orderBadge + 1})` : ""}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}
              {actions && (
                <TableCell
                  align="right"
                  sx={{
                    ...stickyHeadSx,
                    width: TABLE_ACTIONS_WIDTH,
                    minWidth: TABLE_ACTIONS_MIN_WIDTH,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("table.actions")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              opacity: refreshing && rows.length > 0 ? 0.68 : 1,
              transition: transition("opacity", DURATION.fast, EASE_SOFT),
              pointerEvents: refreshing ? "none" : "auto",
            }}
          >
            <TableHighlightContext.Provider value={highlightQuery?.trim() ?? ""}>
            {loading && rows.length === 0 ? (
              <TableSkeleton
                columnCount={displayColumns.length}
                hasActions={!!actions}
                hasSelect={hasSelect}
                rows={8}
              />
            ) : rows.length === 0 ? (
              <EmptyState message={resolvedEmpty} colSpan={colSpan} />
            ) : (
              rows.map((row, index) => {
                const rowId = row[rowIdKey];
                const selected =
                  hasSelect &&
                  (isRowSelected
                    ? isRowSelected(rowId)
                    : selectedIds.has(String(rowId)));
                const selectableRow = canSelectRow(row);
                const rowDelayMs = Math.min(index * 16, 96);
                const rowClassName = [
                  "table-data-row",
                  rowSlideEpoch > 0 ? "table-row-enter" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow
                    key={`${rowId}-${rowSlideEpoch}`}
                    hover
                    selected={selected}
                    onClick={handleRowClick(row)}
                    className={rowClassName}
                    style={{ "--row-delay": `${rowDelayMs}ms` }}
                    sx={{
                      ...tableRowSx(theme),
                      ...(effectiveOnRowClick ? { cursor: "pointer" } : {}),
                    }}
                  >
                    {hasSelect && (
                      <TableCell sx={tableCheckboxCellSx({ borderColor: "divider" })}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <TableCheckbox
                            checked={selected}
                            disabled={!selectableRow}
                            onChange={() => onToggleRow(rowId)}
                            inputProps={{
                              "aria-label": `Select row ${rowId}`,
                            }}
                          />
                        </Box>
                      </TableCell>
                    )}
                    {showRowIndex ? (
                      <TableCell
                        align="center"
                        sx={{
                          ...tableRowIndexCellSx({
                            borderColor: "divider",
                            color: "text.secondary",
                            fontWeight: 600,
                          }),
                        }}
                      >
                        {rowNumberOffset + index + 1}
                      </TableCell>
                    ) : null}
                    {displayColumns.map((col) => (
                      <TableCell key={col.key} align={col.align || "left"} sx={bodySx}>
                        {renderTableCell(col, row, highlightQuery, resolvedCellOptions)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell align="right" sx={actionBodySx}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            flexWrap: "nowrap",
                            gap: 0.25,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          {actions(row)}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
            {summaryFooter && rows.length > 0 ? (
              <TableRow>
                {hasSelect ? <TableCell sx={tableCheckboxCellSx()} /> : null}
                {showRowIndex ? (
                  <TableCell sx={tableRowIndexCellSx()} />
                ) : null}
                {displayColumns.map((col) => (
                  <TableCell key={`summary-${col.key}`} sx={{ ...bodySx, fontWeight: 700 }}>
                    {summaryFooter[col.key] ?? ""}
                  </TableCell>
                ))}
                {actions ? <TableCell sx={actionBodySx} /> : null}
              </TableRow>
            ) : null}
            </TableHighlightContext.Provider>
          </TableBody>
        </Table>
      </TableContainer>

      {onPageChange &&
        (loading ? (
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
        ) : (
          <TablePagination
            component="div"
            count={count}
            page={Math.max(0, page - 1)}
            onPageChange={(_, p) => onPageChange(p + 1)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              onRowsPerPageChange?.(Number.parseInt(event.target.value, 10));
            }}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage={t("table.rowsPerPage")}
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
      {resolvedRowPreview ? (
        <TableRowPreviewDrawer
          open={Boolean(previewRow)}
          onClose={() => setPreviewRow(null)}
          row={previewRow}
          title={resolvedRowPreview.title}
          idKey={resolvedRowPreview.idKey}
          displayId={resolvedRowPreview.displayId}
          statusKey={resolvedRowPreview.statusKey}
          statusList={resolvedRowPreview.statusList}
          fields={resolvedRowPreview.fields}
          detailPath={resolvedRowPreview.detailPath}
          showOpenDetail={resolvedRowPreview.showOpenDetail}
          imageKey={resolvedRowPreview.imageKey ?? null}
          imageUrls={resolvedRowPreview.imageUrls ?? []}
          onOpenDetail={resolvedRowPreview.onOpenDetail}
        />
      ) : null}
    </Shell>
  );
}
