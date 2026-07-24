import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import ActionButton from "@/components/common/ActionButton";
import TableActionButton from "@/components/common/TableActionButton";
import SearchableSelect from "@/components/common/SearchableSelect";
import ToothChartSelector from "@/components/cases/ToothChartSelector";
import { FormField, ProTextField } from "@/components/common/form";
import client from "@/api/client";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney, caseLineTotal } from "@/utils/caseLineItemMoney";
import { parseToothSelection } from "@/components/cases/toothChartData";

const EMPTY_ROW = () => ({
  restoration: "",
  material: "",
  material_size: "",
  tooth_number: "",
  shade: "",
  quantity: 1,
  unit_price: "",
  discount: "",
});

function mapApiRow(item) {
  return {
    id: item.id,
    restoration: item.restoration ?? "",
    material: item.material ?? "",
    material_size: item.material_size ?? "",
    tooth_number: item.tooth_number ?? "",
    shade: item.shade ?? "",
    quantity: item.quantity ?? 1,
    unit_price: item.unit_price ?? "",
    discount: item.discount ?? "",
  };
}

async function lookupUnitPrice(material, materialSize) {
  if (!material || !materialSize) return null;
  const { data } = await client.get("/price-list/lookup/", {
    params: { material, material_size: materialSize },
  });
  if (data?.found && data.unit_price != null) return data.unit_price;
  return null;
}

function LineItemCard({
  row,
  index,
  restorationOptions,
  materialOptions,
  materialSizeOptions,
  shadeOptions,
  priceLoading,
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
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <FormField id={`restoration-${index}`} label={t("fields.restoration")} required>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectRestoration")}
              value={row.restoration}
              options={restorationOptions}
              valueKey="value"
              labelKey="label"
              onChange={(next) => onPatch({ restoration: next })}
            />
          </FormField>
          <FormField id={`material-${index}`} label={t("fields.material")} required>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectMaterial")}
              value={row.material}
              options={materialOptions}
              valueKey="value"
              labelKey="label"
              onChange={(next) => onPatch({ material: next })}
            />
          </FormField>
          <FormField id={`material-size-${index}`} label={t("fields.material_size")} required>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectSize")}
              value={row.material_size}
              options={materialSizeOptions}
              valueKey="value"
              labelKey="label"
              onChange={(next) => onPatch({ material_size: next })}
            />
          </FormField>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormField id={`tooth-${index}`} label={t("fields.tooth_number")}>
            <ToothChartSelector
              value={row.tooth_number}
              onChange={(next) => {
                const count = parseToothSelection(next).size;
                onUpdate({
                  tooth_number: next,
                  quantity: count > 0 ? count : 1,
                });
              }}
            />
          </FormField>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          <FormField id={`shade-${index}`} label={t("fields.shade")}>
            <SearchableSelect
              placeholder={t("pages.cases.lineItems.selectShade")}
              value={row.shade}
              options={shadeOptions}
              valueKey="value"
              labelKey="label"
              onChange={(next) => onUpdate({ shade: next })}
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
          <FormField
            id={`unit-price-${index}`}
            label={t("fields.unit_price")}
            helperText={
              priceLoading
                ? t("pages.cases.lineItems.priceLoading")
                : t("pages.cases.lineItems.priceFromList")
            }
          >
            <ProTextField
              labelPlacement="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={row.unit_price}
              onChange={(e) => onUpdate({ unit_price: e.target.value })}
              placeholder="0"
              disabled={priceLoading}
              InputProps={{
                endAdornment: priceLoading ? (
                  <CircularProgress color="inherit" size={16} sx={{ mr: 1 }} />
                ) : undefined,
              }}
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
      </Box>
    </Box>
  );
}

export default function CaseLineItemsEditor({ value = [], onChange, error }) {
  const { t } = useTranslation();
  const [restorations, setRestorations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialSizes, setMaterialSizes] = useState([]);
  const [shades, setShades] = useState([]);
  const [priceLoadingByIndex, setPriceLoadingByIndex] = useState({});
  const rows = Array.isArray(value) && value.length > 0 ? value : [];
  const rowsRef = useRef(rows);
  const lookupSeqRef = useRef({});
  rowsRef.current = rows;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [restorationRes, materialRes, sizeRes, shadeRes] = await Promise.all([
          client.get("/restorations/"),
          client.get("/materials/"),
          client.get("/material-sizes/"),
          client.get("/shades/"),
        ]);
        if (cancelled) return;
        const toOptions = (list) =>
          (list.results ?? list)
            .filter((item) => item.is_active !== false)
            .map((item) => ({
              value: item.id,
              label: item.code ? `${item.name} (${item.code})` : item.name,
            }));
        const toNameOptions = (list) =>
          (list.results ?? list)
            .filter((item) => item.is_active !== false)
            .map((item) => ({
              value: item.name,
              label:
                item.code && item.code !== item.name
                  ? `${item.name} (${item.code})`
                  : item.name,
            }));
        setRestorations(toOptions(restorationRes.data));
        setMaterials(toOptions(materialRes.data));
        setMaterialSizes(toNameOptions(sizeRes.data));
        setShades(toNameOptions(shadeRes.data));
      } catch {
        if (!cancelled) {
          setRestorations([]);
          setMaterials([]);
          setMaterialSizes([]);
          setShades([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const restorationOptions = useMemo(() => restorations, [restorations]);
  const materialOptions = useMemo(() => materials, [materials]);
  const materialSizeOptions = useMemo(() => materialSizes, [materialSizes]);
  const shadeOptions = useMemo(() => shades, [shades]);

  const commitRows = useCallback(
    (nextRows) => {
      rowsRef.current = nextRows;
      onChange(nextRows);
    },
    [onChange],
  );

  const updateRow = useCallback(
    (index, patch) => {
      const next = rowsRef.current.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      );
      commitRows(next);
    },
    [commitRows],
  );

  const applyRowPatch = useCallback(
    async (index, patch) => {
      const current = rowsRef.current[index] ?? EMPTY_ROW();
      const next = { ...current, ...patch };
      const materialOrSizeChanged =
        "material" in patch || "material_size" in patch;
      const bothSelected = Boolean(next.material && next.material_size);
      const comboChanged =
        materialOrSizeChanged &&
        bothSelected &&
        (next.material !== current.material ||
          next.material_size !== current.material_size);

      if (materialOrSizeChanged && !bothSelected) {
        next.unit_price = "";
      }

      commitRows(
        rowsRef.current.map((row, i) => (i === index ? next : row)),
      );

      if (!comboChanged) return;

      const seq = (lookupSeqRef.current[index] || 0) + 1;
      lookupSeqRef.current[index] = seq;
      setPriceLoadingByIndex((prev) => ({ ...prev, [index]: true }));

      try {
        const price = await lookupUnitPrice(next.material, next.material_size);
        if (lookupSeqRef.current[index] !== seq) return;
        const latest = rowsRef.current[index];
        if (
          !latest ||
          latest.material !== next.material ||
          latest.material_size !== next.material_size
        ) {
          return;
        }
        commitRows(
          rowsRef.current.map((row, i) =>
            i === index
              ? { ...row, unit_price: price != null ? String(price) : "" }
              : row,
          ),
        );
      } catch {
        if (lookupSeqRef.current[index] !== seq) return;
        commitRows(
          rowsRef.current.map((row, i) =>
            i === index ? { ...row, unit_price: "" } : row,
          ),
        );
      } finally {
        if (lookupSeqRef.current[index] === seq) {
          setPriceLoadingByIndex((prev) => ({ ...prev, [index]: false }));
        }
      }
    },
    [commitRows],
  );

  const addRow = () => {
    commitRows([...rowsRef.current, EMPTY_ROW()]);
  };

  const removeRow = (index) => {
    commitRows(rowsRef.current.filter((_, i) => i !== index));
    setPriceLoadingByIndex((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
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
              materialSizeOptions={materialSizeOptions}
              shadeOptions={shadeOptions}
              priceLoading={Boolean(priceLoadingByIndex[index])}
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
