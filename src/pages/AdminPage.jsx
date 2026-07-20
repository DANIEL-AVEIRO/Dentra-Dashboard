import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import client from "@/api/client";
import { glassCardSx } from "@/constants/glassSurface";
import { pageStackSx, pageSectionPaperSx } from "@/constants/pageLayout";
import { isLabOwner, isPlatformStaff, isClinicUser } from "@/utils/permissions";
import { formatCaseMoney } from "@/utils/caseLineItemMoney";
import { getErrorMessage, toast } from "@/utils/toast";
import "@/styles/admin-landing.css";

function StatCard({ icon: Icon, label, value, hint, to }) {
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
        textDecoration: "none",
        color: "inherit",
        display: "block",
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
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2, mt: 0.25 }}>
            {value}
          </Typography>
          {hint ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {hint}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  );
}

function QuickLinkCard({ to, icon: Icon, title, description }) {
  const theme = useTheme();
  return (
    <Paper
      component={RouterLink}
      to={to}
      elevation={0}
      className="admin-landing__quick-link-card"
      sx={{
        ...glassCardSx(theme),
        p: 2,
        height: "100%",
        textDecoration: "none",
        color: "inherit",
        display: "block",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
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
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function PlatformAdminLanding({ user, t }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const { data: payload } = await client.get("/dashboard/admin-overview/");
      setData(payload);
    } catch (error) {
      toast.error(getErrorMessage(error, t("adminLanding.admin.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const counts = data?.counts;
  const finance = data?.finance;
  const labs = data?.laboratories || [];
  const storage = data?.storage;

  const quickLinks = [
    {
      to: "/laboratories",
      icon: ScienceOutlinedIcon,
      title: t("nav.laboratories"),
      description: t("adminLanding.admin.quickLinks.laboratories"),
    },
    {
      to: "/plans",
      icon: AssessmentOutlinedIcon,
      title: t("nav.plans"),
      description: t("adminLanding.admin.quickLinks.plans"),
    },
    {
      to: "/users",
      icon: GroupOutlinedIcon,
      title: t("nav.users"),
      description: t("adminLanding.admin.quickLinks.users"),
    },
    {
      to: "/storage-analysis",
      icon: StorageOutlinedIcon,
      title: t("nav.storageAnalysis"),
      description: t("adminLanding.admin.quickLinks.storage"),
    },
  ];

  return (
    <Box className="admin-landing page-enter" sx={pageStackSx}>
      <PageHeader
        title={t("adminLanding.admin.welcome", { name: user?.username || "—" })}
        subtitle={t("adminLanding.admin.subtitle")}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScienceOutlinedIcon}
            label={t("adminLanding.admin.cards.labs")}
            value={counts ? String(counts.laboratories) : loading ? "…" : "—"}
            to="/laboratories"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssignmentOutlinedIcon}
            label={t("adminLanding.admin.cards.cases")}
            value={counts ? String(counts.cases) : loading ? "…" : "—"}
            hint={
              counts
                ? t("adminLanding.admin.cards.casesHint", {
                    fab: counts.cases_in_fabrication,
                    delivered: counts.cases_delivered,
                    dueToday: counts.cases_due_today,
                  })
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={LocalShippingOutlinedIcon}
            label={t("adminLanding.admin.cards.deliveries")}
            value={counts ? String(counts.deliveries_active) : loading ? "…" : "—"}
            hint={t("adminLanding.admin.cards.deliveriesHint")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={GroupOutlinedIcon}
            label={t("adminLanding.admin.cards.users")}
            value={counts ? String(counts.users) : loading ? "…" : "—"}
            to="/users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ReceiptLongOutlinedIcon}
            label={t("adminLanding.admin.cards.revenue")}
            value={finance ? formatCaseMoney(finance.revenue) : loading ? "…" : "—"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PaymentsOutlinedIcon}
            label={t("adminLanding.admin.cards.cash")}
            value={
              finance ? formatCaseMoney(finance.cash_collected) : loading ? "…" : "—"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssessmentOutlinedIcon}
            label={t("adminLanding.admin.cards.outstanding")}
            value={
              finance ? formatCaseMoney(finance.outstanding_ar) : loading ? "…" : "—"
            }
            hint={
              counts
                ? t("adminLanding.admin.cards.outstandingHint", {
                    unbilled: counts.unbilled_delivered,
                    open: counts.invoices_open,
                  })
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={StorageOutlinedIcon}
            label={t("adminLanding.admin.cards.storage")}
            value={
              storage?.total_used_mb != null || storage?.total_used_gb != null
                ? storage.total_used_gb >= 1
                  ? `${storage.total_used_gb} GB`
                  : `${storage.total_used_mb} MB`
                : loading
                  ? "…"
                  : "—"
            }
            to="/storage-analysis"
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ ...pageSectionPaperSx, p: 2, mt: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {t("adminLanding.admin.byLabTitle")}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("fields.laboratory_name")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.cases")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.fab")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.delivered")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.revenue")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.cash")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.ar")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.users")}</TableCell>
              <TableCell align="right">{t("adminLanding.admin.table.health", { defaultValue: "Health" })}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labs.map((lab) => (
              <TableRow key={lab.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{lab.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lab.plan_name || "—"}
                  </Typography>
                </TableCell>
                <TableCell align="right">{lab.cases}</TableCell>
                <TableCell align="right">{lab.cases_in_fabrication}</TableCell>
                <TableCell align="right">{lab.cases_delivered}</TableCell>
                <TableCell align="right">{formatCaseMoney(lab.revenue)}</TableCell>
                <TableCell align="right">{formatCaseMoney(lab.cash_collected)}</TableCell>
                <TableCell align="right">{formatCaseMoney(lab.outstanding_ar)}</TableCell>
                <TableCell align="right">
                  {lab.users_limit != null
                    ? `${lab.users_count}/${lab.users_limit}`
                    : lab.users_count}
                </TableCell>
                <TableCell align="right">
                  {lab.health_score != null ? lab.health_score : "—"}
                </TableCell>
              </TableRow>
            ))}
            {!loading && labs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography color="text.secondary">
                    {t("adminLanding.admin.noLabs")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {t("adminLanding.admin.quickLinksTitle")}
        </Typography>
        <Box className="admin-landing__quick-links">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.to} {...link} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function LabOwnerAdminLanding({ user, t }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const { data: payload } = await client.get("/dashboard/lab-overview/");
      setData(payload);
    } catch (error) {
      toast.error(getErrorMessage(error, t("adminLanding.lab.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const lab = data?.laboratory;
  const counts = data?.counts;
  const storage = data?.storage;

  const quickLinks = [
    {
      to: "/cases",
      icon: AssignmentOutlinedIcon,
      title: t("nav.cases"),
      description: t("adminLanding.lab.quickLinks.cases"),
    },
    {
      to: "/my-laboratory",
      icon: ScienceOutlinedIcon,
      title: t("nav.myLaboratory"),
      description: t("adminLanding.lab.quickLinks.myLaboratory"),
    },
    {
      to: "/lab-users",
      icon: GroupOutlinedIcon,
      title: t("nav.labUsers"),
      description: t("adminLanding.lab.quickLinks.labUsers"),
    },
    {
      to: "/storage-analysis",
      icon: StorageOutlinedIcon,
      title: t("nav.storageAnalysis"),
      description: t("adminLanding.lab.quickLinks.storage"),
    },
  ];

  return (
    <Box className="admin-landing page-enter" sx={pageStackSx}>
      <PageHeader
        title={t("adminLanding.lab.welcome", { name: user?.username || "—" })}
        subtitle={
          lab?.name
            ? t("adminLanding.lab.subtitleNamed", { lab: lab.name })
            : t("adminLanding.lab.subtitle")
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssignmentOutlinedIcon}
            label={t("adminLanding.lab.cards.cases")}
            value={counts ? String(counts.cases) : loading ? "…" : "—"}
            hint={
              counts
                ? t("adminLanding.lab.cards.casesHint", {
                    dueToday: counts.cases_due_today,
                    urgent: counts.cases_urgent,
                  })
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={GroupOutlinedIcon}
            label={t("adminLanding.lab.cards.users")}
            value={lab?.users_usage ?? (loading ? "…" : "—")}
            hint={lab?.plan_name ? t("adminLanding.lab.cards.plan", { plan: lab.plan_name }) : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={StorageOutlinedIcon}
            label={t("adminLanding.lab.cards.storage")}
            value={
              storage?.total_used_mb != null || storage?.total_used_gb != null
                ? storage.total_used_gb >= 1
                  ? `${storage.total_used_gb} GB`
                  : `${storage.total_used_mb} MB`
                : loading
                  ? "…"
                  : "—"
            }
            hint={
              storage?.overall_usage_percent != null
                ? t("adminLanding.lab.cards.storageHint", {
                    percent: storage.overall_usage_percent,
                  })
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScienceOutlinedIcon}
            label={t("adminLanding.lab.cards.laboratory")}
            value={lab?.name ?? (loading ? "…" : "—")}
            hint={lab?.plan_name ?? null}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {t("adminLanding.lab.quickLinksTitle")}
        </Typography>
        <Box className="admin-landing__quick-links">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.to} {...link} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ClinicAdminLanding({ user, t }) {
  const clinicName = user?.clinic_name || t("adminLanding.clinic.clinicFallback", {
    defaultValue: "your clinic",
  });

  const quickLinks = [
    {
      to: "/cases",
      icon: AssignmentOutlinedIcon,
      title: t("nav.cases"),
      description: t("adminLanding.clinic.quickLinks.cases", {
        defaultValue: "View and track your lab cases",
      }),
    },
    {
      to: "/patients",
      icon: GroupOutlinedIcon,
      title: t("nav.patients", { defaultValue: "Patients" }),
      description: t("adminLanding.clinic.quickLinks.patients", {
        defaultValue: "Manage patients",
      }),
    },
    {
      to: "/appointments",
      icon: AssessmentOutlinedIcon,
      title: t("nav.appointments", { defaultValue: "Appointments" }),
      description: t("adminLanding.clinic.quickLinks.appointments", {
        defaultValue: "Schedule appointments",
      }),
    },
    {
      to: "/billing",
      icon: ReceiptLongOutlinedIcon,
      title: t("nav.billing"),
      description: t("adminLanding.clinic.quickLinks.billing", {
        defaultValue: "Review invoices and balances",
      }),
    },
  ];

  return (
    <Box className="admin-landing page-enter" sx={pageStackSx}>
      <PageHeader
        title={t("adminLanding.clinic.welcome", {
          name: user?.username || "—",
          defaultValue: "Welcome, {{name}}",
        })}
        subtitle={t("adminLanding.clinic.subtitle", {
          clinic: clinicName,
          defaultValue: "{{clinic}} — cases, patients, and billing",
        })}
      />
      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {t("adminLanding.clinic.quickLinksTitle", {
            defaultValue: "Quick links",
          })}
        </Typography>
        <Box className="admin-landing__quick-links">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.to} {...link} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (isClinicUser(user)) {
    return <ClinicAdminLanding user={user} t={t} />;
  }

  if (isLabOwner(user)) {
    return <LabOwnerAdminLanding user={user} t={t} />;
  }

  if (isPlatformStaff(user)) {
    return <PlatformAdminLanding user={user} t={t} />;
  }

  return (
    <Box className="admin-landing page-enter" sx={pageStackSx}>
      <PageHeader
        title={t("adminLanding.welcome", { name: user?.username || "—" })}
        subtitle={t("adminLanding.lab.memberSubtitle")}
      />
    </Box>
  );
}
