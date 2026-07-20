import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import ActionButton from "@/components/common/ActionButton";
import TableActionButton from "@/components/common/TableActionButton";
import SearchableSelect from "@/components/common/SearchableSelect";
import ToothChartSelector from "@/components/cases/ToothChartSelector";
import { FormField, ProTextField } from "@/components/common/form";
import client from "@/api/client";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney, caseLineTotal } from "@/utils/caseLineItemMoney";

const EMPTY_ROW = () => ({
  restoration: "",
  material: "",
  tooth_number: "",
  shade: "",
  quantity: 1,
  unit_price: "",
  discount: "",
  notes: "",
});

function mapApiRow(item) {
  return {
    id: item.id,
    restoration: item.restoration ?? "",
    material: item.material ?? "",
    tooth_number: item.tooth_number ?? "",
    shade: item.shade ?? "",
    quantity: item.quantity ?? 1,
    unit_price: item.unit_price ?? "",
    discount: item.discount ?? "",
    notes: item.notes ?? "",
  };
}

async function lookupUnitPrice(restoration, material) {
  if (!restoration || !material) return null;
  const { data } = await client.get("/price-list/lookup/", {
    params: { restoration, material },
  });
  if (data?.found && data.unit_price != null) return data.unit_price;
  return null;
}

function LineItemCard({
  row,
  index,
  restorationOptions,
  materialOptions,
  onPatch,
  onUpdate,
  onRemove,
  t,
}) {
  const total = caseLineTotal(row);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t("pages.cases.lineItems.itemLabel", { index: index + 1 })}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t("fields.line_total")}:{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {formatCaseMoney(total)}
            </Box>
          </Typography>
          <TableActionButton
            variant="delete"
            title={t("common.delete")}
            onClick={onRemove}
          />
        </Stack>
      </Stack>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <FormField id={`restoration-${index}`} label={t("fields.restoration")} required>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectRestoration")}
              value={row.restoration}
              options={restorationOptions}
              onChange={(next) => onPatch({ restoration: next })}
            />
          </FormField>
          <FormField id={`material-${index}`} label={t("fields.material")} required>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectMaterial")}
              value={row.material}
              options={materialOptions}
              onChange={(next) => onPatch({ material: next })}
            />
          </FormField>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1.4fr) repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <FormField id={`tooth-${index}`} label={t("fields.tooth_number")}>
            <ToothChartSelector
              value={row.tooth_number}
              onChange={(next) => onUpdate({ tooth_number: next })}
            />
          </FormField>
          <FormField id={`shade-${index}`} label={t("fields.shade")}>
            <ProTextField
              labelPlacement="outlined"
              fullWidth
              value={row.shade}
              onChange={(e) => onUpdate({ shade: e.target.value })}
              placeholder="A2"
            />
          </FormField>
          <FormField id={`quantity-${index}`} label={t("fields.quantity")}>
            <ProTextField
              labelPlacement="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              value={row.quantity}
              onChange={(e) => onUpdate({ quantity: e.target.value })}
            />
          </FormField>
          <FormField id={`unit-price-${index}`} label={t("fields.unit_price")}>
            <ProTextField
              labelPlacement="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={row.unit_price}
              onChange={(e) => onUpdate({ unit_price: e.target.value })}
              placeholder="0"
            />
          </FormField>
          <FormField id={`discount-${index}`} label={t("fields.discount")}>
            <ProTextField
              labelPlacement="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={row.discount}
              onChange={(e) => onUpdate({ discount: e.target.value })}
              placeholder="0"
            />
          </FormField>
        </Box>

        <FormField id={`notes-${index}`} label={t("fields.notes")}>
          <ProTextField
            labelPlacement="outlined"
            fullWidth
            multiline
            minRows={2}
            value={row.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
          />
        </FormField>
      </Box>
    </Box>
  );
}

export default function CaseLineItemsEditor({ value = [], onChange, error }) {
  const { t } = useTranslation();
  const [restorations, setRestorations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const rows = Array.isArray(value) && value.length > 0 ? value : [];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [restorationRes, materialRes] = await Promise.all([
          client.get("/restorations/"),
          client.get("/materials/"),
        ]);
        if (cancelled) return;
        const toOptions = (list) =>
          (list.results ?? list)
            .filter((item) => item.is_active !== false)
            .map((item) => ({
              value: item.id,
              label: item.code ? `${item.name} (${item.code})` : item.name,
            }));
        setRestorations(toOptions(restorationRes.data));
        setMaterials(toOptions(materialRes.data));
      } catch {
        if (!cancelled) {
          setRestorations([]);
          setMaterials([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const restorationOptions = useMemo(() => restorations, [restorations]);
  const materialOptions = useMemo(() => materials, [materials]);

  const updateRow = useCallback(
    (index, patch) => {
      const next = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
      onChange(next);
    },
    [rows, onChange],
  );

  const applyRowPatch = useCallback(
    async (index, patch) => {
      const current = rows[index];
      const next = { ...current, ...patch };
      const comboChanged =
        ("restoration" in patch || "material" in patch) &&
        next.restoration &&
        next.material &&
        (next.restoration !== current.restoration || next.material !== current.material);

      if (comboChanged) {
        try {
          const price = await lookupUnitPrice(next.restoration, next.material);
          next.unit_price = price != null ? price : "";
        } catch {
          next.unit_price = "";
        }
      }

      updateRow(index, next);
    },
    [rows, updateRow],
  );

  const addRow = () => {
    onChange([...rows, EMPTY_ROW()]);
  };

  const removeRow = (index) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 1.5 }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pt: 0.5 }}>
          {t("pages.cases.lineItems.help")}
        </Typography>
        {rows.length > 0 ? (
          <ActionButton intent="create" size="small" onClick={addRow} sx={{ flexShrink: 0 }}>
            {t("pages.cases.lineItems.add")}
          </ActionButton>
        ) : null}
      </Stack>

      {rows.length === 0 ? (
        <Box
          sx={{
            py: 4,
            px: 2,
            border: 1,
            borderStyle: "dashed",
            borderColor: error ? "error.main" : "divider",
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "action.hover",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
              {t("pages.cases.lineItems.empty")}
            </Typography>
            <ActionButton intent="create" size="small" onClick={addRow}>
              {t("pages.cases.lineItems.add")}
            </ActionButton>
          </Stack>
        </Box>
      ) : (
        <Stack
          spacing={2}
          divider={<Divider flexItem />}
          sx={{
            p: 0.5,
            border: 1,
            borderColor: error ? "error.main" : "divider",
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          {rows.map((row, index) => (
            <LineItemCard
              key={row.id || `row-${index}`}
              row={row}
              index={index}
              restorationOptions={restorationOptions}
              materialOptions={materialOptions}
              onPatch={(patch) => applyRowPatch(index, patch)}
              onUpdate={(patch) => updateRow(index, patch)}
              onRemove={() => removeRow(index)}
              t={t}
            />
          ))}
        </Stack>
      )}

      {error ? (
        <Typography variant="caption" color="error" sx={{ mt: 0.75, display: "block" }}>
          {error}
        </Typography>
      ) : null}
    </Box>
  );
}

export { mapApiRow as mapCaseLineItemsFromApi };
