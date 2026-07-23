import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import TableActions, {
  TableActionButton,
} from "@/components/common/TableActions";
import ActionButton from "@/components/common/ActionButton";
import FormDialogActions from "@/components/common/FormDialogActions";
import ResourceListToolbar from "@/components/common/ResourceListToolbar";
import ResourceTable from "@/components/common/ResourceTable";
import ResourceCardGrid from "@/components/common/ResourceCardGrid";
import DefaultResourceListCard from "@/components/common/DefaultResourceListCard";
import TableBulkBar from "@/components/common/TableBulkBar";
import { useTableSelection } from "@/hooks/useTableSelection";
import {
  bulkDelete,
  bulkPermanentDelete,
  bulkRestore,
  bulkUpdate,
  permanentDelete,
  summarizeBulkResult,
} from "@/utils/bulkApi";
import { FormField, ProTextField } from "@/components/common/form";
import SearchableSelect, {
  normalizeOptions,
} from "@/components/common/SearchableSelect";
import SmoothDatePicker from "@/components/common/SmoothDatePicker";
import DateFieldWithPresets from "@/components/common/DateFieldWithPresets";
import OptionButtonGroup from "@/components/common/OptionButtonGroup";
import InlineCreateSelect from "@/components/common/InlineCreateSelect";
import SmoothTimePicker from "@/components/common/SmoothTimePicker";
import SmoothDateTimePicker from "@/components/common/SmoothDateTimePicker";
import {
  multilineTextFieldProps,
  normalizeFieldConfig,
  compactFieldSx,
  isActiveStatusFormField,
  activeStatusFieldMode,
} from "@/utils/fieldTypes";
import BooleanField from "@/components/common/BooleanField";
import ActiveStatusField from "@/components/common/ActiveStatusField";
import StarRatingField from "@/components/common/StarRatingField";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { resolveDateFilterFields } from "@/utils/dateFilterFields";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTableMultiSort } from "@/hooks/useTableMultiSort";
import { useListPageSize } from "@/hooks/useListPageSize";
import { useTableKeyboardNav } from "@/hooks/useTableKeyboardNav";
import { useResourceTableColumnVisibility } from "@/hooks/useResourceTableColumnVisibility";
import { useTableDensity } from "@/hooks/useTableDensity";
import { usePersistedListSearch } from "@/hooks/usePersistedListSearch";
import { useListPageParam } from "@/hooks/useListUrlParams";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import TableFilters from "@/components/common/TableFilters";
import TableColumnToggle from "@/components/common/TableColumnToggle";
import TableDensityToggle from "@/components/common/TableDensityToggle";
import TableFilterSelectGrid from "@/components/common/TableFilterSelectGrid";
import TableFilterField from "@/components/common/TableFilterField";
import TablePanel from "@/components/common/TablePanel";
import client from "@/api/client";
import { apiFieldErrorsForForm } from "@/utils/apiErrors";
import { toast, getErrorMessage } from "@/utils/toast";
import { serializeFormPayload, toBoolean } from "@/utils/boolean";
import { buildFormData, hasFilePayload } from "@/utils/formData";
import { isFieldRequired, validateResourceForm } from "@/utils/formValidation";
import ImageField from "@/components/common/ImageField";
import PermissionCheckboxesField from "@/components/common/PermissionCheckboxesField";
import PermissionMatrixField from "@/components/common/PermissionMatrixField";
import { useTranslation } from "@/context/LanguageContext";
import { translateColumns, translateFields } from "@/i18n/helpers";
import { endpointToPageKey } from "@/utils/pageKeys";
import { endpointToAuditModelName } from "@/utils/endpointAuditModel";
import {
  DialogFormLayout,
  resolveFormDialogMaxWidth,
  dialogFormContentSx,
  formDialogTitleSx,
  roleDialogActionsSx,
  roleDialogFormContentSx,
} from "@/components/common/form";
import { mergeFilesIntoSlots } from "@/components/common/form/UploadDocumentGallery";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";
import {
  isUuid,
  resolveSelectValue,
  rowLabelFromRow,
} from "@/utils/displayValue";
import { buildPreviewFieldsFromResource } from "@/utils/tableRowPreview";
import { trashUrlFromContext } from "@/utils/trashNavigation";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";

function resolveFieldPreviewUrl(field, row) {
  if (!row || field.type !== "file") return null;
  const key = field.previewKey || field.name;
  if (row[key]) return row[key];
  const urls = row.photo_urls;
  if (urls && typeof urls === "object") {
    if (urls[key]) return urls[key];
    const slot = /^photo_(\d+)$/.exec(field.name || "")?.[1];
    if (slot) return urls[`photo_${slot}_url`] ?? urls[`photo_${slot}`] ?? null;
  }
  return null;
}

function mergeInlineOption(list, option) {
  if (!option?.value && option?.value !== 0) return list;
  const id = String(option.value);
  if (list.some((o) => String(o.value) === id)) return list;
  return [option, ...list];
}

function getDefaultValue(field) {
  if (field.type === "file") {
    return field.default ?? null;
  }
  if (field.type === "boolean") {
    return toBoolean(field.default, false);
  }
  if (
    field.type === "multiSelect" ||
    field.type === "permissionCheckboxes" ||
    field.type === "permissionMatrix"
  ) {
    return field.default ?? [];
  }
  return field.default ?? "";
}

export default function ResourceListPage({
  endpoint,
  title,
  subtitle,
  columns,
  fields,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  trashMode = false,
  listParams: extraListParams = {},
  searchPlaceholder,
  filterExtra,
  bulkPatchFields = [],
  /** Override inline boolean PATCH keys (defaults to is_active when form has that field) */
  inlinePatchKeys: inlinePatchKeysProp,
  /** Override trash filter resource id (defaults to endpoint) */
  trashResourceId,
  /** Extra buttons in each row actions column */
  extraRowActions,
  formDialogMaxWidth = "sm",
  /** "default" | "role" — role uses a taller, sectioned permissions dialog */
  formDialogLayout = "default",
  /** "table" (default) or "cards" — requires renderCard when "cards" */
  layout = "table",
  renderCard,
  /** Partial override for table row offcanvas preview (e.g. imageUrls) */
  rowPreview: rowPreviewProp = null,
  /** When set, create/edit navigate to full-page form routes instead of modal */
  formPath,
  /** Override pages.* i18n key (defaults to endpoint) */
  pageKey: pageKeyProp,
  /** Show # column in the table (default true) */
  showRowNumbers = true,
}) {
  usePersistedListSearch();
  const navigate = useNavigate();
  const [page, setPage] = useListPageParam();
  const { pageSize, setPageSize, pageSizeOptions } = useListPageSize();
  const theme = useTheme();
  const isMobileList = useMediaQuery(theme.breakpoints.down("md"));
  const { t, locale } = useTranslation();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const pageKey = pageKeyProp || endpointToPageKey(endpoint);
  const trashTo = trashUrlFromContext({ endpoint, trashResourceId });
  const displayTitle = t(`pages.${pageKey}.title`, { defaultValue: title });
  const displaySubtitle = trashMode
    ? t("pages.trash.trashSubtitle")
    : t(`pages.${pageKey}.subtitle`, { defaultValue: subtitle });
  const translatedFields = useMemo(
    () => translateFields(fields, t).map(normalizeFieldConfig),
    [fields, t, locale],
  );

  const dialogMaxWidth = useMemo(
    () =>
      resolveFormDialogMaxWidth(translatedFields.length, formDialogMaxWidth),
    [translatedFields.length, formDialogMaxWidth],
  );

  const {
    filters,
    setFilter,
    resetFilters,
    removeFilterChip,
    queryParams: filterParams,
    debouncedSearch,
    hasActiveFilters,
  } = useTableFilters();

  const tableSort = useTableMultiSort(
    trashMode
      ? { defaultField: "deleted_at", defaultDesc: true }
      : { defaultField: "created_at", defaultDesc: true },
  );

  const listParams = {
    ...filterParams,
    ordering: tableSort.ordering,
    page_size: pageSize,
    ...(trashMode ? { deleted_only: true } : {}),
    ...extraListParams,
  };

  const { rows, count, loading, refreshing, refresh } = usePaginatedList(
    endpoint,
    {
      params: listParams,
      page,
      setPage,
    },
  );

  const resolvedColumns = useMemo(
    () => (typeof columns === "function" ? columns(rows) : columns),
    [columns, rows],
  );

  const translatedColumns = useMemo(
    () => translateColumns(resolvedColumns, t),
    [resolvedColumns, t, locale],
  );

  const columnVisibility = useResourceTableColumnVisibility(
    translatedColumns,
    endpoint,
  );
  const tableDensity = useTableDensity();
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);

  const dateFilterFields = useMemo(
    () =>
      resolveDateFilterFields(translatedColumns, {
        endpoint,
        trashMode,
      }),
    [translatedColumns, endpoint, trashMode],
  );

  const handleFilterChange = (key, value) => {
    setFilter(key, value);
    setPage(1);
  };

  const selection = useTableSelection("id");
  const [open, setOpen] = useState(false);
  const [previewRow, setPreviewRow] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [extraOptions, setExtraOptions] = useState({});
  const [bulkBusy, setBulkBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  const hasIsActiveField = translatedFields.some((f) => f.name === "is_active");
  const canBulkActivate =
    bulkPatchFields.includes("is_active") || hasIsActiveField;
  const useMobileCards = layout === "table" && isMobileList && !renderCard;
  const inlinePatchKeys =
    inlinePatchKeysProp !== undefined
      ? trashMode
        ? []
        : inlinePatchKeysProp
      : hasIsActiveField && !trashMode
        ? ["is_active"]
        : [];
  const copyableKeys = useMemo(
    () =>
      translatedColumns
        .filter(
          (col) =>
            col.copyable ||
            ["email", "phone", "username", "code"].includes(col.key),
        )
        .map((col) => col.key),
    [translatedColumns],
  );
  const pageSelectState = selection.pageSelectionState(rows);
  const showSelectAllMatching =
    pageSelectState.checked && !selection.allMatching && count > rows.length;

  const handleFilterChipRemove = useCallback(
    (key) => {
      removeFilterChip(key);
      setPage(1);
    },
    [removeFilterChip, setPage],
  );

  const handleInlinePatch = useCallback(
    async (row, key, value) => {
      try {
        await client.patch(`/${endpoint}/${row.id}/`, { [key]: value });
        toast.success(t("toast.updated"));
        refresh();
      } catch (err) {
        toast.error(
          getErrorMessage(err, t("toast.saveFailed"), translatedFields),
        );
      }
    },
    [endpoint, refresh, t],
  );

  useEffect(() => {
    translatedFields
      .filter((f) => f.optionsFrom && !f.dependsOn)
      .forEach(async (f) => {
        const { data } = await client.get(`/${f.optionsFrom}/`, {
          params: f.optionsQuery || undefined,
        });
        const list = data.results ?? data;
        const labelKey = f.optionLabelKey || "name";
        setExtraOptions((prev) => ({
          ...prev,
          [f.name]: list.map((item) => ({
            value: item.id,
            label:
              item[labelKey] ||
              item.username ||
              item.name ||
              item.key ||
              String(item.id),
            app_label: item.app_label,
            model: item.model,
            permission_name: item.permission_name,
            codename: item.codename,
          })),
        }));
      });
  }, [endpoint, translatedFields]);

  useEffect(() => {
    if (!editing) return;
    setForm((prev) => {
      let changed = false;
      const next = { ...prev };
      translatedFields.forEach((f) => {
        if (
          f.type !== "select" &&
          f.type !== "buttonSelect" &&
          f.type !== "multiSelect"
        )
          return;
        if (!f.optionsFrom && !f.options) return;
        const opts = f.options ?? extraOptions[f.name] ?? [];
        if (!opts.length) return;
        const resolved = resolveSelectValue(editing, f, opts);
        const current = prev[f.name];
        const empty =
          current == null ||
          current === "" ||
          (Array.isArray(current) && current.length === 0);
        if (
          empty &&
          resolved != null &&
          resolved !== "" &&
          resolved !== current
        ) {
          next[f.name] = resolved;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [editing, extraOptions, translatedFields]);

  const dependentParents = useMemo(
    () => [
      ...new Set(
        translatedFields.filter((f) => f.dependsOn).map((f) => f.dependsOn),
      ),
    ],
    [translatedFields],
  );

  useEffect(() => {
    translatedFields
      .filter((f) => f.optionsFrom && f.dependsOn)
      .forEach(async (f) => {
        const parentValue = form[f.dependsOn];
        if (!parentValue) {
          setExtraOptions((prev) => ({ ...prev, [f.name]: [] }));
          return;
        }
        const params =
          f.optionsQueryParam && parentValue
            ? { [f.optionsQueryParam]: parentValue }
            : f.optionsFrom === "townships" && parentValue
              ? { region: parentValue }
              : undefined;
        const { data } = await client.get(`/${f.optionsFrom}/`, { params });
        const list = data.results ?? data;
        const labelKey = f.optionLabelKey || "name";
        setExtraOptions((prev) => ({
          ...prev,
          [f.name]: list.map((item) => ({
            value: item.id,
            label:
              item[labelKey] ||
              item.username ||
              item.name ||
              item.key ||
              String(item.id),
          })),
        }));
      });
  }, [translatedFields, dependentParents.map((key) => form[key]).join("|")]);

  const emptyForm = () =>
    translatedFields.reduce(
      (acc, f) => ({ ...acc, [f.name]: getDefaultValue(f) }),
      {},
    );

  const clearFieldError = (name) => {
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const openCreate = () => {
    if (formPath) {
      navigate(`${formPath}/new`);
      return;
    }
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setOpen(true);
  };

  const openDetail = (row) => {
    setPreviewRow(row);
  };

  const openEdit = (row) => {
    if (formPath) {
      navigate(`${formPath}/${row.id}/edit`);
      return;
    }
    setPreviewRow(null);
    setEditing(row);
    setForm(
      translatedFields.reduce((acc, f) => {
        let val = row[f.name];
        if (f.type === "boolean") {
          val = toBoolean(val);
        } else if (f.type === "select" || f.type === "buttonSelect") {
          if (val && typeof val === "object") val = val.id ?? val;
          else val = resolveSelectValue(row, f, extraOptions[f.name] || []);
        } else if (f.type === "multiSelect") {
          val = resolveSelectValue(row, f, extraOptions[f.name] || []);
        } else if (
          f.type === "permissionCheckboxes" ||
          f.type === "permissionMatrix"
        ) {
          val = Array.isArray(val)
            ? val.map((item) =>
                typeof item === "object" && item != null
                  ? (item.id ?? item)
                  : item,
              )
            : [];
        } else {
          val = val ?? getDefaultValue(f);
        }
        return { ...acc, [f.name]: val };
      }, {}),
    );
    setFormErrors({});
    setOpen(true);
  };

  const openDuplicate = (row) => {
    setPreviewRow(null);
    setEditing(null);
    setForm(
      translatedFields.reduce((acc, f) => {
        if (f.type === "file") {
          return { ...acc, [f.name]: getDefaultValue(f) };
        }
        let val = row[f.name];
        if (f.type === "boolean") {
          val = toBoolean(val);
        } else if (f.type === "select" || f.type === "buttonSelect") {
          if (val && typeof val === "object") val = val.id ?? val;
          else val = resolveSelectValue(row, f, extraOptions[f.name] || []);
        } else if (f.type === "multiSelect") {
          val = resolveSelectValue(row, f, extraOptions[f.name] || []);
        } else if (
          f.type === "permissionCheckboxes" ||
          f.type === "permissionMatrix"
        ) {
          val = Array.isArray(val)
            ? val.map((item) =>
                typeof item === "object" && item != null
                  ? (item.id ?? item)
                  : item,
              )
            : [];
        } else {
          val = val ?? getDefaultValue(f);
        }
        if (
          typeof val === "string" &&
          val &&
          ["name", "title", "username", "code"].includes(f.name)
        ) {
          val = `${val} (copy)`;
        }
        return { ...acc, [f.name]: val };
      }, {}),
    );
    setFormErrors({});
    setOpen(true);
  };

  const statusFieldOptions = useMemo(
    () => translatedFields.find((f) => f.name === "status")?.options,
    [translatedFields],
  );

  const resourceRowPreview = useMemo(
    () => ({
      title: displayTitle,
      idKey: (row) => rowLabelFromRow(row, translatedColumns),
      fields: (row) =>
        buildPreviewFieldsFromResource({
          row,
          columns: translatedColumns,
          fields: translatedFields,
          t,
        }),
      statusList: statusFieldOptions,
      auditModel: endpointToAuditModelName(endpoint),
      onOpenDetail: (row) => (canEdit ? openEdit(row) : openDetail(row)),
      ...rowPreviewProp,
    }),
    [
      displayTitle,
      endpoint,
      translatedColumns,
      translatedFields,
      statusFieldOptions,
      t,
      extraOptions,
      rowPreviewProp,
      canEdit,
    ],
  );

  useTableKeyboardNav({
    rows,
    enabled: layout === "table" && !useMobileCards,
    onOpenRow: (row, { previewOnly }) => {
      if (previewOnly) setPreviewRow(row);
      else openDetail(row);
    },
    onClearSelection: () => {
      setPreviewRow(null);
      selection.clear();
    },
  });

  const handleSave = async () => {
    if (saveBusy) return;
    const { valid, errors } = validateResourceForm(
      translatedFields,
      form,
      editing,
      t,
    );
    setFormErrors(errors);
    if (!valid) {
      toast.error(t("validation.fixErrors"));
      return;
    }

    try {
      setSaveBusy(true);
      const useMultipart = hasFilePayload(form, translatedFields);
      const payload = useMultipart
        ? buildFormData(form, translatedFields)
        : serializeFormPayload(form, translatedFields);
      if (!useMultipart && editing && !payload.password)
        delete payload.password;
      const config = useMultipart
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
      if (editing) {
        await client.patch(`/${endpoint}/${editing.id}/`, payload, config);
        toast.success(t("toast.updated"));
      } else {
        await client.post(`/${endpoint}/`, payload, config);
        toast.success(t("toast.created"));
      }
      setOpen(false);
      refresh();
    } catch (err) {
      const apiErrors = apiFieldErrorsForForm(
        err?.response?.data,
        translatedFields,
      );
      if (Object.keys(apiErrors).length > 0) {
        setFormErrors(apiErrors);
        toast.error(t("validation.fixErrors"));
      } else {
        toast.error(
          getErrorMessage(err, t("toast.saveFailed"), translatedFields),
        );
      }
    } finally {
      setSaveBusy(false);
    }
  };

  const handleDelete = async (row) => {
    const ok = await confirm({
      title: t("confirm.title.moveToTrash"),
      message: t("confirm.moveToTrash", {
        item: displayTitle.slice(0, -1).toLowerCase(),
      }),
      confirmLabel: t("bulk.moveToTrash"),
      confirmColor: "error",
    });
    if (!ok) return;
    try {
      await client.delete(`/${endpoint}/${row.id}/`);
      toast.success(t("toast.deleted"));
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.deleteFailed")));
    }
  };

  const handleRestore = async (row) => {
    try {
      await client.post(`/${endpoint}/${row.id}/restore/`);
      toast.success(t("toast.restored"));
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.restoreFailed")));
    }
  };

  const handlePermanentDelete = async (row) => {
    const label = rowLabelFromRow(row, translatedColumns) || displayTitle;
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("confirm.deletePermanently", { item: label }),
      confirmLabel: t("common.deletePermanently"),
      confirmColor: "error",
    });
    if (!ok) return;
    try {
      await permanentDelete(endpoint, row.id);
      toast.success(t("toast.permanentlyDeleted"));
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.permanentDeleteFailed")));
    }
  };

  const handleBulkPermanentDelete = async () => {
    const ok = await confirm({
      title: t("confirm.title.deletePermanently"),
      message: t("confirm.deleteManyPermanently", {
        count: selection.selectedCount,
      }),
      confirmLabel: t("common.deletePermanently"),
      confirmColor: "error",
    });
    if (!ok) return;
    runBulk(
      (ids) => bulkPermanentDelete(endpoint, ids),
      t("bulk.permanentlyDeleted"),
    );
  };

  const runBulk = async (fn, successLabel) => {
    if (!selection.selectedCount) return;
    setBulkBusy(true);
    try {
      const ids = await selection.resolveBulkIds(endpoint, listParams);
      const data = await fn(ids);
      const summary = summarizeBulkResult(data, successLabel);
      if (summary.allOk) toast.success(summary.message);
      else if (summary.allFailed) toast.error(summary.message);
      else toast.warning(summary.message);
      selection.clear();
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, t("toast.bulkFailed")));
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkDelete = async () => {
    const ok = await confirm({
      title: t("confirm.title.moveToTrash"),
      message: t("confirm.moveManyToTrash", { count: selection.selectedCount }),
      confirmLabel: t("bulk.moveToTrash"),
      confirmColor: "error",
    });
    if (!ok) return;
    runBulk((ids) => bulkDelete(endpoint, ids), t("bulk.movedToTrash"));
  };

  const handleBulkRestore = async () => {
    const ok = await confirm({
      title: t("confirm.title.restore"),
      message: t("confirm.restoreMany", { count: selection.selectedCount }),
      confirmLabel: t("common.restore"),
      confirmColor: "success",
    });
    if (!ok) return;
    runBulk((ids) => bulkRestore(endpoint, ids), t("bulk.restored"));
  };

  const bulkActions = [];
  if (trashMode) {
    bulkActions.push(
      {
        id: "restore",
        label: t("common.restore"),
        icon: <RestoreOutlinedIcon sx={{ fontSize: 16 }} />,
        color: "success",
        onClick: handleBulkRestore,
        disabled: bulkBusy,
      },
      {
        id: "delete-permanent",
        label: t("common.deletePermanently"),
        icon: <DeleteForeverOutlinedIcon sx={{ fontSize: 16 }} />,
        color: "error",
        onClick: handleBulkPermanentDelete,
        disabled: bulkBusy,
      },
    );
  } else {
    if (canDelete) {
      bulkActions.push({
        id: "delete",
        label: t("bulk.moveToTrash"),
        icon: <DeleteOutlineIcon sx={{ fontSize: 16 }} />,
        color: "error",
        onClick: handleBulkDelete,
        disabled: bulkBusy,
      });
    }
    if (canBulkActivate) {
      bulkActions.push(
        {
          id: "activate",
          label: t("common.activate"),
          icon: <ToggleOnOutlinedIcon sx={{ fontSize: 16 }} />,
          color: "success",
          onClick: () =>
            runBulk(
              (ids) => bulkUpdate(endpoint, ids, { is_active: true }),
              t("bulk.activated"),
            ),
          disabled: bulkBusy,
        },
        {
          id: "deactivate",
          label: t("common.deactivate"),
          icon: <ToggleOffOutlinedIcon sx={{ fontSize: 16 }} />,
          onClick: () =>
            runBulk(
              (ids) => bulkUpdate(endpoint, ids, { is_active: false }),
              t("bulk.deactivated"),
            ),
          disabled: bulkBusy,
        },
      );
    }
  }

  const wrapFormField = (
    f,
    control,
    { skipWrap = false, helperText, description } = {},
  ) => {
    if (skipWrap) return control;
    const isRequired = isFieldRequired(f, editing);
    const fieldError = formErrors[f.name];
    const hint =
      helperText ??
      (f.requiredOnCreate && editing && f.type === "password"
        ? t("fields.passwordKeep")
        : f.helperText);

    return (
      <FormField
        key={f.name}
        id={f.name}
        label={f.label}
        required={isRequired}
        error={fieldError}
        helperText={hint}
        description={description ?? f.description}
        controlFullWidth={f.type !== "file" && f.fullWidth !== false}
      >
        {control}
      </FormField>
    );
  };

  const applyFieldChange = (f, value) => {
    const next = { ...form, [f.name]: value };
    for (const key of f.clearsFields ?? []) {
      const child = translatedFields.find((x) => x.name === key);
      next[key] = child ? getDefaultValue(child) : "";
    }
    setForm(next);
  };

  const handleBulkSlotFiles = (slotFields, fileList) => {
    const result = mergeFilesIntoSlots(slotFields, form, editing, fileList);
    if (result.updates && Object.keys(result.updates).length > 0) {
      setForm((prev) => ({ ...prev, ...result.updates }));
    }
    return result;
  };

  const renderField = (f) => {
    const isRequired = isFieldRequired(f, editing);
    const fieldError = formErrors[f.name];
    const patch =
      (value) =>
      (...args) => {
        clearFieldError(f.name);
        return value(...args);
      };

    if (isActiveStatusFormField(f)) {
      const mode = activeStatusFieldMode(f);
      return wrapFormField(
        f,
        <ActiveStatusField
          value={form[f.name]}
          onChange={patch((next) => setForm({ ...form, [f.name]: next }))}
          activeLabel={f.activeLabel}
          inactiveLabel={f.inactiveLabel}
          mode={mode}
          disabled={f.disabled}
          aria-label={f.label}
        />,
        { description: undefined },
      );
    }

    if (f.type === "boolean") {
      return wrapFormField(
        f,
        <BooleanField
          label={f.label}
          description={f.description}
          value={form[f.name]}
          onChange={patch((checked) => setForm({ ...form, [f.name]: checked }))}
          activeLabel={f.activeLabel}
          inactiveLabel={f.inactiveLabel}
          showLabel={false}
        />,
        { description: undefined },
      );
    }

    if (f.type === "buttonSelect") {
      const options = f.options ?? extraOptions[f.name] ?? [];
      const parentMissing = f.dependsOn && !form[f.dependsOn];
      return wrapFormField(
        f,
        <OptionButtonGroup
          value={form[f.name]}
          onChange={patch((v) => applyFieldChange(f, v))}
          options={options}
          disabled={f.disabled || parentMissing}
          valueKey={f.optionValueKey || "id"}
          labelKey={f.optionLabelKey || "name"}
        />,
      );
    }

    if (f.type === "select") {
      const options = f.options ?? extraOptions[f.name] ?? [];
      const parentMissing = f.dependsOn && !form[f.dependsOn];
      const selectPlaceholder = parentMissing
        ? t(f.dependsOnPlaceholderKey || "filters.selectRegionFirst", {
            defaultValue: "Select parent first",
          })
        : f.placeholderKey
          ? t(f.placeholderKey)
          : f.placeholder;

      if (f.inlineCreate) {
        return wrapFormField(
          f,
          <InlineCreateSelect
            value={form[f.name]}
            onChange={patch((v) => applyFieldChange(f, v))}
            options={options}
            inlineCreate={f.inlineCreate}
            parentForm={form}
            placeholder={selectPlaceholder}
            required={isRequired}
            disabled={f.disabled}
            parentMissing={parentMissing}
            error={Boolean(fieldError)}
            onCreated={(item, created) => {
              setExtraOptions((prev) => ({
                ...prev,
                [f.name]: mergeInlineOption(prev[f.name] || [], created),
              }));
            }}
          />,
        );
      }

      return wrapFormField(
        f,
        <SearchableSelect
          id={`field-${f.name}`}
          labelPlacement="top"
          value={form[f.name]}
          onChange={patch((v) => applyFieldChange(f, v))}
          options={normalizeOptions(options)}
          placeholder={selectPlaceholder}
          openOnFocus
          searchable
          required={isRequired}
          clearable={!isRequired}
          disabled={f.disabled || parentMissing}
          error={Boolean(fieldError)}
        />,
      );
    }

    if (f.type === "permissionMatrix") {
      const options = normalizeOptions(f.options ?? extraOptions[f.name] ?? []);
      return (
        <PermissionMatrixField
          key={f.name}
          label={f.label}
          value={form[f.name] || []}
          onChange={patch((ids) => setForm({ ...form, [f.name]: ids }))}
          options={options}
          searchPlaceholder={
            f.placeholder ??
            (f.placeholderKey ? t(f.placeholderKey) : undefined)
          }
          required={isRequired}
          error={Boolean(fieldError)}
          helperText={fieldError || f.helperText}
        />
      );
    }

    if (f.type === "permissionCheckboxes") {
      const options = normalizeOptions(f.options ?? extraOptions[f.name] ?? []);
      return (
        <PermissionCheckboxesField
          key={f.name}
          label={f.label}
          value={form[f.name] || []}
          onChange={patch((ids) => setForm({ ...form, [f.name]: ids }))}
          options={options}
          searchPlaceholder={
            f.placeholder ??
            (f.placeholderKey ? t(f.placeholderKey) : undefined)
          }
          required={isRequired}
          error={Boolean(fieldError)}
          helperText={fieldError || f.helperText}
        />
      );
    }

    if (f.type === "multiSelect") {
      const options = normalizeOptions(f.options ?? extraOptions[f.name] ?? []);
      return wrapFormField(
        f,
        <SearchableSelect
          id={`field-${f.name}`}
          labelPlacement="top"
          multiple
          value={form[f.name] || []}
          onChange={patch((ids) => setForm({ ...form, [f.name]: ids }))}
          options={options}
          placeholder={f.placeholder}
          openOnFocus
          searchable
          required={isRequired}
          clearable={!isRequired}
          error={Boolean(fieldError)}
        />,
      );
    }

    if (f.type === "starRating") {
      return wrapFormField(
        f,
        <StarRatingField
          value={form[f.name]}
          onChange={patch((v) => setForm({ ...form, [f.name]: v }))}
          max={f.maxStars ?? 5}
          disabled={f.disabled}
        />,
      );
    }

    if (f.type === "file") {
      const control = (
        <ImageField
          label={f.label}
          showLabel={false}
          fullWidth={Boolean(
            f.fullWidthUpload || f.uploadVariant === "documentCard",
          )}
          compact={Boolean(f.uploadCompact)}
          variant={f.uploadVariant || "default"}
          documentCardPreset={f.documentCardPreset}
          value={form[f.name]}
          previewUrl={resolveFieldPreviewUrl(f, editing)}
          onChange={patch((file) => setForm({ ...form, [f.name]: file }))}
          gallerySlot={Boolean(f.uploadGallerySlot)}
          accept={f.accept}
          required={isRequired}
          error={fieldError}
        />
      );
      if (f.uploadGallerySlot) {
        return <Box key={f.name}>{control}</Box>;
      }
      return wrapFormField(f, control);
    }

    if (f.type === "date") {
      const dateControl = f.datePresets ? (
        <DateFieldWithPresets
          placeholder={f.placeholder}
          value={form[f.name] ?? ""}
          onChange={patch((v) => applyFieldChange(f, v))}
          disabled={f.disabled}
          minDate={f.minDate}
          maxDate={f.maxDate}
          error={Boolean(fieldError)}
        />
      ) : (
        <SmoothDatePicker
          hideLabel
          fullWidth
          placeholder={f.placeholder}
          value={form[f.name] ?? ""}
          onChange={patch((v) => applyFieldChange(f, v))}
          disabled={f.disabled}
          minDate={f.minDate}
          maxDate={f.maxDate}
          error={Boolean(fieldError)}
        />
      );
      return wrapFormField(f, dateControl);
    }

    if (f.type === "time") {
      return wrapFormField(
        f,
        <SmoothTimePicker
          hideLabel
          fullWidth
          placeholder={f.placeholder}
          value={form[f.name] ?? ""}
          onChange={patch((v) => applyFieldChange(f, v))}
          disabled={f.disabled}
          error={Boolean(fieldError)}
        />,
      );
    }

    if (f.type === "datetime") {
      return wrapFormField(
        f,
        <SmoothDateTimePicker
          hideLabel
          fullWidth
          placeholder={f.placeholder}
          value={form[f.name] ?? ""}
          onChange={patch((v) => applyFieldChange(f, v))}
          disabled={f.disabled}
          minDateTime={f.minDateTime}
          maxDateTime={f.maxDateTime}
          error={Boolean(fieldError)}
        />,
      );
    }

    return wrapFormField(
      f,
      <ProTextField
        id={`field-${f.name}`}
        labelPlacement="outlined"
        fullWidth={f.fullWidth !== false}
        type={f.type || "text"}
        placeholder={f.placeholder}
        value={form[f.name]}
        onChange={patch((e) => applyFieldChange(f, e.target.value))}
        required={isRequired}
        error={Boolean(fieldError)}
        disabled={f.disabled}
        sx={compactFieldSx(f)}
        {...multilineTextFieldProps(f)}
      />,
    );
  };

  const isRoleDialog = formDialogLayout === "role";

  const renderRowActions = (row) => (
    <TableActions>
      {trashMode ? (
        <>
          <TableActionButton
            variant="restore"
            onClick={() => handleRestore(row)}
          />
          <TableActionButton
            variant="deletePermanent"
            onClick={() => handlePermanentDelete(row)}
          />
        </>
      ) : (
        <>
          <TableActionButton variant="view" onClick={() => openDetail(row)} />
          {canEdit ? (
            <TableActionButton variant="edit" onClick={() => openEdit(row)} />
          ) : null}
          {canCreate ? (
            <TableActionButton
              variant="duplicate"
              onClick={() => openDuplicate(row)}
            />
          ) : null}
          {extraRowActions?.(row, { refresh })}
          {canDelete ? (
            <TableActionButton
              variant="delete"
              onClick={() => handleDelete(row)}
            />
          ) : null}
        </>
      )}
    </TableActions>
  );

  const pageContent = (
    <>
      <ResourceListToolbar
        title={
          trashMode
            ? `${displayTitle} ${t("pages.trash.trashSuffix")}`
            : displayTitle
        }
        subtitle={displaySubtitle}
        addLabel={t("common.add")}
        onAdd={!trashMode && canCreate ? openCreate : undefined}
        showTrash={!trashMode && canDelete}
        trashTo={trashTo}
      />

      <TablePanel
        filters={
          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            dateFields={dateFilterFields}
            onReset={() => {
              resetFilters();
              setPage(1);
            }}
            hasActiveFilters={hasActiveFilters}
            searchPlaceholder={
              searchPlaceholder ??
              t(`pages.${pageKey}.search`, {
                defaultValue: `Search ${displayTitle.toLowerCase()}...`,
              })
            }
            extra={
              filterExtra ? (
                <TableFilterSelectGrid>
                  {typeof filterExtra === "function"
                    ? filterExtra({
                        filters,
                        onFilterChange: handleFilterChange,
                      })
                    : filterExtra}
                </TableFilterSelectGrid>
              ) : null
            }
            exportEndpoint={endpoint}
            exportListParams={listParams}
            exportColumns={columnVisibility.displayColumns}
            exportFilenameBase={trashMode ? `${endpoint}-trash` : endpoint}
            exportTitle={displayTitle}
            exportDisabled={loading}
            onRefresh={refresh}
            refreshing={refreshing}
            onFilterChipRemove={handleFilterChipRemove}
            autoRefreshInterval={autoRefreshInterval}
            onAutoRefreshIntervalChange={setAutoRefreshInterval}
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
            actions={bulkActions}
            totalMatchingCount={count}
            allMatching={selection.allMatching}
            showSelectAllMatching={showSelectAllMatching}
            onSelectAllMatching={() => selection.selectAllMatching(count)}
          />
        }
      >
        {layout === "cards" && renderCard ? (
          <ResourceCardGrid
            embedded
            selectable
            selectedIds={selection.selectedIds}
            onToggleRow={selection.toggle}
            onToggleAllPage={selection.toggleAllOnPage}
            pageSelectState={selection.pageSelectionState(rows)}
            rows={rows}
            count={count}
            page={page}
            onPageChange={setPage}
            loading={loading}
            refreshing={refreshing}
            renderCard={(row, ctx) =>
              renderCard(row, {
                ...ctx,
                actions: (
                  <TableActions>
                    {trashMode ? (
                      <>
                        <TableActionButton
                          variant="restore"
                          onClick={() => handleRestore(row)}
                        />
                        <TableActionButton
                          variant="deletePermanent"
                          onClick={() => handlePermanentDelete(row)}
                        />
                      </>
                    ) : (
                      <>
                        <TableActionButton
                          variant="view"
                          onClick={() => openDetail(row)}
                        />
                        {canEdit ? (
                          <TableActionButton
                            variant="edit"
                            onClick={() => openEdit(row)}
                          />
                        ) : null}
                        {canCreate ? (
                          <TableActionButton
                            variant="duplicate"
                            onClick={() => openDuplicate(row)}
                          />
                        ) : null}
                        {extraRowActions?.(row)}
                        {canDelete && (
                          <TableActionButton
                            variant="delete"
                            onClick={() => handleDelete(row)}
                          />
                        )}
                      </>
                    )}
                  </TableActions>
                ),
              })
            }
          />
        ) : useMobileCards ? (
          <ResourceCardGrid
            embedded
            selectable
            selectedIds={selection.selectedIds}
            onToggleRow={selection.toggle}
            onToggleAllPage={() => selection.toggleAllOnPage(rows)}
            pageSelectState={pageSelectState}
            rows={rows}
            count={count}
            page={page}
            onPageChange={setPage}
            loading={loading}
            refreshing={refreshing}
            renderCard={(row, ctx) => (
              <DefaultResourceListCard
                row={row}
                columns={columnVisibility.displayColumns}
                actions={renderRowActions(row)}
              />
            )}
          />
        ) : (
          <ResourceTable
            embedded
            columnStorageKey={endpoint}
            displayColumns={columnVisibility.displayColumns}
            density={tableDensity.density}
            showColumnToggle={false}
            showDensityToggle={false}
            selectable
            selectedIds={selection.selectedIds}
            isRowSelected={selection.isSelected}
            onToggleRow={selection.toggle}
            onToggleAllPage={() => selection.toggleAllOnPage(rows)}
            pageSelectState={pageSelectState}
            columns={translatedColumns}
            rows={rows}
            count={count}
            page={page}
            onPageChange={setPage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={setPageSize}
            rowsPerPageOptions={pageSizeOptions}
            showRowNumbers={showRowNumbers}
            rowNumberOffset={(page - 1) * pageSize}
            loading={loading}
            refreshing={refreshing}
            highlightQuery={debouncedSearch}
            sortField={tableSort.sort.field}
            sortDirection={tableSort.sort.desc ? "desc" : "asc"}
            sortIndex={tableSort.sortIndex}
            onColumnSort={tableSort.toggleColumnSort}
            onInlinePatch={handleInlinePatch}
            inlinePatchKeys={inlinePatchKeys}
            copyableKeys={copyableKeys}
            previewRow={previewRow}
            onPreviewRowChange={setPreviewRow}
            rowPreview={resourceRowPreview}
            actions={renderRowActions}
          />
        )}
      </TablePanel>

      {!trashMode && !formPath && (
        <ResponsiveDialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth={dialogMaxWidth}
          fullWidth
          scroll="paper"
          slotProps={
            isRoleDialog
              ? {
                  paper: {
                    sx: {
                      borderRadius: 2.5,
                      overflow: "hidden",
                      maxHeight: "min(92dvh, 900px)",
                      display: "flex",
                      flexDirection: "column",
                    },
                  },
                }
              : undefined
          }
        >
          <DialogTitle
            sx={{
              ...formDialogTitleSx,
              borderBottom: isRoleDialog ? 1 : 0,
              borderColor: "divider",
            }}
          >
            <Typography
              component="span"
              variant="h6"
              fontWeight={700}
              lineHeight={1.3}
            >
              {editing
                ? t("dialog.edit", { resource: displayTitle })
                : t("dialog.add", { resource: displayTitle })}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              aria-label={t("common.close", { defaultValue: "Close" })}
              sx={{
                color: "text.secondary",
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.text.primary, 0.08),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            sx={
              isRoleDialog
                ? {
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    flex: 1,
                  }
                : undefined
            }
          >
            <DialogContent
              dividers={!isRoleDialog}
              sx={isRoleDialog ? roleDialogFormContentSx : dialogFormContentSx}
            >
              {isRoleDialog ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    minHeight: 0,
                    flex: 1,
                  }}
                >
                  {translatedFields
                    .filter((f) => !f.hideInForm && f.name === "name")
                    .map((f) => renderField(f))}
                  <Divider sx={{ my: 2.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                      flex: 1,
                    }}
                  >
                    {translatedFields
                      .filter((f) => !f.hideInForm && f.name !== "name")
                      .map((f) => renderField(f))}
                  </Box>
                </Box>
              ) : (
                <DialogFormLayout
                  fields={translatedFields}
                  renderField={renderField}
                  formValues={form}
                  existingRow={editing}
                  onBulkSlotFiles={handleBulkSlotFiles}
                />
              )}
            </DialogContent>
            <DialogActions
              sx={isRoleDialog ? roleDialogActionsSx : formDialogActionsSx}
            >
              <FormDialogActions
                onCancel={() => setOpen(false)}
                cancelLabel={t("common.cancel")}
                confirmLabel={
                  saveBusy
                    ? t("common.saving", { defaultValue: "Saving..." })
                    : t("common.save")
                }
                confirmType="submit"
                busy={saveBusy}
              />
            </DialogActions>
          </Box>
        </ResponsiveDialog>
      )}
    </>
  );

  return (
    <>
      {pageContent}
      <ConfirmDialog />
    </>
  );
}
