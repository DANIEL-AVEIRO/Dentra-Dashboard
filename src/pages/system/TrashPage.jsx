import { useEffect, useMemo, useState } from "react";
import { usePersistedListSearch } from "@/hooks/usePersistedListSearch";
import { useListPageParam, useListStringParam } from "@/hooks/useListUrlParams";
import { Typography } from "@mui/material";
import { ProSelect } from "@/components/common/form";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import TableActions, { TableActionButton } from "@/components/common/TableActions";
import PageHeader from "@/components/common/PageHeader";
import ResourceTable from "@/components/common/ResourceTable";
import TableBulkBar from "@/components/common/TableBulkBar";
import { useTableSelection } from "@/hooks/useTableSelection";
import {
  bulkPermanentDelete,
  bulkRestore,
  permanentDelete,
  summarizeBulkResult,
} from "@/utils/bulkApi";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { resolveDateFilterFields } from "@/utils/dateFilterFields";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTableMultiSort } from "@/hooks/useTableMultiSort";
import { useListPageSize } from "@/hooks/useListPageSize";
import { useResourceTableColumnVisibility } from "@/hooks/useResourceTableColumnVisibility";
import { useTableDensity } from "@/hooks/useTableDensity";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import TableFilters from "@/components/common/TableFilters";
import TableColumnToggle from "@/components/common/TableColumnToggle";
import TableDensityToggle from "@/components/common/TableDensityToggle";
import TableFilterSelectGrid from "@/components/common/TableFilterSelectGrid";
import TableFilterField from "@/components/common/TableFilterField";
import TablePanel from "@/components/common/TablePanel";
import {
  TRASH_ALL_ID,
  deletedAtColumn,
  getTrashConfig,
  trashAllColumns,
  trashAllConfig,
  trashResources,
} from "@/config/trash";
import { useTranslation } from "@/context/LanguageContext";
import { translateColumns } from "@/i18n/helpers";
import { TABLE_FILTER_SELECT_SX } from "@/constants/layout";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { endpointToAuditModelName } from "@/utils/endpointAuditModel";

export default function TrashPage() {
  usePersistedListSearch();
  const [page, setPage] = useListPageParam();
  const { pageSize, setPageSize, pageSizeOptions } = useListPageSize();
  const { t } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [resourceId, setResourceId] = useListStringParam("resource", TRASH_ALL_ID);
  const activeResourceId = useMemo(
    () => trashResources.find((r) => r.id === resourceId)?.id ?? "",
    [resourceId]
  );
  const isAll = !activeResourceId;
  const config = getTrashConfig(activeResourceId) ?? trashAllConfig;

  const {
    filters,
    setFilter,
    resetFilters,
    removeFilterChip,
    queryParams: filterParams,
    debouncedSearch,
    hasActiveFilters,
  } = useTableFilters();

  const tableSort = useTableMultiSort({ defaultField: "deleted_at", defaultDesc: true });

  const listParams = useMemo(() => {
    const base = { ...filterParams, ordering: tableSort.ordering, page_size: pageSize };
    if (!activeResourceId) {
      return base;
    }
    return { ...base, resource: activeResourceId };
  }, [activeResourceId, filterParams, pageSize, tableSort.ordering]);

  const { rows, count, loading, refreshing, refresh } = usePaginatedList("trash", {
    params: listParams,
    enabled: Boolean(config),
    page,
    setPage,
  });

  const selection = useTableSelection("id");
  const [bulkBusy, setBulkBusy] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
    setPage(1);
  };

  const columns = useMemo(() => {
    if (isAll) {
      return translateColumns(
        [
          {
            ...trashAllColumns[0],
            render: (row) =>
              t(`trashResources.${row.resource_id}`, {
                defaultValue:
                  trashResources.find((r) => r.id === row.resource_id)?.title ??
                  row.resource_id,
              }),
            exportValue: (row) =>
              t(`trashResources.${row.resource_id}`, {
                defaultValue: row.resource_id,
              }),
          },
          {
            ...trashAllColumns[1],
            render: (row) => row.display ?? "—",
            exportValue: (row) => row.display ?? "",
          },
          deletedAtColumn,
        ],
        t
      );
    }
    const primaryColumn = config?.columns?.[0];
    return translateColumns(
      [
        {
          key: "display",
          ...(primaryColumn?.labelKey
            ? { labelKey: primaryColumn.labelKey }
            : { label: primaryColumn?.label ?? config?.title ?? "Record" }),
          render: (row) => row.display ?? "—",
          exportValue: (row) => row.display ?? "",
        },
        deletedAtColumn,
      ],
      t
    );
  }, [isAll, config, t]);

  const columnVisibility = useResourceTableColumnVisibility(
    columns,
    `trash-${activeResourceId || "all"}`,
    { includeMetaColumns: false }
  );
  const tableDensity = useTableDensity();

  const dateFilterFields = useMemo(
    () => resolveDateFilterFields(columns, { endpoint: "trash" }),
    [columns]
  );

  useEffect(() => {
    selection.clear();
  }, [activeResourceId]);

  const rowLabel = (row) => row.display || "—";

  const rowEndpoint = (row) => row.endpoint ?? config?.endpoint;

  const runBulkByEndpoint = async (action) => {
    const ids = selection.selectedIdList;
    const groups = new Map();
    for (const id of ids) {
      const row = rows.find((r) => String(r.id) === String(id));
      if (!row) continue;
      const ep = rowEndpoint(row);
      if (!groups.has(ep)) groups.set(ep, []);
      groups.get(ep).push(id);
    }
    const results = [];
    for (const [ep, groupIds] of groups) {
      if (action === "restore") {
        results.push(await bulkRestore(ep, groupIds));
      } else {
        results.push(await bulkPermanentDelete(ep, groupIds));
      }
    }
    return results;
  };

  const runBulkRestore = async () => {
    const ok = await confirm({
      title: t("confirm.title.restore"),
      message: t("confirm.restoreMany", { count: selection.selectedCount }),
      confirmLabel: t("common.restore"),
      confirmColor: "success",
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const results = await runBulkByEndpoint("restore");
      const succeeded = results.reduce((n, d) => n + (d?.succeeded_count ?? 0), 0);
      const failed = results.reduce((n, d) => n + (d?.failed_count ?? 0), 0);
      const summary = summarizeBulkResult(
        { succeeded_count: succeeded, failed_count: failed },
        t("bulk.restored")
      );
      if (summary.allOk) toast.success(summary.message);
      else if (summary.allFailed) toast.error(summary.message);
      else toast.warning(summary.message);
      selection.clear();
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.restoreFailed")));
    } finally {
      setBulkBusy(false);
    }
  };

  const handleRestore = async (row) => {
    const ep = rowEndpoint(row);
    const label = rowLabel(row);
    const ok = await confirm({
      title: t("confirm.title.restore"),
      message: t("confirm.restoreOne", {
        item: label,
        defaultValue: `Restore "${label}"?`,
      }),
      confirmLabel: t("common.restore"),
      confirmColor: "success",
    });
    if (!ok) return;
    try {
      await client.post(`/${ep}/${row.id}/restore/`);
      toast.success(t("toast.restored"));
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.restoreFailed")));
    }
  };

  const runBulkPermanentDelete = async () => {
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("confirm.deleteManyPermanently", {
        count: selection.selectedCount,
      }),
      confirmLabel: t("common.deletePermanently"),
      confirmColor: "error",
    });
    if (!ok) return;
    setBulkBusy(true);
    try {
      const results = await runBulkByEndpoint("delete");
      const succeeded = results.reduce((n, d) => n + (d?.succeeded_count ?? 0), 0);
      const failed = results.reduce((n, d) => n + (d?.failed_count ?? 0), 0);
      const summary = summarizeBulkResult(
        { succeeded_count: succeeded, failed_count: failed },
        t("bulk.permanentlyDeleted")
      );
      if (summary.allOk) toast.success(summary.message);
      else if (summary.allFailed) toast.error(summary.message);
      else toast.warning(summary.message);
      selection.clear();
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.permanentDeleteFailed")));
    } finally {
      setBulkBusy(false);
    }
  };

  const handlePermanentDelete = async (row) => {
    const ep = rowEndpoint(row);
    const label = rowLabel(row);
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("confirm.deletePermanently", { item: label }),
      confirmLabel: t("common.deletePermanently"),
      confirmColor: "error",
    });
    if (!ok) return;
    try {
      await permanentDelete(ep, row.id);
      toast.success(t("toast.permanentlyDeleted"));
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.permanentDeleteFailed")));
    }
  };

  const resourceLabel = isAll
    ? t("filters.allTypes")
    : t(`trashResources.${config.id}`, { defaultValue: config.title });

  const trashRowPreview = useMemo(
    () => ({
      title: t("pages.trash.title"),
      showOpenDetail: false,
      auditModel: (row) =>
        endpointToAuditModelName(row.endpoint || row.resource_id),
    }),
    [t]
  );

  return (
    <>
      <PageHeader
        title={t("pages.trash.title")}
        subtitle={t("pages.trash.subtitle")}
      />

      <TablePanel
        filters={
          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            dateFields={dateFilterFields}
            onReset={() => {
              resetFilters();
              setResourceId("");
              setPage(1);
            }}
            hasActiveFilters={hasActiveFilters || Boolean(activeResourceId)}
            searchPlaceholder={
              isAll
                ? t("pages.trash.searchAll")
                : t("pages.trash.search", {
                    resource: resourceLabel.toLowerCase(),
                  })
            }
            extra={
              <TableFilterSelectGrid>
                <TableFilterField>
                  <ProSelect
                    filterBar
                    label={t("filters.resourceType")}
                    value={resourceId}
                    onChange={(e) => {
                      setResourceId(e.target.value);
                      setPage(1);
                    }}
                    includeEmpty
                    emptyLabel={t("filters.allTypes")}
                    options={trashResources.map((r) => ({
                      value: r.id,
                      label: t(`trashResources.${r.id}`, { defaultValue: r.title }),
                    }))}
                    sx={TABLE_FILTER_SELECT_SX}
                  />
                </TableFilterField>
              </TableFilterSelectGrid>
            }
            exportEndpoint="trash"
            exportListParams={listParams}
            exportColumns={columnVisibility.displayColumns}
            exportFilenameBase={isAll ? "trash-all" : `trash-${config.id}`}
            exportTitle={
              isAll
                ? `${t("pages.trash.title")} — ${t("filters.allTypes")}`
                : `${t("pages.trash.title")} — ${resourceLabel}`
            }
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
          <TableBulkBar
            embedded
            selectedCount={selection.selectedCount}
            onClear={selection.clear}
            actions={[
              {
                id: "restore",
                label: t("common.restore"),
                icon: <RestoreOutlinedIcon sx={{ fontSize: 16 }} />,
                color: "success",
                onClick: runBulkRestore,
                disabled: bulkBusy,
              },
              {
                id: "delete-permanent",
                label: t("common.deletePermanently"),
                icon: <DeleteForeverOutlinedIcon sx={{ fontSize: 16 }} />,
                color: "error",
                onClick: runBulkPermanentDelete,
                disabled: bulkBusy,
              },
            ]}
          />
        }
      >
        <ResourceTable
          embedded
          columnStorageKey={`trash-${activeResourceId || "all"}`}
          displayColumns={columnVisibility.displayColumns}
          density={tableDensity.density}
          showColumnToggle={false}
          showDensityToggle={false}
          selectable
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
          sortField={tableSort.sort.field}
          sortDirection={tableSort.sort.desc ? "desc" : "asc"}
          sortIndex={tableSort.sortIndex}
          onColumnSort={tableSort.toggleColumnSort}
          emptyMessage={
            isAll
              ? t("pages.trash.emptyAll")
              : t("pages.trash.emptyType", {
                  resource: resourceLabel.toLowerCase(),
                })
          }
          rowPreview={trashRowPreview}
          actions={(row) => (
            <TableActions>
              <TableActionButton variant="restore" onClick={() => handleRestore(row)} />
              <TableActionButton
                variant="deletePermanent"
                onClick={() => handlePermanentDelete(row)}
              />
            </TableActions>
          )}
        />
      </TablePanel>

      <ConfirmDialog />
    </>
  );
}
