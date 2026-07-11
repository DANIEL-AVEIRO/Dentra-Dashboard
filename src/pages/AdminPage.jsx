import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import client from "@/api/client";
import { glassCardSx } from "@/constants/glassSurface";
import { isLabOwner, isPlatformStaff } from "@/utils/permissions";
import { getErrorMessage, toast } from "@/utils/toast";
import "@/styles/admin-landing.css";

function StatCard({ icon: Icon, label, value, hint }) {
  const theme = useTheme();
  return (
    <Paper elevation={0} sx={{ ...glassCardSx(theme), p: 2, height: "100%" }}>
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
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box>
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
  return (
    <Box className="admin-landing page-enter">
      <PageHeader
        title={t("adminLanding.admin.welcome", { name: user?.username || "—" })}
        subtitle={t("adminLanding.admin.subtitle")}
      />
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
    <Box className="admin-landing page-enter">
      <PageHeader
        title={t("adminLanding.lab.welcome", { name: user?.username || "—" })}
        subtitle={
          lab?.name
            ? t("adminLanding.lab.subtitleNamed", { lab: lab.name })
            : t("adminLanding.lab.subtitle")
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
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

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        {t("adminLanding.lab.quickLinksTitle")}
      </Typography>
      <Box className="admin-landing__quick-links">
        {quickLinks.map((link) => (
          <QuickLinkCard key={link.to} {...link} />
        ))}
      </Box>
    </Box>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (isLabOwner(user)) {
    return <LabOwnerAdminLanding user={user} t={t} />;
  }

  if (isPlatformStaff(user)) {
    return <PlatformAdminLanding user={user} t={t} />;
  }

  return (
    <Box className="admin-landing page-enter">
      <PageHeader
        title={t("adminLanding.welcome", { name: user?.username || "—" })}
        subtitle={t("adminLanding.lab.memberSubtitle")}
      />
    </Box>
  );
}
