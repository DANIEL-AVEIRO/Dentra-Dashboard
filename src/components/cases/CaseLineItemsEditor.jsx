import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ActionButton from "@/components/common/ActionButton";
import TableActionButton from "@/components/common/TableActionButton";
import SearchableSelect from "@/components/common/SearchableSelect";
import ToothChartSelector from "@/components/cases/ToothChartSelector";
import { ProTextField } from "@/components/common/form";
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
        <Box
          sx={{
            overflowX: "auto",
            border: 1,
            borderColor: error ? "error.main" : "divider",
            borderRadius: 1.5,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("fields.restoration")}</TableCell>
                <TableCell>{t("fields.material")}</TableCell>
                <TableCell sx={{ width: 120, minWidth: 120, maxWidth: 120 }}>{t("fields.tooth_number")}</TableCell>
                <TableCell sx={{ minWidth: 90 }}>{t("fields.shade")}</TableCell>
                <TableCell sx={{ width: 80 }}>{t("fields.quantity")}</TableCell>
                <TableCell sx={{ minWidth: 110 }}>{t("fields.unit_price")}</TableCell>
                <TableCell sx={{ minWidth: 100 }}>{t("fields.line_total")}</TableCell>
                <TableCell sx={{ minWidth: 140 }}>{t("fields.notes")}</TableCell>
                <TableCell align="center" sx={{ width: 52, px: 0.5 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                const total = caseLineTotal(row);
                return (
                  <TableRow key={row.id || `row-${index}`}>
                    <TableCell sx={{ minWidth: 180 }}>
                      <SearchableSelect
                        placeholder={t("pages.cases.lineItems.selectRestoration")}
                        value={row.restoration}
                        options={restorationOptions}
                        onChange={(next) => applyRowPatch(index, { restoration: next })}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <SearchableSelect
                        placeholder={t("pages.cases.lineItems.selectMaterial")}
                        value={row.material}
                        options={materialOptions}
                        onChange={(next) => applyRowPatch(index, { material: next })}
                      />
                    </TableCell>
                    <TableCell sx={{ width: 120, minWidth: 120, maxWidth: 120 }}>
                      <ToothChartSelector
                        value={row.tooth_number}
                        onChange={(next) => updateRow(index, { tooth_number: next })}
                      />
                    </TableCell>
                    <TableCell>
                      <ProTextField
                        labelPlacement="outlined"
                        value={row.shade}
                        onChange={(e) => updateRow(index, { shade: e.target.value })}
                        placeholder="A2"
                      />
                    </TableCell>
                    <TableCell>
                      <ProTextField
                        labelPlacement="outlined"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={row.quantity}
                        onChange={(e) => updateRow(index, { quantity: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <ProTextField
                        labelPlacement="outlined"
                        type="number"
                        inputProps={{ min: 0, step: "0.01" }}
                        value={row.unit_price}
                        onChange={(e) => updateRow(index, { unit_price: e.target.value })}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ py: 1 }}>
                        {formatCaseMoney(total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <ProTextField
                        labelPlacement="outlined"
                        value={row.notes}
                        onChange={(e) => updateRow(index, { notes: e.target.value })}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: "middle", width: 52, px: 0.5 }}>
                      <TableActionButton
                        variant="delete"
                        title={t("common.delete")}
                        onClick={() => removeRow(index)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
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
