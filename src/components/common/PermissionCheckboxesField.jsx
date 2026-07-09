import { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Typography,
  alpha,
} from "@mui/material";
import { ProTextField } from "@/components/common/form";
import { useTranslation } from "@/context/LanguageContext";
import { BRAND_PRIMARY } from "@/theme";

function appLabelFromOption(option) {
  if (option.app_label) return option.app_label;
  const label = String(option.label || "");
  const sep = label.indexOf(" · ");
  return sep >= 0 ? label.slice(0, sep) : "other";
}

function permissionLabel(option) {
  if (option.permission_name) return option.permission_name;
  const label = String(option.label || "");
  const sep = label.indexOf(" · ");
  return sep >= 0 ? label.slice(sep + 3) : label;
}

function groupByApp(options) {
  const groups = new Map();
  for (const option of options) {
    const app = appLabelFromOption(option);
    if (!groups.has(app)) groups.set(app, []);
    groups.get(app).push({
      ...option,
      displayLabel: permissionLabel(option),
    });
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function normalizeSelectedIds(value) {
  if (!Array.isArray(value)) return new Set();
  return new Set(
    value.map((item) =>
      String(typeof item === "object" && item != null ? item.id ?? item : item)
    )
  );
}

function toPayloadIds(selectedSet) {
  return [...selectedSet].map((id) => {
    const num = Number(id);
    return Number.isNaN(num) ? id : num;
  });
}

/**
 * Permission picker — grouped checkboxes by Django app (replaces multi-select).
 */
export default function PermissionCheckboxesField({
  label,
  value = [],
  onChange,
  options = [],
  searchPlaceholder,
  error = false,
  helperText,
  required = false,
  selectAllGroupLabel,
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const groupSelectAll =
    selectAllGroupLabel ??
    t("pages.roles.selectAllInGroup", { defaultValue: "select all" });
  const selected = useMemo(() => normalizeSelectedIds(value), [value]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? options.filter((o) => {
          const hay = `${appLabelFromOption(o)} ${permissionLabel(o)} ${o.label || ""} ${o.codename || ""}`.toLowerCase();
          return hay.includes(q);
        })
      : options;
    return groupByApp(filtered);
  }, [options, query]);

  const setSelected = (next) => {
    onChange?.(toPayloadIds(next));
  };

  const toggleOne = (id, checked) => {
    const next = new Set(selected);
    const key = String(id);
    if (checked) next.add(key);
    else next.delete(key);
    setSelected(next);
  };

  const toggleGroup = (items, checked) => {
    const next = new Set(selected);
    for (const item of items) {
      const key = String(item.value);
      if (checked) next.add(key);
      else next.delete(key);
    }
    setSelected(next);
  };

  const selectedCount = selected.size;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <FormLabel required={required} sx={{ fontWeight: 600, color: "text.primary" }}>
          {label}
        </FormLabel>
        {selectedCount > 0 ? (
          <Typography variant="caption" color="text.secondary">
            {t("pages.roles.selectedCount", {
              count: selectedCount,
              defaultValue: "{{count}} selected",
            })}
          </Typography>
        ) : null}
      </Box>

      {searchPlaceholder ? (
        <ProTextField
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 1.25 }}
        />
      ) : null}

      <Box
        sx={{
          maxHeight: 380,
          overflow: "auto",
          border: 1,
          borderColor: error ? "error.main" : "divider",
          borderRadius: 1.5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.02)
              : alpha(BRAND_PRIMARY, 0.02),
          p: 1,
        }}
      >
        {grouped.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, px: 1 }}>
            No permissions match your search.
          </Typography>
        ) : (
          grouped.map(([app, items]) => {
            const allChecked = items.every((i) => selected.has(String(i.value)));
            const someChecked = items.some((i) => selected.has(String(i.value)));
            return (
              <Box key={app} sx={{ mb: 1.5, "&:last-child": { mb: 0 } }}>
                <FormControlLabel
                  sx={{ ml: 0, alignItems: "flex-start" }}
                  control={
                    <Checkbox
                      size="small"
                      checked={allChecked}
                      indeterminate={someChecked && !allChecked}
                      onChange={(e) => toggleGroup(items, e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="subtitle2" fontWeight={700} sx={{ pt: 0.25 }}>
                      {app}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1, fontWeight: 400 }}
                      >
                        ({groupSelectAll})
                      </Typography>
                    </Typography>
                  }
                />
                <Box sx={{ pl: 3.5, display: "flex", flexDirection: "column", gap: 0 }}>
                  {items.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      sx={{ ml: 0, py: 0.125 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={selected.has(String(opt.value))}
                          onChange={(e) => toggleOne(opt.value, e.target.checked)}
                        />
                      }
                      label={
                        <Typography variant="body2">{opt.displayLabel}</Typography>
                      }
                    />
                  ))}
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {(error || helperText) && (
        <FormHelperText error={error} sx={{ mx: 0, mt: 0.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
