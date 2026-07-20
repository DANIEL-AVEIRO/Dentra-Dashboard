import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import client from "@/api/client";
import Skel from "@/components/common/skeletons/Skel";
import { useTranslation } from "@/context/LanguageContext";
import { glassPanelSx } from "@/constants/glassSurface";
import {
  ACTION_COLORS,
  formatAuditDateTime,
  getAuditActionLabel,
  parseAuditChanges,
} from "@/utils/auditDisplay";

async function fetchAllAuditLogs({ modelName, objectId }) {
  const pageSize = 100;
  let page = 1;
  let results = [];
  let hasMore = true;

  while (hasMore) {
    const { data } = await client.get("/audit-logs/", {
      params: {
        model: modelName,
        object_id: objectId,
        page_size: pageSize,
        page,
        ordering: "-created_at",
      },
      skipTopLoader: true,
    });
    const batch = data.results ?? data ?? [];
    results = results.concat(batch);
    const total = data.count;
    hasMore =
      Array.isArray(data.results) &&
      batch.length > 0 &&
      (typeof total === "number" ? results.length < total : Boolean(data.next));
    page += 1;
    if (page > 50) break;
  }

  return results;
}

function ValueText({ children, muted = false }) {
  return (
    <Typography
      component="span"
      variant="body2"
      sx={{
        fontWeight: muted ? 500 : 600,
        color: muted ? "text.secondary" : "text.primary",
        textDecoration: muted ? "line-through" : "none",
        opacity: muted ? 0.75 : 1,
        wordBreak: "break-word",
        lineHeight: 1.4,
      }}
    >
      {children}
    </Typography>
  );
}

function ChangeRows({ changes, t, locale, theme, isLight }) {
  const items = parseAuditChanges(changes, t, locale, { maxSnapshotFields: null });
  if (!items.length) {
    return (
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {t("audit.noChanges")}
      </Typography>
    );
  }

  return (
    <Stack spacing={0.75} sx={{ mt: 0.5 }}>
      {changes?.snapshot ? (
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          {t("audit.detail.newRecordFields", { defaultValue: "New record details" })}
        </Typography>
      ) : (
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          {t("audit.detail.whatChanged", { defaultValue: "What changed" })}
        </Typography>
      )}

      <Stack spacing={0.75}>
        {items.map((item) => (
          <Box
            key={item.fieldKey}
            sx={{
              px: 1.25,
              py: 1,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.text.primary, isLight ? 0.03 : 0.06),
              border: 1,
              borderColor: alpha(theme.palette.divider, isLight ? 0.8 : 0.5),
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5, lineHeight: 1.3 }}
            >
              {item.field}
            </Typography>

            {item.kind === "change" ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                flexWrap="wrap"
                useFlexGap
              >
                <ValueText muted>{item.old}</ValueText>
                <ArrowForwardRoundedIcon
                  sx={{ fontSize: 14, color: "text.disabled", flexShrink: 0 }}
                />
                <ValueText>{item.new}</ValueText>
              </Stack>
            ) : (
              <ValueText>{item.new}</ValueText>
            )}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

function ActivityLogEntry({ entry, t, locale, theme, isLight, isLast }) {
  const actionLabel = getAuditActionLabel(entry, t);
  const who =
    entry.user_repr ||
    entry.user_username ||
    t("audit.systemUser", { defaultValue: "System" });
  const actionColor = ACTION_COLORS[entry.action] || "default";
  const railColor =
    actionColor === "default"
      ? theme.palette.text.disabled
      : theme.palette[actionColor]?.main || theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "14px 1fr",
        columnGap: 1.25,
        pb: isLast ? 0 : 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 0.35,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: railColor,
            boxShadow: `0 0 0 3px ${alpha(railColor, isLight ? 0.18 : 0.28)}`,
            flexShrink: 0,
          }}
        />
        {!isLast ? (
          <Box
            sx={{
              flex: 1,
              width: 2,
              mt: 0.75,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.divider, isLight ? 0.9 : 0.55),
            }}
          />
        ) : null}
      </Box>

      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            size="small"
            label={actionLabel}
            color={actionColor}
            variant="filled"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 700,
              "& .MuiChip-label": { px: 1 },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ whiteSpace: "nowrap" }}
          >
            {formatAuditDateTime(entry.created_at, locale)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center">
          <PersonOutlineOutlinedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
            {who}
          </Typography>
        </Stack>

        <ChangeRows
          changes={entry.changes}
          t={t}
          locale={locale}
          theme={theme}
          isLight={isLight}
        />
      </Stack>
    </Box>
  );
}

export default function PreviewActivityLog({ modelName, objectId }) {
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const isLight = theme.palette.mode === "light";
  const primary = theme.palette.primary.main;
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modelName || !objectId) {
      setEntries([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    fetchAllAuditLogs({ modelName, objectId })
      .then((results) => {
        if (cancelled) return;
        setEntries(results);
      })
      .catch(() => {
        if (cancelled) return;
        setEntries([]);
        setError(
          t("table.preview.activityLogLoadFailed", {
            defaultValue: "Could not load activity log",
          })
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [modelName, objectId, t]);

  if (!modelName || !objectId) return null;

  return (
    <Box
      sx={{
        ...glassPanelSx(theme),
        borderRadius: 2.5,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.75 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(primary, isLight ? 0.08 : 0.18),
              color: primary,
            }}
          >
            <HistoryOutlinedIcon sx={{ fontSize: 17 }} />
          </Box>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "text.secondary",
              lineHeight: 1.2,
            }}
          >
            {t("table.preview.activityLog", { defaultValue: "Activity log" })}
          </Typography>
        </Stack>
        {!loading && !error && entries.length > 0 ? (
          <Chip
            size="small"
            label={t("table.preview.activityLogCount", {
              count: entries.length,
              defaultValue: `${entries.length}`,
            })}
            variant="outlined"
            sx={{ height: 22, fontWeight: 700, fontSize: "0.7rem" }}
          />
        ) : null}
      </Stack>

      {loading ? (
        <Stack spacing={1.5}>
          {[0, 1, 2].map((i) => (
            <Stack key={i} direction="row" spacing={1.25}>
              <Skel variant="circular" width={10} height={10} sx={{ mt: 0.5 }} />
              <Stack spacing={0.75} sx={{ flex: 1 }}>
                <Skel variant="rounded" width="35%" height={22} />
                <Skel variant="text" width="55%" />
                <Skel variant="rounded" width="100%" height={48} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : error ? (
        <Typography variant="body2" color="error.main" fontWeight={600}>
          {error}
        </Typography>
      ) : entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {t("audit.empty")}
        </Typography>
      ) : (
        <Box>
          {entries.map((entry, index) => (
            <ActivityLogEntry
              key={entry.id}
              entry={entry}
              t={t}
              locale={locale}
              theme={theme}
              isLight={isLight}
              isLast={index === entries.length - 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
