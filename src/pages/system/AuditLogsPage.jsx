import { useEffect, useMemo, useState } from "react";
import { usePersistedListSearch } from "@/hooks/usePersistedListSearch";
import { useListPageParam, useListStringParam } from "@/hooks/useListUrlParams";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Chip, Stack, Typography } from "@mui/material";
import TableBulkBar from "@/components/common/TableBulkBar";
import { ProSelect } from "@/components/common/form";
import TableActions, { TableActionButton } from "@/components/common/TableActions";
import PageHeader from "@/components/common/PageHeader";
import ResourceTable from "@/components/common/ResourceTable";
import HighlightText from "@/components/common/HighlightText";
import TableFilters from "@/components/common/TableFilters";
import TableColumnToggle from "@/components/common/TableColumnToggle";
import TableDensityToggle from "@/components/common/TableDensityToggle";
import TableFilterSelectGrid from "@/components/common/TableFilterSelectGrid";
import TableFilterField from "@/components/common/TableFilterField";
import TablePanel from "@/components/common/TablePanel";
import AuditChangeSummary from "@/components/audit/AuditChangeSummary";
import client from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { resolveDateFilterFields } from "@/utils/dateFilterFields";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTableMultiSort } from "@/hooks/useTableMultiSort";
import { useListPageSize } from "@/hooks/useListPageSize";
import { useResourceTableColumnVisibility } from "@/hooks/useResourceTableColumnVisibility";
import { useTableDensity } from "@/hooks/useTableDensity";
import { useTableSelection } from "@/hooks/useTableSelection";
import { bulkAuditLogDelete, summarizeBulkResult } from "@/utils/bulkApi";
import { toast, getErrorMessage } from "@/utils/toast";
import { resourceTypeFilterOptions } from "@/config/resourceTypes";
import { useTranslation } from "@/context/LanguageContext";
import { translateColumns } from "@/i18n/helpers";
import { TABLE_FILTER_SELECT_SX } from "@/constants/layout";
import {
  ACTION_COLORS,
  buildAuditHeadline,
  formatAuditDateTime,
  getAuditActionLabel,
  getAuditRecordLabel,
  summarizeAuditChanges,
} from "@/utils/auditDisplay";

export default function AuditLogsPage() {
  usePersistedListSearch();
  const [page, setPage] = useListPageParam();
  const { pageSize, setPageSize, pageSizeOptions } = useListPageSize();
  const { t, locale } = useTranslation();
  const { user: currentUser } = useAuth();
  const viewerIsSuperAdmin = Boolean(currentUser?.is_super_admin);
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [actionFilter, setActionFilter] = useListStringParam("action");
  const [modelFilter, setModelFilter] = useListStringParam("model");
  const [previewRow, setPreviewRow] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const selection = useTableSelection("id");

  const {
    filters,
    setFilter,
    resetFilters,
    removeFilterChip,
    queryParams: filterParams,
    debouncedSearch,
    hasActiveFilters,
  } = useTableFilters();

  const tableSort = useTableMultiSort();

  const listParams = useMemo(
    () => ({
      ...filterParams,
      ordering: tableSort.ordering,
      page_size: pageSize,
      ...(actionFilter ? { action: actionFilter } : {}),
      ...(modelFilter ? { model: modelFilter } : {}),
    }),
    [filterParams, actionFilter, modelFilter, pageSize, tableSort.ordering]
  );

  const { rows, count, loading, refreshing, refresh } = usePaginatedList(
    "audit-logs",
    { params: listParams, page, setPage }
  );

  useEffect(() => {
    selection.clear();
  }, [JSON.stringify(listParams)]);

  const handleDelete = async (row) => {
    const headline = buildAuditHeadline(row, t);
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("audit.deleteConfirm", { activity: headline }),
      confirmLabel: t("common.delete"),
      confirmColor: "error",
    });
    if (!ok) return;
    try {
      await client.delete(`/audit-logs/${row.id}/`);
      toast.success(t("audit.deleted"));
      if (previewRow?.id === row.id) setPreviewRow(null);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.deleteFailed")));
    }
  };

  const handleBulkDelete = async () => {
    if (!selection.selectedCount || bulkBusy) return;
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("audit.deleteManyConfirm", { count: selection.selectedCount }),
      confirmLabel: t("common.delete"),
      confirmColor: "error",
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const data = await bulkAuditLogDelete(selection.selectedIdList);
      const summary = summarizeBulkResult(data, t("audit.deleted"));
      if (summary.allOk) toast.success(summary.message);
      else if (summary.allFailed) toast.error(summary.message);
      else toast.warning(summary.message);
      if (previewRow && selection.selectedIds.has(String(previewRow.id))) {
        setPreviewRow(null);
      }
      selection.clear();
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.bulkDeleteFailed")));
    } finally {
      setBulkBusy(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
    setPage(1);
  };

  const columns = useMemo(
    () =>
      translateColumns(
        [
          {
            key: "created_at",
            labelKey: "audit.columns.when",
            exportValue: (row) => row.created_at ?? "",
            render: (row) => (
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {formatAuditDateTime(row.created_at, locale)}
              </Typography>
            ),
          },
          {
            key: "activity",
            labelKey: "audit.columns.activity",
            sortable: false,
            exportValue: (row) => buildAuditHeadline(row, t),
            render: (row) => {
              const actionLabel = getAuditActionLabel(row, t);
              const headline = buildAuditHeadline(row, t);
              return (
                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                  <Chip
                    size="small"
                    label={<HighlightText text={actionLabel} component="span" />}
                    color={ACTION_COLORS[row.action] || "default"}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start", maxWidth: "100%" }}
                  />
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    <HighlightText text={headline} />
                  </Typography>
                </Stack>
              );
            },
          },
          {
            key: "object_repr",
            labelKey: "audit.columns.record",
            exportValue: (row) => getAuditRecordLabel(row) || "—",
            render: (row) => (
              <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 220 }}>
                <HighlightText text={getAuditRecordLabel(row) || "—"} />
              </Typography>
            ),
          },
          {
            key: "user_repr",
            labelKey: "audit.columns.user",
            exportValue: (row) => row.user_repr || row.user_username || "",
            render: (row) => (
              <Typography variant="body2">
                <HighlightText text={row.user_repr || row.user_username || t("audit.systemUser")} />
              </Typography>
            ),
          },
          {
            key: "changes",
            labelKey: "audit.columns.summary",
            sortable: false,
            exportValue: (row) => summarizeAuditChanges(row.changes, t, locale),
            render: (row) => (
              <AuditChangeSummary changes={row.changes} highlightQuery={debouncedSearch} />
            ),
          },
        ],
        t
      ),
    [t, locale, debouncedSearch]
  );

  const columnVisibility = useResourceTableColumnVisibility(columns, "audit-logs", {
    includeMetaColumns: false,
  });
  const tableDensity = useTableDensity();

  const dateFilterFields = useMemo(
    () => resolveDateFilterFields(columns, { endpoint: "audit-logs" }),
    [columns]
  );

  const actionOptions = ["create", "update", "delete", "login", "logout", "custom"];

  const auditRowPreview = useMemo(
    () => ({
      title: t("pages.auditLogs.title"),
      idKey: (row) => getAuditRecordLabel(row),
      showOpenDetail: false,
      activityLog: {
        auditModel: (row) => row.model_name,
        objectIdKey: "object_id",
      },
    }),
    [t]
  );

  return (
    <>
      <PageHeader
        title={t("pages.auditLogs.title")}
        subtitle={t("pages.auditLogs.subtitle")}
      />

      <TablePanel
        filters={
          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            dateFields={dateFilterFields}
            onReset={() => {
              resetFilters();
              setActionFilter("");
              setModelFilter("");
              setPage(1);
            }}
            hasActiveFilters={
              hasActiveFilters || Boolean(actionFilter) || Boolean(modelFilter)
            }
            searchPlaceholder={t("pages.auditLogs.search")}
            extra={
              <TableFilterSelectGrid>
                <TableFilterField>
                  <ProSelect
                    filterBar
                    label={t("filters.action")}
                    value={actionFilter}
                    onChange={(e) => {
                      setActionFilter(e.target.value);
                      setPage(1);
                    }}
                    includeEmpty
                    emptyLabel={t("common.all")}
                    options={actionOptions.map((value) => ({
                      value,
                      label: t(`audit.actions.${value}`),
                    }))}
                    sx={TABLE_FILTER_SELECT_SX}
                  />
                </TableFilterField>
                <TableFilterField>
                  <ProSelect
                    filterBar
                    label={t("filters.resourceType")}
                    value={modelFilter}
                    onChange={(e) => {
                      setModelFilter(e.target.value);
                      setPage(1);
                    }}
                    includeEmpty
                    emptyLabel={t("audit.allRecordTypes")}
                    options={resourceTypeFilterOptions.map(({ modelName, title }) => ({
                      value: modelName,
                      label: t(`resources.${modelName}`, { defaultValue: title }),
                    }))}
                    sx={TABLE_FILTER_SELECT_SX}
                  />
                </TableFilterField>
              </TableFilterSelectGrid>
            }
            exportEndpoint="audit-logs"
            exportListParams={listParams}
            exportColumns={columnVisibility.displayColumns}
            exportFilenameBase="audit-logs"
            exportTitle={t("pages.auditLogs.title")}
            exportDisabled={loading}
            onRefresh={refresh}
            refreshing={refreshing}
            onFilterChipRemove={(key) => {
              removeFilterChip(key);
              setPage(1);
            }}
            columnToggle={
              columnVisibility.canToggle ? (
                <TableColumnToggle
                  columns={columnVisibility.allColumns}
                  visibleColumnKeys={columnVisibility.visibleColumnKeys}
                  onToggle={columnVisibility.toggleColumnVisibility}
                  onReset={columnVisibility.resetColumns}
                  onReorderColumn={columnVisibility.reorderColumn}
                  disabled={loading}
                />
              ) : null
            }
            densityToggle={
              <TableDensityToggle
                isCompact={tableDensity.isCompact}
                onToggle={tableDensity.toggleDensity}
                disabled={loading}
              />
            }
          />
        }
        bulkBar={
          viewerIsSuperAdmin ? (
            <TableBulkBar
              embedded
              selectedCount={selection.selectedCount}
              onClear={selection.clear}
              actions={[
                {
                  id: "delete",
                  label: t("common.delete"),
                  icon: <DeleteOutlineIcon sx={{ fontSize: 16 }} />,
                  color: "error",
                  onClick: handleBulkDelete,
                  disabled: bulkBusy,
                },
              ]}
            />
          ) : null
        }
      >
        <ResourceTable
          embedded
          columnStorageKey="audit-logs"
          displayColumns={columnVisibility.displayColumns}
          density={tableDensity.density}
          showColumnToggle={false}
          showDensityToggle={false}
          selectable={viewerIsSuperAdmin}
          selectedIds={selection.selectedIds}
          isRowSelected={selection.isSelected}
          onToggleRow={selection.toggle}
          onToggleAllPage={() => selection.toggleAllOnPage(rows)}
          pageSelectState={selection.pageSelectionState(rows)}
          columns={columns}
        rows={rows}
        count={count}
        page={page}
        onPageChange={setPage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={setPageSize}
        rowsPerPageOptions={pageSizeOptions}
        rowNumberOffset={(page - 1) * pageSize}
        loading={loading}
        refreshing={refreshing}
        highlightQuery={debouncedSearch}
        emptyMessage={t("audit.empty")}
        sortField={tableSort.sort.field}
        sortDirection={tableSort.sort.desc ? "desc" : "asc"}
        sortIndex={tableSort.sortIndex}
        onColumnSort={tableSort.toggleColumnSort}
        previewRow={previewRow}
        onPreviewRowChange={setPreviewRow}
        rowPreview={auditRowPreview}
        actions={(row) => (
          <TableActions>
            <TableActionButton variant="view" onClick={() => setPreviewRow(row)} />
            {viewerIsSuperAdmin ? (
              <TableActionButton variant="delete" onClick={() => handleDelete(row)} />
            ) : null}
          </TableActions>
        )}
        />
      </TablePanel>

      <ConfirmDialog />
    </>
  );
}
