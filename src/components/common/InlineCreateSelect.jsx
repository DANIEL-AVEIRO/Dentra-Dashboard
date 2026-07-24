import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import client from "@/api/client";
import ResponsiveDialog from "@/components/common/ResponsiveDialog";
import FormDialogActions from "@/components/common/FormDialogActions";
import { formDialogActionsSx } from "@/components/common/statusDialogLayout";
import SearchableSelect, {
  normalizeOptions,
} from "@/components/common/SearchableSelect";
import { FormField, ProTextField } from "@/components/common/form";
import { dialogFormContentSx } from "@/components/common/form/formLayout";
import { FIELD_MIN_HEIGHT, FIELD_RADIUS } from "@/components/common/form/fieldStyles";
import { useTranslation } from "@/context/LanguageContext";
import { apiFieldErrorsForForm } from "@/utils/apiErrors";
import { toast, getErrorMessage } from "@/utils/toast";

function mergeOption(list, option) {
  if (!option?.value && option?.value !== 0) return list;
  const id = String(option.value);
  if (list.some((o) => String(o.value) === id)) return list;
  return [option, ...list];
}

function emptyInlineForm(fields = [], parentForm = {}) {
  return fields.reduce((acc, field) => {
    if (field.defaultFromParent && parentForm[field.defaultFromParent]) {
      const parentVal = parentForm[field.defaultFromParent];
      acc[field.name] =
        field.type === "multiSelect" ? [parentVal] : parentVal;
    } else if (field.type === "multiSelect") {
      acc[field.name] = [];
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {});
}

function buildInlinePayload(inlineForm, inlineCreate, parentForm) {
  const payload = { ...inlineForm };
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") delete payload[key];
  });

  const fromForm = inlineCreate.payloadFromForm || {};
  Object.entries(fromForm).forEach(([key, spec]) => {
    if (typeof spec === "function") {
      payload[key] = spec(parentForm);
      return;
    }
    if (typeof spec === "string") {
      const val = parentForm[spec];
      payload[key] = Array.isArray(val) ? val : val ? [val] : [];
    }
  });

  return payload;
}

export default function InlineCreateSelect({
  value,
  onChange,
  options = [],
  inlineCreate,
  parentForm = {},
  onCreated,
  placeholder,
  required = false,
  disabled = false,
  parentMissing = false,
  error = false,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inlineForm, setInlineForm] = useState(() =>
    emptyInlineForm(inlineCreate?.fields, parentForm),
  );
  const [inlineErrors, setInlineErrors] = useState({});
  const [fieldOptions, setFieldOptions] = useState({});
  const [saving, setSaving] = useState(false);

  const createFields = useMemo(
    () =>
      (inlineCreate?.fields || []).map((field) => ({
        ...field,
        label: field.labelKey
          ? t(field.labelKey)
          : t(`fields.${field.name}`, { defaultValue: field.label ?? field.name }),
      })),
    [inlineCreate?.fields, t],
  );

  const requiresField = inlineCreate?.requires;
  const requiresMissing = requiresField && !parentForm[requiresField];
  const createDisabled = disabled || parentMissing || requiresMissing;

  const openDialog = () => {
    setInlineForm(emptyInlineForm(inlineCreate?.fields, parentForm));
    setInlineErrors({});
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;

    const fields = inlineCreate?.fields || [];
    const toLoad = fields.filter((field) => field.optionsFrom);
    if (!toLoad.length) {
      setFieldOptions({});
      return undefined;
    }

    let cancelled = false;
    (async () => {
      const next = {};
      await Promise.all(
        toLoad.map(async (field) => {
          try {
            const { data } = await client.get(`/${field.optionsFrom}/`);
            const list = data.results ?? data;
            const labelKey = field.optionLabelKey || "name";
            next[field.name] = list.map((item) => ({
              value: item.id,
              label: item[labelKey] || item.name || String(item.id),
            }));
          } catch {
            next[field.name] = [];
          }
        }),
      );
      if (!cancelled) setFieldOptions(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, inlineCreate?.fields]);

  const closeDialog = () => {
    if (saving) return;
    setOpen(false);
  };

  const handleSave = async () => {
    const nextErrors = {};
    createFields.forEach((field) => {
      const val = inlineForm[field.name];
      if (field.type === "multiSelect") {
        if (field.required && (!Array.isArray(val) || val.length === 0)) {
          nextErrors[field.name] = t("validation.required", {
            field: field.label,
            defaultValue: "This field is required.",
          });
        }
        return;
      }
      if (field.required && !String(val ?? "").trim()) {
        nextErrors[field.name] = t("validation.required", {
          field: field.label,
          defaultValue: "This field is required.",
        });
      }
    });
    if (Object.keys(nextErrors).length) {
      setInlineErrors(nextErrors);
      return;
    }

    try {
      setSaving(true);
      const payload = buildInlinePayload(inlineForm, inlineCreate, parentForm);
      const { data } = await client.post(`/${inlineCreate.endpoint}/`, payload);
      const labelKey = inlineCreate.optionLabelKey || "name";
      const created = {
        value: data.id,
        label: data[labelKey] || data.name || String(data.id),
      };
      onCreated?.(data, created);
      onChange?.(data.id);
      toast.success(t("toast.created"));
      setOpen(false);
    } catch (err) {
      const apiErrors = apiFieldErrorsForForm(err?.response?.data, createFields);
      if (Object.keys(apiErrors).length) {
        setInlineErrors(apiErrors);
        toast.error(t("validation.fixErrors"));
      } else {
        toast.error(
          getErrorMessage(err, t("toast.saveFailed"), createFields),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ flex: 1, minWidth: 0, "& .MuiFormControl-root": { my: 0 } }}>
          <SearchableSelect
            labelPlacement="top"
            value={value}
            onChange={onChange}
            options={normalizeOptions(options)}
            placeholder={placeholder}
            openOnFocus
            searchable
            required={required}
            clearable={!required}
            disabled={disabled || parentMissing}
            error={error}
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          disabled={createDisabled}
          onClick={openDialog}
          title={
            requiresMissing
              ? t(inlineCreate.requiresMessageKey, {
                  defaultValue: "Select clinic first",
                })
              : undefined
          }
          sx={{
            flexShrink: 0,
            height: FIELD_MIN_HEIGHT,
            minHeight: FIELD_MIN_HEIGHT,
            px: 1.25,
            borderRadius: `${FIELD_RADIUS}px`,
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {t(inlineCreate.buttonKey || "inlineCreate.new", {
            defaultValue: "New",
          })}
        </Button>
      </Stack>

      <ResponsiveDialog open={open} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {t(inlineCreate.titleKey, {
            defaultValue: inlineCreate.title || "Add new",
          })}
        </DialogTitle>
        <DialogContent sx={dialogFormContentSx}>
          <Stack spacing={2}>
            {createFields.map((field) => (
              <FormField
                key={field.name}
                id={`inline-${field.name}`}
                label={field.label}
                required={field.required}
                error={inlineErrors[field.name]}
              >
                {field.type === "multiSelect" ? (
                  <SearchableSelect
                    labelPlacement="top"
                    multiple
                    value={inlineForm[field.name] || []}
                    onChange={(ids) => {
                      setInlineForm((prev) => ({
                        ...prev,
                        [field.name]: ids,
                      }));
                      setInlineErrors((prev) => {
                        if (!prev[field.name]) return prev;
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }}
                    options={normalizeOptions(fieldOptions[field.name] || [])}
                    openOnFocus
                    searchable
                    required={field.required}
                    clearable={!field.required}
                    error={Boolean(inlineErrors[field.name])}
                  />
                ) : (
                  <ProTextField
                    id={`inline-field-${field.name}`}
                    labelPlacement="outlined"
                    fullWidth
                    type={field.type || "text"}
                    value={inlineForm[field.name] ?? ""}
                    onChange={(e) => {
                      setInlineForm((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }));
                      setInlineErrors((prev) => {
                        if (!prev[field.name]) return prev;
                        const next = { ...prev };
                        delete next[field.name];
                        return next;
                      });
                    }}
                    required={field.required}
                    error={Boolean(inlineErrors[field.name])}
                  />
                )}
              </FormField>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={formDialogActionsSx}>
          <FormDialogActions
            onCancel={closeDialog}
            onConfirm={handleSave}
            cancelLabel={t("common.cancel")}
            confirmLabel={t("common.save")}
            busy={saving}
          />
        </DialogActions>
      </ResponsiveDialog>
    </>
  );
}
