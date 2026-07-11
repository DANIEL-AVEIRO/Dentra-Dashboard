import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { BRAND_PRIMARY } from "@/theme";
import { useTranslation } from "@/context/LanguageContext";
import {
  computeWorkItemsTotal,
  countPricedLineItems,
  formatCaseMoney,
} from "@/utils/caseLineItemMoney";

export default function CaseFinancialSummary({ lineItems = [] }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const items = Array.isArray(lineItems) ? lineItems : [];
  const pricedCount = countPricedLineItems(items);
  const total = computeWorkItemsTotal(items);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: 1,
        borderColor: (t) =>
          alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.14 : 0.22),
        bgcolor: (t) => alpha(BRAND_PRIMARY, t.palette.mode === "light" ? 0.03 : 0.08),
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("pages.cases.financial.workItemsSubtotal")}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatCaseMoney(total)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            pt: 1.5,
            borderTop: 1,
            borderColor: alpha(
              theme.palette.divider,
              theme.palette.mode === "light" ? 1 : 0.5,
            ),
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {t("pages.cases.financial.totalAmount")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("pages.cases.financial.itemCount", { count: pricedCount })}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            fontWeight={800}
            color="primary.main"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatCaseMoney(total)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
