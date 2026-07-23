import { useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PageHeader from "@/components/common/PageHeader";
import client from "@/api/client";
import { toast, getErrorMessage } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { glassCardSx } from "@/constants/glassSurface";
import { GRID_SPACING } from "@/constants/layout";
import { pageShellSx } from "@/constants/pageLayout";

function KpiCard({ icon: Icon, label, value, to }) {
  const theme = useTheme();
  return (
    <Paper
      component={to ? RouterLink : "div"}
      to={to}
      elevation={0}
      sx={{
        ...glassCardSx(theme),
        p: 2,
        height: "100%",
        minWidth: 0,
        width: "100%",
        textDecoration: "none",
        color: "inherit",
        display: "block",
        boxSizing: "border-box",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              lineHeight: 1.2,
              mt: 0.25,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
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

  const cards = [
    {
      key: "revenue",
      icon: PaymentsOutlinedIcon,
      label: t("pages.reports.revenue", { defaultValue: "Revenue" }),
      value: formatCaseMoney(kpi?.revenue),
      to: "/billing",
    },
    {
      key: "cash",
      icon: AccountBalanceWalletOutlinedIcon,
      label: t("pages.reports.cash", { defaultValue: "Cash collected" }),
      value: formatCaseMoney(kpi?.cash_collected),
      to: "/collections",
    },
    {
      key: "outstanding",
      icon: AssessmentOutlinedIcon,
      label: t("pages.reports.outstanding", { defaultValue: "Outstanding AR" }),
      value: formatCaseMoney(kpi?.outstanding_ar),
      to: "/clinic-statements",
    },
    {
      key: "unbilled",
      icon: ReceiptLongOutlinedIcon,
      label: t("pages.reports.unbilled", {
        defaultValue: "Unbilled delivered cases",
      }),
      value: kpi?.unbilled_delivered_count ?? "—",
      to: "/billing",
    },
    {
      key: "expenses",
      icon: TrendingDownOutlinedIcon,
      label: t("pages.reports.expenses", { defaultValue: "Approved expenses" }),
      value: formatCaseMoney(kpi?.expenses_total),
      to: "/expenses",
    },
    {
      key: "profit",
      icon: TrendingUpOutlinedIcon,
      label: t("pages.reports.profit", {
        defaultValue: "Est. operating profit",
      }),
      value: formatCaseMoney(kpi?.estimated_operating_profit),
    },
  ];

  return (
    <Box className="page-enter" sx={pageShellSx}>
      <PageHeader
        title={t("pages.reports.title")}
        subtitle={t("pages.reports.subtitle")}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: GRID_SPACING,
          width: "100%",
        }}
      >
        {cards.map((card) => (
          <KpiCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={card.value}
            to={card.to}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        {t("pages.reports.disclaimer", {
          defaultValue:
            "Estimated operating profit = revenue minus approved expenses. Not audited final profit.",
        })}
      </Typography>
    </Box>
  );
}
