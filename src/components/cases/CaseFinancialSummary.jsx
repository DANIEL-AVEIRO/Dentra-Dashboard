import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { BRAND_PRIMARY } from "@/theme";
import client from "@/api/client";
import { useTranslation } from "@/context/LanguageContext";
import {
  caseLineDiscount,
  caseLineGross,
  caseLineTotal,
  computeWorkItemsDiscount,
  computeWorkItemsGross,
  computeWorkItemsTotal,
  countPricedLineItems,
  formatCaseMoney,
  sumLineItemQuantity,
} from "@/utils/caseLineItemMoney";

function buildLabelMap(list) {
  const map = new Map();
  for (const item of list.results ?? list) {
    if (!item?.id) continue;
    map.set(
      item.id,
      item.code ? `${item.name} (${item.code})` : item.name,
    );
  }
  return map;
}

function RowMeta({ row, t }) {
  const bits = [];
  if (row.tooth_number) bits.push(`${t("fields.tooth_number")}: ${row.tooth_number}`);
  if (row.shade) bits.push(`${t("fields.shade")}: ${row.shade}`);
  if (row.material_size) bits.push(`${t("fields.material_size")}: ${row.material_size}`);
  if (!bits.length) return null;
  return (
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
      {bits.join(" · ")}
    </Typography>
  );
}

function SummaryRow({ label, value, muted, emphasize, danger }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant={emphasize ? "subtitle1" : "body2"}
        fontWeight={emphasize ? 700 : 500}
        color={muted ? "text.secondary" : "text.primary"}
      >
        {label}
      </Typography>
      <Typography
        variant={emphasize ? "h6" : "body2"}
        fontWeight={emphasize ? 800 : 600}
        color={danger ? "error.main" : emphasize ? "primary.main" : "text.primary"}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function CaseFinancialSummary({ lineItems = [] }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const items = Array.isArray(lineItems) ? lineItems : [];
  const [labelMaps, setLabelMaps] = useState({ restorations: new Map(), materials: new Map() });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [restorationRes, materialRes] = await Promise.all([
          client.get("/restorations/"),
          client.get("/materials/"),
        ]);
        if (cancelled) return;
        setLabelMaps({
          restorations: buildLabelMap(restorationRes.data),
          materials: buildLabelMap(materialRes.data),
        });
      } catch {
        if (!cancelled) {
          setLabelMaps({ restorations: new Map(), materials: new Map() });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pricedCount = countPricedLineItems(items);
  const unpricedCount = items.length - pricedCount;
  const totalQty = sumLineItemQuantity(items);
  const gross = computeWorkItemsGross(items);
  const discounts = computeWorkItemsDiscount(items);
  const total = computeWorkItemsTotal(items);
  const avgUnit =
    pricedCount > 0
      ? items.reduce((sum, row) => {
          const price = Number(row?.unit_price);
          return Number.isFinite(price) ? sum + price : sum;
        }, 0) / pricedCount
      : null;

  const rows = useMemo(
    () =>
      items.map((row, index) => {
        const restorationLabel =
          row.restoration_name ||
          labelMaps.restorations.get(row.restoration) ||
          null;
        const materialLabel =
          row.material_name ||
          labelMaps.materials.get(row.material) ||
          null;
        const title =
          restorationLabel ||
          t("pages.cases.lineItems.itemLabel", { index: index + 1 });
        const subtitle = materialLabel;
        return {
          key: row.id || `row-${index}`,
          index,
          title,
          subtitle,
          row,
          qty: Number(row.quantity) || 0,
          unitPrice: Number(row.unit_price),
          discount: caseLineDiscount(row),
          gross: caseLineGross(row),
          lineTotal: caseLineTotal(row),
          priced: caseLineTotal(row) != null,
        };
      }),
    [items, labelMaps, t],
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: (th) =>
          alpha(BRAND_PRIMARY, th.palette.mode === "light" ? 0.14 : 0.22),
        bgcolor: (th) => alpha(BRAND_PRIMARY, th.palette.mode === "light" ? 0.03 : 0.08),
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {t("pages.cases.financial.summaryTitle")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("pages.cases.financial.summaryHelp")}
            </Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            <Chip
              size="small"
              label={t("pages.cases.financial.statItems", { count: items.length })}
              variant="outlined"
            />
            <Chip
              size="small"
              label={t("pages.cases.financial.statPriced", { count: pricedCount })}
              color="primary"
              variant="outlined"
            />
            <Chip
              size="small"
              label={t("pages.cases.financial.statUnits", { count: totalQty })}
              variant="outlined"
            />
            {unpricedCount > 0 && (
              <Chip
                size="small"
                color="warning"
                variant="outlined"
                label={t("pages.cases.financial.statUnpriced", { count: unpricedCount })}
              />
            )}
          </Stack>
        </Box>

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("pages.cases.financial.empty")}
          </Typography>
        ) : (
          <TableContainer
            sx={{
              borderRadius: 1.5,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("pages.cases.financial.colItem")}</TableCell>
                  <TableCell align="right">{t("fields.quantity")}</TableCell>
                  <TableCell align="right">{t("fields.unit_price")}</TableCell>
                  <TableCell align="right">{t("fields.discount")}</TableCell>
                  <TableCell align="right">{t("fields.line_total")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((entry) => (
                  <TableRow
                    key={entry.key}
                    sx={{
                      bgcolor: entry.priced
                        ? "transparent"
                        : alpha(theme.palette.warning.main, 0.04),
                    }}
                  >
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.title}
                      </Typography>
                      {entry.subtitle && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {entry.subtitle}
                        </Typography>
                      )}
                      <RowMeta row={entry.row} t={t} />
                      {!entry.priced && (
                        <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.25 }}>
                          {t("pages.cases.financial.missingPrice")}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {entry.qty || "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatCaseMoney(Number.isFinite(entry.unitPrice) ? entry.unitPrice : null)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {entry.priced && entry.discount > 0
                        ? `−${formatCaseMoney(entry.discount)}`
                        : formatCaseMoney(entry.priced ? 0 : null)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatCaseMoney(entry.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack
          spacing={1}
          sx={{
            pt: 0.5,
            borderTop: 1,
            borderColor: alpha(
              theme.palette.divider,
              theme.palette.mode === "light" ? 1 : 0.5,
            ),
          }}
        >
          <SummaryRow
            label={t("pages.cases.financial.grossCharges")}
            value={formatCaseMoney(gross)}
            muted
          />
          <SummaryRow
            label={t("pages.cases.financial.totalDiscount")}
            value={discounts > 0 ? `−${formatCaseMoney(discounts)}` : formatCaseMoney(0)}
            muted
            danger={discounts > 0}
          />
          {avgUnit != null && (
            <SummaryRow
              label={t("pages.cases.financial.avgUnitPrice")}
              value={formatCaseMoney(avgUnit)}
              muted
            />
          )}
          <Divider sx={{ my: 0.5 }} />
          <SummaryRow
            label={t("pages.cases.financial.totalAmount")}
            value={formatCaseMoney(total)}
            emphasize
          />
          <Typography variant="caption" color="text.secondary">
            {t("pages.cases.financial.calcHint")}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
