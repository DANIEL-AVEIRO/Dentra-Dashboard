import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Paper } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import FormDialogActions from "@/components/common/FormDialogActions";
import ActionButton from "@/components/common/ActionButton";
import ToolbarActionButton from "@/components/common/ToolbarActionButton";
import { FormCardSkeleton } from "@/components/common/skeletons";
import { FormField, ProTextField, DialogFormLayout } from "@/components/common/form";
import SearchableSelect, { normalizeOptions } from "@/components/common/SearchableSelect";
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
import ImageField from "@/components/common/ImageField";
import PermissionCheckboxesField from "@/components/common/PermissionCheckboxesField";
import PermissionMatrixField from "@/components/common/PermissionMatrixField";
import client from "@/api/client";
import { apiFieldErrorsForForm } from "@/utils/apiErrors";
import { toast, getErrorMessage } from "@/utils/toast";
import { serializeFormPayload, toBoolean } from "@/utils/boolean";
import { buildFormData, hasFilePayload } from "@/utils/formData";
import { isFieldRequired, validateResourceForm } from "@/utils/formValidation";
import { useTranslation } from "@/context/LanguageContext";
import { translateFields } from "@/i18n/helpers";
import { endpointToPageKey } from "@/utils/pageKeys";
import { mergeFilesIntoSlots } from "@/components/common/form/UploadDocumentGallery";
import CaseLineItemsEditor, {
  mapCaseLineItemsFromApi,
} from "@/components/cases/CaseLineItemsEditor";
import CaseFinancialSummary from "@/components/cases/CaseFinancialSummary";
import CaseNotesField from "@/components/cases/CaseNotesField";
import { resolveSelectValue } from "@/utils/displayValue";
import { pageShellSx, pageSectionPaperSx } from "@/constants/pageLayout";

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
  if (field.tmdype === "boolean") {
    return toBoolean(field.default, false);
  }
  if (
    field.type === "multiSelect" ||
    field.type === "permissionCheckboxes" ||
    field.type === "permissionMatrix"
  ) {
    return field.default ?? [];
  }
  if (field.type === "caseLineItems") {
    return field.default ?? [];
  }
  if (field.type === "caseFinancialSummary") {
    return null;
  }
  if (field.type === "caseNotes") {
    return field.default ?? "";
  }
  return field.default ?? "";
}

function buildFormFromRow(row, translatedFields, extraOptions = {}) {
  return translatedFields.reduce((acc, f) => {
    let val = row[f.name];
    if (f.type === "boolean") {
      val = toBoolean(val);
    } else if (f.type === "select" || f.type === "buttonSelect") {
      if (val && typeof val === "object") val = val.id ?? val;
      else val = resolveSelectValue(row, f, extraOptions[f.name] || []);
    } else if (f.type === "multiSelect") {
      val = resolveSelectValue(row, f, extraOptions[f.name] || []);
    } else if (f.type === "caseLineItems") {
      val = Array.isArray(row.line_items)
        ? row.line_items.map(mapCaseLineItemsFromApi)
        : [];
    } else if (f.type === "caseFinancialSummary") {
      val = null;
    } else if (f.type === "caseNotes") {
      acc[f.historyField] = Array.isArray(row[f.historyField])
        ? row[f.historyField]
        : [];
      val = "";
    } else if (
      f.type === "permissionCheckboxes" ||
      f.type === "permissionMatrix"
    ) {
      val = Array.isArray(val)
        ? val.map((item) =>
            typeof item === "object" && item != null ? (item.id ?? item) : item,
          )
        : [];
    } else {
      val = val ?? getDefaultValue(f);
    }
    return { ...acc, [f.name]: val };
  }, {});
}

export default function ResourceFormPanel({
  endpoint,
  fields,
  listPath,
  /** When set, show dual create actions that POST with different status values */
  createStatusActions = null,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();
  const pageKey = endpointToPageKey(endpoint);
  const displayTitle = t(`pages.${pageKey}.title`, { defaultValue: endpoint });

  const translatedFields = useMemo(
    () => translateFields(fields, t).map(normalizeFieldConfig),
    [fields, t, locale],
  );

  const [loading, setLoading] = useState(Boolean(id));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [extraOptions, setExtraOptions] = useState({});
  const [saveBusy, setSaveBusy] = useState(false);

  const emptyForm = useCallback(
    () =>
      translatedFields.reduce((acc, f) => {
        const next = { ...acc, [f.name]: getDefaultValue(f) };
        if (f.type === "caseNotes" && f.historyField) {
          next[f.historyField] = [];
        }
        return next;
      }, {}),
    [translatedFields],
  );

  const dependentParents = useMemo(
    () => [
      ...new Set(
        translatedFields.filter((f) => f.dependsOn).map((f) => f.dependsOn),
      ),
    ],
    [translatedFields],
  );

  useEffect(() => {
    if (id) return;
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setLoading(false);
  }, [id, emptyForm]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await client.get(`/${endpoint}/${id}/`);
        if (cancelled) return;
        setEditing(data);
        setForm(buildFormFromRow(data, translatedFields, extraOptions));
        setFormErrors({});
      } catch (err) {
        if (!cancelled) {
          toast.error(getErrorMessage(err, t("toast.loadFailed")));
          navigate(listPath);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, endpoint, listPath, navigate, t, translatedFields]);

  useEffect(() => {
    translatedFields
      .filter((f) => f.optionsFrom && !f.dependsOn)
      .forEach(async (f) => {
        const { data } = await client.get(`/${f.optionsFrom}/`);
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

  const handleCancel = () => navigate(listPath);

  const clearFieldError = (name) => {
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
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

  const renderField = (f) => {
    const isRequired = isFieldRequired(f, editing);
    const fieldError = formErrors[f.name];
    const patch =
      (value) =>
      (...args) => {
        clearFieldError(f.name);
        return value(...args);
      };

    if (f.type === "caseLineItems") {
      return (
        <Box key={f.name} sx={{ width: "100%" }}>
          <CaseLineItemsEditor
            value={form[f.name] ?? []}
            onChange={patch((rows) => setForm({ ...form, [f.name]: rows }))}
            error={fieldError}
          />
        </Box>
      );
    }

    if (f.type === "caseNotes") {
      return (
        <Box key={f.name} sx={{ width: "100%" }}>
          <CaseNotesField
            label={f.label}
            history={form[f.historyField] ?? []}
            value={form[f.name] ?? ""}
            onChange={patch((text) => setForm({ ...form, [f.name]: text }))}
            error={fieldError}
            rows={f.rows ?? 3}
          />
        </Box>
      );
    }

    if (f.type === "caseFinancialSummary") {
      return (
        <Box key={f.name} sx={{ width: "100%" }}>
          <CaseFinancialSummary lineItems={form.line_items ?? []} />
        </Box>
      );
    }

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

  const handleSave = async (options = {}) => {
    if (saveBusy) return;
    const { status: nextStatus, submitDraft = false } = options;
    const isDraftSave = nextStatus === "draft";
    const fieldsForValidation = translatedFields.map((f) =>
      f.name === "due_date" ? { ...f, required: !isDraftSave } : f,
    );

    const { valid, errors } = validateResourceForm(
      fieldsForValidation,
      form,
      editing,
      t,
    );
    const nextErrors = { ...errors };
    if (!isDraftSave && !form.clinic) {
      nextErrors.clinic = t("validation.required", {
        field: t("fields.clinic_name"),
      });
    }
    if (!isDraftSave && !(form.patient_name || "").trim()) {
      nextErrors.patient_name = t("validation.required", {
        field: t("fields.patient_name"),
      });
    }
    setFormErrors(nextErrors);
    if (!valid || Object.keys(nextErrors).length > Object.keys(errors).length) {
      toast.error(t("validation.formErrors"));
      return;
    }

    try {
      setSaveBusy(true);
      const useMultipart = hasFilePayload(form, translatedFields);
      const payload = useMultipart
        ? buildFormData(form, translatedFields)
        : serializeFormPayload(form, translatedFields);
      for (const field of translatedFields) {
        if (field.type === "caseFinancialSummary") {
          delete payload[field.name];
          continue;
        }
        if (field.type === "caseNotes") {
          if (field.historyField) delete payload[field.historyField];
          const note = (payload[field.name] || "").trim();
          if (note) payload[field.name] = note;
          else delete payload[field.name];
          continue;
        }
        if (field.type !== "caseLineItems") continue;
        payload[field.name] = (payload[field.name] || [])
          .filter((row) => row.restoration && row.material)
          .map((row, index) => {
            const item = {
              restoration: row.restoration,
              material: row.material,
              material_size: row.material_size || "",
              tooth_number: row.tooth_number || "",
              shade: row.shade || "",
              quantity: Number(row.quantity) || 1,
              sort_order: index,
            };
            if (row.unit_price !== "" && row.unit_price != null) {
              item.unit_price = Number(row.unit_price);
            }
            if (row.discount !== "" && row.discount != null) {
              item.discount = Number(row.discount) || 0;
            }
            if (row.id) item.id = row.id;
            return item;
          });
      }
      if (!useMultipart && editing && !payload.password) delete payload.password;
      if (nextStatus) payload.status = nextStatus;
      const config = useMultipart
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
      if (editing) {
        await client.patch(`/${endpoint}/${editing.id}/`, payload, config);
        toast.success(
          submitDraft
            ? t("pages.cases.caseCreated", { defaultValue: "Case created" })
            : t("toast.updated"),
        );
      } else {
        await client.post(`/${endpoint}/`, payload, config);
        toast.success(
          nextStatus === "draft"
            ? t("pages.cases.draftSaved", { defaultValue: "Draft saved" })
            : t("toast.created"),
        );
      }
      navigate(listPath);
    } catch (err) {
      const apiErrors = apiFieldErrorsForForm(
        err?.response?.data,
        translatedFields,
      );
      if (Object.keys(apiErrors).length > 0) {
        setFormErrors(apiErrors);
        toast.error(t("validation.formErrors"));
      } else {
        toast.error(
          getErrorMessage(err, t("toast.saveFailed"), translatedFields),
        );
      }
    } finally {
      setSaveBusy(false);
    }
  };

  const showStatusActions =
    Array.isArray(createStatusActions) &&
    createStatusActions.length > 0 &&
    (!editing || editing.status === "draft");

  const pageTitle = editing
    ? t("dialog.edit", { resource: displayTitle })
    : t("dialog.add", { resource: displayTitle });

  return (
    <Box sx={pageShellSx}>
      <PageHeader
        title={pageTitle}
        action={
          <ToolbarActionButton
            size="small"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={handleCancel}
          >
            {t("formPage.backToList")}
          </ToolbarActionButton>
        }
      />

      {loading ? (
        <FormCardSkeleton fields={Math.max(translatedFields.length, 4)} />
      ) : (
        <Paper elevation={0} sx={pageSectionPaperSx}>
          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (showStatusActions) {
                handleSave({ status: "received", submitDraft: Boolean(editing) });
              } else {
                handleSave();
              }
            }}
            sx={{ p: { xs: 2, sm: 2.5 } }}
          >
            <DialogFormLayout
              fields={translatedFields}
              renderField={renderField}
              formValues={form}
              existingRow={editing}
              onBulkSlotFiles={handleBulkSlotFiles}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2.5,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
                flexWrap: "wrap",
              }}
            >
              {showStatusActions ? (
                <>
                  <ToolbarActionButton
                    variant="cancel"
                    size="small"
                    onClick={handleCancel}
                    disabled={saveBusy}
                  >
                    {t("common.cancel")}
                  </ToolbarActionButton>
                  {createStatusActions.map((action) => (
                    <ActionButton
                      key={action.status}
                      type="button"
                      size="small"
                      intent={action.intent || (action.status === "draft" ? "save" : "create")}
                      disabled={saveBusy}
                      loading={saveBusy}
                      onClick={() =>
                        handleSave({
                          status: action.status,
                          submitDraft:
                            Boolean(editing) && action.status === "received",
                        })
                      }
                    >
                      {t(action.labelKey, {
                        defaultValue: action.defaultLabel || action.status,
                      })}
                    </ActionButton>
                  ))}
                </>
              ) : (
                <FormDialogActions
                  onCancel={handleCancel}
                  cancelLabel={t("common.cancel")}
                  confirmLabel={
                    saveBusy
                      ? t("common.saving", { defaultValue: "Saving..." })
                      : t("common.save")
                  }
                  confirmType="submit"
                  busy={saveBusy}
                />
              )}
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
