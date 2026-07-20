import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { pageShellSx, pageSectionPaperSx } from "@/constants/pageLayout";

function KpiCard({ label, value, to }) {
  return (
    <Paper
      component={to ? RouterLink : "div"}
      to={to}
      elevation={0}
      sx={{
        ...pageSectionPaperSx,
        p: 2.5,
        textDecoration: "none",
        color: "inherit",
        height: "100%",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    client
      .get("/dashboard/lab-finance/")
      .then(({ data }) => setKpi(data))
      .catch((err) => toast.error(getErrorMessage(err, t("toast.loadFailed"))));
  }, [t]);

  return (
    <Box className="page-enter" sx={pageShellSx}>
      <PageHeader
        title={t("pages.reports.title")}
        subtitle={t("pages.reports.subtitle")}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.revenue", { defaultValue: "Revenue" })}
            value={formatCaseMoney(kpi?.revenue)}
            to="/billing"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.cash", { defaultValue: "Cash collected" })}
            value={formatCaseMoney(kpi?.cash_collected)}
            to="/collections"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.outstanding", { defaultValue: "Outstanding AR" })}
            value={formatCaseMoney(kpi?.outstanding_ar)}
            to="/clinic-statements"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.unbilled", {
              defaultValue: "Unbilled delivered cases",
            })}
            value={kpi?.unbilled_delivered_count ?? "—"}
            to="/billing"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.expenses", { defaultValue: "Approved expenses" })}
            value={formatCaseMoney(kpi?.expenses_total)}
            to="/expenses"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard
            label={t("pages.reports.profit", {
              defaultValue: "Est. operating profit",
            })}
            value={formatCaseMoney(kpi?.estimated_operating_profit)}
          />
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
        {t("pages.reports.disclaimer", {
          defaultValue:
            "Estimated operating profit = revenue minus approved expenses. Not audited final profit.",
        })}
      </Typography>
    </Box>
  );
}
