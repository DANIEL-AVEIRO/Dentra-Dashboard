import { Chip, Stack } from "@mui/material";
import { useTranslation } from "@/context/LanguageContext";

function resolveDateFieldLabel(field, t) {
  if (!field) return "";
  if (field.labelKey) {
    return t(field.labelKey, { defaultValue: field.label ?? field.field });
  }
  return field.label ?? field.field;
}

function chipLabel(key, value, t, dateFields = []) {
  if (key === "search") {
    return t("table.filterChipSearch", { value });
  }
  if (key === "date") {
    return t("table.filterChipDate", { value });
  }
  if (key === "date_from") {
    return t("table.filterChipDateFrom", { value });
  }
  if (key === "date_to") {
    return t("table.filterChipDateTo", { value });
  }
  if (key === "date_field") {
    const field = dateFields.find((d) => d.field === value);
    return t("table.filterChipDateField", {
      value: resolveDateFieldLabel(field, t) || value,
    });
  }
  return t("table.filterChipGeneric", { key, value });
}

export default function TableActiveFilterChips({
  filters,
  dateFields = [],
  onRemove,
  extraChips = [],
}) {
  const { t } = useTranslation();
  const chips = [];

  if (filters.search?.trim()) {
    chips.push({ key: "search", value: filters.search.trim() });
  }
  if (filters.date_field && (filters.date || filters.date_from || filters.date_to)) {
    chips.push({ key: "date_field", value: filters.date_field });
  }
  if (filters.date) {
    chips.push({ key: "date", value: filters.date });
  }
  if (filters.date_from) {
    chips.push({ key: "date_from", value: filters.date_from });
  }
  if (filters.date_to) {
    chips.push({ key: "date_to", value: filters.date_to });
  }
  if (filters.department) {
    chips.push({ key: "department", value: filters.department });
  }
  if (filters.position) {
    chips.push({ key: "position", value: filters.position });
  }

  const allChips = [...chips, ...extraChips];
  if (!allChips.length) return null;

  return (
    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ px: { xs: 1.5, sm: 2 }, pb: 1.25 }}>
      {allChips.map((chip) => (
        <Chip
          key={`${chip.key}-${chip.value}`}
          size="small"
          label={chip.label ?? chipLabel(chip.key, chip.value, t, dateFields)}
          onDelete={() => onRemove(chip.key, chip.value)}
          sx={{ fontWeight: 600 }}
        />
      ))}
    </Stack>
  );
}
