import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { alpha, useTheme } from "@mui/material/styles";
import StatusChip from "@/components/common/StatusChip";
import ResourceId from "@/components/common/ResourceId";
import ActionButton from "@/components/common/ActionButton";
import { useTranslation } from "@/context/LanguageContext";
import { glassPanelSx } from "@/constants/glassSurface";
import { hideScrollbarSx } from "@/constants/tableStyles";
import { transition, PREVIEW_DRAWER_MS, EASE_SOFT, EASE_SMOOTH, DURATION } from "@/constants/motion";
import { formatPreviewFieldValue } from "@/utils/displayValue";
import { formatDateTime } from "@/utils/format";
import PhotoThumbStrip from "@/components/common/PhotoThumbStrip";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const SECTION_META = {
  contact: {
    titleKey: "table.preview.contact",
    defaultTitle: "Contact",
    Icon: PersonOutlineOutlinedIcon,
  },
  location: {
    titleKey: "table.preview.location",
    defaultTitle: "Location",
    Icon: PlaceOutlinedIcon,
  },
  schedule: {
    titleKey: "table.preview.schedule",
    defaultTitle: "Schedule",
    Icon: ScheduleOutlinedIcon,
  },
  related: {
    titleKey: "table.preview.related",
    defaultTitle: "Related",
    Icon: LinkOutlinedIcon,
  },
  details: {
    titleKey: "table.preview.details",
    defaultTitle: "Details",
    Icon: InfoOutlinedIcon,
  },
};

const SECTION_ORDER = ["contact", "location", "schedule", "related", "details"];

function inferFieldGroup(key = "") {
  const k = String(key).toLowerCase();
  if (/name|phone|merchant|user_name|rider/.test(k)) return "contact";
  if (/address|location/.test(k)) return "location";
  if (/date|time|sched/.test(k)) return "schedule";
  if (/pickup|ref|merchant_id|delivery_id/.test(k)) return "related";
  return "details";
}

function PreviewFieldRow({ label, children }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
      sx={{
        py: 1.125,
        "&:not(:last-child)": {
          borderBottom: 1,
          borderColor: (theme) => alpha(theme.palette.divider, 0.65),
        },
      }}
    >
      <Typography
        variant="caption"
        component="div"
        color="text.secondary"
        fontWeight={700}
        sx={{ minWidth: 92, flexShrink: 0, pt: 0.2, lineHeight: 1.35 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        fontWeight={500}
        sx={{ flex: 1, minWidth: 0, wordBreak: "break-word", lineHeight: 1.45 }}
      >
        {children ?? "—"}
      </Typography>
    </Stack>
  );
}

function PreviewSection({ title, Icon, children, theme }) {
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  return (
    <Box
      sx={{
        ...glassPanelSx(theme),
        borderRadius: 2.5,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(primary, theme.palette.mode === "light" ? 0.08 : 0.18),
            color: primary,
          }}
        >
          <Icon sx={{ fontSize: 17 }} />
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
          {title}
        </Typography>
      </Stack>
      <Box>{children}</Box>
    </Box>
  );
}

function PreviewFooterActions({ onClose, onOpenDetail, showOpenDetail = true, t, theme, isLight }) {
  const actionHeight = 48;
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  return (
    <Box
      sx={{
        flexShrink: 0,
        position: "relative",
        px: 2,
        pt: 1.75,
        pb: 2,
        borderTop: 1,
        borderColor: alpha(primary, isLight ? 0.1 : 0.22),
        bgcolor: alpha(theme.palette.background.paper, isLight ? 0.94 : 0.78),
        backdropFilter: "blur(12px)",
        boxShadow: isLight
          ? `0 -8px 28px ${alpha(primary, 0.06)}`
          : `0 -10px 32px ${alpha("#000", 0.28)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 16,
          right: 16,
          height: 3,
          borderRadius: "0 0 999px 999px",
          background: `linear-gradient(90deg, ${primary}, ${secondary})`,
          opacity: 0.85,
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
        sx={{ mb: 1.25, lineHeight: 1.35 }}
      >
        {showOpenDetail
          ? t("table.preview.footerHint", {
              defaultValue: "Need more fields, timeline, or actions?",
            })
          : t("table.preview.footerHintClose", {
              defaultValue: "Close this preview to return to the list.",
            })}
      </Typography>

      <Stack direction="row" spacing={1.25} alignItems="stretch">
        <Button
          variant="outlined"
          size="large"
          startIcon={<CloseRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />}
          onClick={onClose}
          sx={{
            flex: showOpenDetail ? 1 : 1,
            minWidth: 0,
            minHeight: actionHeight,
            py: 1.1,
            px: 1.5,
            fontWeight: 700,
            fontSize: "0.8125rem",
            textTransform: "none",
            whiteSpace: "nowrap",
            color: "text.primary",
            borderColor: alpha(primary, isLight ? 0.22 : 0.34),
            bgcolor: alpha(theme.palette.background.paper, isLight ? 0.7 : 0.35),
            transition: transition("background-color, border-color, box-shadow"),
            "& .MuiButton-startIcon": { mr: 0.75 },
            "&:hover": {
              borderColor: alpha(primary, isLight ? 0.42 : 0.52),
              bgcolor: alpha(primary, isLight ? 0.05 : 0.12),
              boxShadow: `0 4px 14px ${alpha(primary, 0.1)}`,
            },
          }}
        >
          {t("table.closePreview", { defaultValue: "Close preview" })}
        </Button>

        {showOpenDetail ? (
          <ActionButton
            intent="confirm"
            size="large"
            startIcon={<LaunchRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />}
            onClick={onOpenDetail}
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: actionHeight,
              py: 1.1,
              px: 1.5,
              fontSize: "0.8125rem",
              letterSpacing: "0.01em",
              textTransform: "none",
              whiteSpace: "nowrap",
              "& .MuiButton-startIcon": { mr: 0.75 },
            }}
          >
            {t("table.openFullDetail", { defaultValue: "Open full detail" })}
          </ActionButton>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function TableRowPreviewDrawer({
  open,
  onClose,
  row,
  title,
  idKey,
  displayId,
  statusKey,
  statusList,
  fields = [],
  detailPath,
  onOpenDetail,
  showOpenDetail = true,
  imageKey = null,
  imageUrls = [],
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isLight = theme.palette.mode === "light";
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const [contentVisible, setContentVisible] = useState(false);
  const rowToken = row ? String(displayId ?? row[idKey] ?? row.id ?? "") : "";

  useEffect(() => {
    if (!open || !rowToken) {
      setContentVisible(false);
      return undefined;
    }
    setContentVisible(false);
    const timer = window.setTimeout(
      () => setContentVisible(true),
      Math.round(PREVIEW_DRAWER_MS.enter * 0.3)
    );
    return () => window.clearTimeout(timer);
  }, [open, rowToken]);

  if (!row) return null;

  const id = displayId ?? row[idKey];
  const status = row[statusKey];
  const imageSrc =
    imageKey != null && imageKey !== "" ? resolveMediaUrl(row[imageKey]) : null;
  const galleryUrls = Array.isArray(imageUrls) ? imageUrls : [];

  const resolvedFields = fields
    .map((field) => {
      const value = formatPreviewFieldValue(row, field);
      if (value == null || value === "") return null;
      return {
        ...field,
        value,
        group: field.group || inferFieldGroup(field.key),
      };
    })
    .filter(Boolean);

  const groupedFields = SECTION_ORDER.map((groupKey) => {
    const items = resolvedFields.filter((f) => f.group === groupKey);
    if (!items.length) return null;
    const meta = SECTION_META[groupKey] || SECTION_META.details;
    return {
      key: groupKey,
      title: t(meta.titleKey, { defaultValue: meta.defaultTitle }),
      Icon: meta.Icon,
      items,
    };
  }).filter(Boolean);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={PREVIEW_DRAWER_MS}
      slotProps={{
        transition: {
          easing: {
            enter: EASE_SOFT,
            exit: EASE_SMOOTH,
          },
        },
        backdrop: {
          transitionDuration: PREVIEW_DRAWER_MS,
        },
      }}
      ModalProps={{
        disableScrollLock: true,
        sx: {
          bgcolor: alpha("#0f0a14", isLight ? 0.28 : 0.52),
          backdropFilter: open ? "blur(4px)" : "blur(0px)",
          transition: transition(
            "background-color, backdrop-filter",
            PREVIEW_DRAWER_MS.enter,
            EASE_SOFT
          ),
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420, md: 440 },
          maxWidth: "100%",
          p: 0,
          borderLeft: `1px solid ${alpha(primary, isLight ? 0.12 : 0.22)}`,
          boxShadow: isLight
            ? `-12px 0 48px ${alpha(primary, 0.14)}`
            : `-16px 0 56px ${alpha("#000", 0.55)}`,
          bgcolor: "background.default",
          willChange: "transform",
          transition: transition("box-shadow", PREVIEW_DRAWER_MS.enter, EASE_SOFT),
        },
      }}
    >
      <Stack sx={{ height: "100%", minHeight: 0 }}>
        <Stack
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "translateX(0)" : "translateX(14px)",
            transition: transition("opacity, transform", DURATION.normal, EASE_SOFT),
          }}
        >
          <Box
            sx={{
              position: "relative",
              px: 2.25,
              pt: 2.25,
              pb: 2,
            background: isLight
              ? `linear-gradient(145deg, ${alpha(primary, 0.1)} 0%, ${alpha(secondary, 0.06)} 48%, ${alpha("#fff", 0.92)} 100%)`
              : `linear-gradient(145deg, ${alpha(primary, 0.32)} 0%, ${alpha("#1a1520", 0.95)} 62%, ${alpha("#121018", 1)} 100%)`,
            borderBottom: `1px solid ${alpha(primary, isLight ? 0.12 : 0.24)}`,
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label={t("common.close", { defaultValue: "Close" })}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: alpha(theme.palette.background.paper, isLight ? 0.82 : 0.35),
              border: 1,
              borderColor: alpha(primary, 0.14),
              transition: transition("background-color, border-color"),
              "&:hover": {
                bgcolor: alpha(theme.palette.background.paper, isLight ? 0.95 : 0.5),
                borderColor: alpha(primary, 0.28),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="overline"
            sx={{
              display: "block",
              pr: 5,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: alpha(primary, isLight ? 0.85 : 0.92),
            }}
          >
            {title}
          </Typography>

          <ResourceId variant="h5" display="block" sx={{ mt: 0.5, pr: 5, lineHeight: 1.2 }}>
            {id}
          </ResourceId>

          {status ? (
            <Box sx={{ mt: 1.5 }}>
              <StatusChip value={status} statusList={statusList} size="md" />
            </Box>
          ) : null}

          <Box
            sx={{
              mt: 2,
              width: 52,
              height: 4,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${primary}, ${secondary})`,
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 2, ...hideScrollbarSx() }}>
          {galleryUrls.length > 0 ? (
            <PhotoThumbStrip urls={galleryUrls} variant="drawer" />
          ) : imageSrc ? (
            <Box sx={{ mb: 2 }}>
              <Box
                component="img"
                src={imageSrc}
                alt={String(id || "Package")}
                sx={{
                  width: "100%",
                  maxHeight: 280,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Box>
          ) : null}

          <Stack spacing={1.75}>
            {groupedFields.map((section) => (
              <PreviewSection
                key={section.key}
                title={section.title}
                Icon={section.Icon}
                theme={theme}
              >
                {section.items.map(({ key, label, value }) => (
                  <PreviewFieldRow key={key} label={label}>
                    {value}
                  </PreviewFieldRow>
                ))}
              </PreviewSection>
            ))}

            {row.updated_at ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.text.primary, isLight ? 0.03 : 0.06),
                  border: 1,
                  borderColor: alpha(primary, isLight ? 0.08 : 0.16),
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t("fields.updatedAt", { defaultValue: "Updated" })}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25 }}>
                  {formatDateTime(row.updated_at)}
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Box>
        </Stack>

        <PreviewFooterActions
          t={t}
          theme={theme}
          isLight={isLight}
          showOpenDetail={showOpenDetail}
          onClose={onClose}
          onOpenDetail={() => {
            if (onOpenDetail) {
              onOpenDetail(row, detailPath);
            } else if (detailPath) {
              navigate(detailPath);
            }
            onClose();
          }}
        />
      </Stack>
    </Drawer>
  );
}
