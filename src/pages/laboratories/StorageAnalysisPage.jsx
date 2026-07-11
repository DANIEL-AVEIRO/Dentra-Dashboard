import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoDetailCard, {
  InfoMetaList,
} from "@/components/common/InfoMetaPanel";
import PageHeader from "@/components/common/PageHeader";
import TableRefreshButton from "@/components/common/TableRefreshButton";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined";
import client from "@/api/client";
import { glassCardSx } from "@/constants/glassSurface";
import { GRID_SPACING } from "@/constants/layout";
import { useTranslation } from "@/context/LanguageContext";
import { getErrorMessage, toast } from "@/utils/toast";

const STATUS_COLORS = {
  ok: "success",
  warning: "warning",
  critical: "error",
  over: "error",
};

function formatStorageAmount({ mb, gb }) {
  if (gb != null && gb >= 1) return `${gb} GB`;
  if (mb != null) return `${mb} MB`;
  return "—";
}

function SummaryCard({ icon: Icon, label, value, hint }) {
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
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ lineHeight: 1.2, mt: 0.25 }}
          >
            {value}
          </Typography>
          {hint ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {hint}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  );
}

function UsageBar({ percent, status }) {
  const theme = useTheme();
  const color =
    status === "over" || status === "critical"
      ? theme.palette.error.main
      : status === "warning"
        ? theme.palette.warning.main
        : theme.palette.success.main;

  return (
    <Box sx={{ minWidth: 120 }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, percent || 0)}
        sx={{
          height: 8,
          borderRadius: 999,
          bgcolor: alpha(color, 0.12),
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            bgcolor: color,
          },
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, display: "block" }}
      >
        {percent != null ? `${percent}%` : "—"}
      </Typography>
    </Box>
  );
}

export default function StorageAnalysisPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      try {
        const { data: payload } = await client.get(
          "/dashboard/storage-analysis/",
        );
        setData(payload);
      } catch (error) {
        toast.error(
          getErrorMessage(error, t("pages.storageAnalysis.loadFailed")),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [t],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const summary = data?.summary;
  const rows = data?.laboratories || [];
  const isPlatformScope = data?.scope === "platform";

  const labCards = useMemo(
    () =>
      rows.map((row) => {
        const statusColor = STATUS_COLORS[row.status] || "default";
        return {
          ...row,
          statusColor,
          statusLabel: t(`pages.storageAnalysis.status.${row.status}`, {
            defaultValue: row.status,
          }),
        };
      }),
    [rows, t],
  );

  return (
    <>
      <PageHeader
        title={t("pages.storageAnalysis.title")}
        subtitle={t(
          isPlatformScope
            ? "pages.storageAnalysis.subtitlePlatform"
            : "pages.storageAnalysis.subtitleLab",
        )}
        action={
          <TableRefreshButton
            onRefresh={() => fetchData(true)}
            refreshing={refreshing}
          />
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: GRID_SPACING,
        }}
      >
        <SummaryCard
          icon={StorageOutlinedIcon}
          label={t("pages.storageAnalysis.cards.allocated")}
          value={
            summary
              ? formatStorageAmount({
                  mb: summary.total_allocated_mb,
                  gb: summary.total_allocated_gb,
                })
              : loading
                ? "…"
                : "—"
          }
          hint={t("pages.storageAnalysis.cards.allocatedHint")}
        />
        <SummaryCard
          icon={StorageOutlinedIcon}
          label={t("pages.storageAnalysis.cards.used")}
          value={
            summary
              ? formatStorageAmount({
                  mb: summary.total_used_mb,
                  gb: summary.total_used_gb,
                })
              : loading
                ? "…"
                : "—"
          }
          hint={t("pages.storageAnalysis.cards.usedHint")}
        />
        <SummaryCard
          icon={ScienceOutlinedIcon}
          label={t("pages.storageAnalysis.cards.labs")}
          value={
            summary ? String(summary.laboratory_count) : loading ? "…" : "—"
          }
          hint={
            summary?.overall_usage_percent != null
              ? t("pages.storageAnalysis.cards.overallUsage", {
                  percent: summary.overall_usage_percent,
                })
              : null
          }
        />
        <SummaryCard
          icon={
            summary?.over_limit_count
              ? ErrorOutlineOutlinedIcon
              : WarningAmberOutlinedIcon
          }
          label={t("pages.storageAnalysis.cards.alerts")}
          value={
            summary
              ? t("pages.storageAnalysis.cards.alertValue", {
                  atRisk: summary.at_risk_count,
                  over: summary.over_limit_count,
                })
              : loading
                ? "…"
                : "—"
          }
          hint={t("pages.storageAnalysis.cards.alertsHint")}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: isPlatformScope
              ? "repeat(2, minmax(0, 1fr))"
              : "minmax(0, 1fr)",
          },
          gap: GRID_SPACING,
        }}
      >
        {loading && !labCards.length ? (
          <InfoDetailCard
            icon={ScienceOutlinedIcon}
            title="…"
            subtitle={t("pages.storageAnalysis.loadingDetails")}
          >
            <LinearProgress />
          </InfoDetailCard>
        ) : null}

        {!loading && !labCards.length ? (
          <InfoDetailCard
            icon={ScienceOutlinedIcon}
            title={t("pages.storageAnalysis.empty")}
            subtitle={t("pages.storageAnalysis.emptyHint")}
          />
        ) : null}

        {labCards.map((row) => (
          <InfoDetailCard
            key={row.id}
            icon={ScienceOutlinedIcon}
            title={row.name}
            subtitle={row.plan_name || t("pages.storageAnalysis.noPlan")}
            action={
              <Chip
                size="small"
                color={row.statusColor}
                label={row.statusLabel}
                sx={{ fontWeight: 700 }}
              />
            }
          >
            <InfoMetaList
              items={[
                {
                  key: "plan",
                  icon: WorkspacePremiumOutlinedIcon,
                  label: t("pages.storageAnalysis.columns.plan"),
                  value: (
                    <Typography variant="body2" fontWeight={600}>
                      {row.plan_name || "—"}
                    </Typography>
                  ),
                },
                {
                  key: "limit",
                  icon: StorageOutlinedIcon,
                  label: t("pages.storageAnalysis.columns.limit"),
                  value: (
                    <Typography variant="body2" fontWeight={600}>
                      {row.storage_limit_mb != null
                        ? `${row.storage_limit_mb} MB`
                        : "—"}
                    </Typography>
                  ),
                },
                {
                  key: "used",
                  icon: DataUsageOutlinedIcon,
                  label: t("pages.storageAnalysis.columns.used"),
                  value: (
                    <Typography variant="body2" fontWeight={600}>
                      {formatStorageAmount({
                        mb: row.used_mb,
                        gb: row.used_gb,
                      })}
                    </Typography>
                  ),
                },
                {
                  key: "usage",
                  icon: StorageOutlinedIcon,
                  label: t("pages.storageAnalysis.columns.usage"),
                  value: (
                    <Typography variant="body2" fontWeight={600}>
                      {row.usage_label || "—"}
                    </Typography>
                  ),
                },
                {
                  key: "progress",
                  icon: DataUsageOutlinedIcon,
                  label: t("pages.storageAnalysis.columns.progress"),
                  value: (
                    <UsageBar percent={row.usage_percent} status={row.status} />
                  ),
                },
              ]}
            />
          </InfoDetailCard>
        ))}
      </Box>
    </>
  );
}
