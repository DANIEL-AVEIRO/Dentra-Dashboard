import {
  Box,
  Button,
  IconButton,
  Paper,
  Portal,
  Slide,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useTranslation } from "@/context/LanguageContext";
import { useMainLayoutOffset } from "@/context/MainLayoutContext";
import { TABLE_BORDER_RADIUS } from "@/constants/layout";
import TableBulkActionButton from "@/components/common/TableBulkActionButton";
import { transition } from "@/constants/motion";

/**
 * Toolbar shown when table rows are selected.
 * @param {Array<{ id: string, label: string, onClick: () => void, color?: string, variant?: string, disabled?: boolean, icon?: React.ReactNode }>} actions
 */
export default function TableBulkBar({
  selectedCount,
  onClear,
  actions = [],
  embedded = false,
  totalMatchingCount = 0,
  allMatching = false,
  onSelectAllMatching,
  showSelectAllMatching = false,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const mainOffset = useMainLayoutOffset();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.primary.main;

  if (!selectedCount) return null;

  const content = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ flex: 1, minWidth: 0, flexWrap: "wrap", rowGap: 1 }}
        useFlexGap
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.875,
            px: 1.375,
            py: 0.5,
            borderRadius: 999,
            flexShrink: 0,
            bgcolor: alpha(accent, isDark ? 0.22 : 0.1),
            border: `1px solid ${alpha(accent, isDark ? 0.4 : 0.22)}`,
          }}
        >
          <DoneAllOutlinedIcon sx={{ fontSize: 17, color: accent }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: accent, lineHeight: 1.2 }}
          >
            {t("table.selected", { count: selectedCount })}
          </Typography>
        </Box>

        {showSelectAllMatching && !allMatching && onSelectAllMatching ? (
          <Button
            size="small"
            variant="text"
            onClick={onSelectAllMatching}
            sx={{ fontWeight: 700, textTransform: "none", flexShrink: 0 }}
          >
            {t("table.selectAllMatching", { count: totalMatchingCount })}
          </Button>
        ) : null}

        {allMatching ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {t("table.allMatchingSelected", { count: totalMatchingCount })}
          </Typography>
        ) : null}

        {actions.length > 0 ? (
          <>
            <Box
              aria-hidden
              sx={{
                width: "1px",
                alignSelf: "stretch",
                minHeight: 28,
                bgcolor: "divider",
                flexShrink: 0,
                display: { xs: "none", sm: "block" },
              }}
            />
            <Stack
              direction="row"
              spacing={0.75}
              flexWrap="wrap"
              useFlexGap
              sx={{ flex: 1, minWidth: 0 }}
            >
              {actions.map((action) => (
                <TableBulkActionButton key={action.id} action={action} />
              ))}
            </Stack>
          </>
        ) : null}
      </Stack>

      <Tooltip title={t("common.clear")} arrow placement="top">
        <IconButton
          size="small"
          onClick={onClear}
          aria-label={t("common.clear")}
          sx={{
            flexShrink: 0,
            width: 34,
            height: 34,
            color: "text.secondary",
            bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : "grey.100",
            border: `1px solid ${theme.palette.divider}`,
            transition: transition("background-color, color, border-color"),
            "&:hover": {
              color: "text.primary",
              bgcolor: isDark ? alpha(theme.palette.common.white, 0.1) : "grey.200",
              borderColor: alpha(theme.palette.text.primary, 0.2),
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
    </>
  );

  if (embedded) {
    const anchorLeft = `calc(${mainOffset}px + (100dvw - ${mainOffset}px) / 2)`;
    const barWidth = `min(960px, calc(100dvw - ${mainOffset}px - 24px))`;

    return (
      <Portal>
        <Box
          sx={{
            position: "fixed",
            bottom: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom, 0px))`,
            left: anchorLeft,
            transform: "translateX(-50%)",
            width: barWidth,
            maxWidth: `calc(100dvw - ${mainOffset}px - 16px)`,
            zIndex: theme.zIndex.snackbar,
            pointerEvents: "none",
            px: { xs: 1, sm: 0 },
          }}
        >
          <Slide direction="up" in={selectedCount > 0} mountOnEnter unmountOnExit>
            <Paper
              elevation={8}
              role="toolbar"
              aria-label={t("table.selected", { count: selectedCount })}
              sx={{
                pointerEvents: "auto",
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                borderRadius: TABLE_BORDER_RADIUS,
                border: 1,
                borderColor: alpha(accent, 0.35),
                bgcolor: isDark ? alpha(accent, 0.14) : "background.paper",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: `0 12px 40px ${alpha(accent, isDark ? 0.35 : 0.18)}, inset 3px 0 0 ${alpha(accent, isDark ? 0.85 : 1)}`,
              }}
            >
              {content}
            </Paper>
          </Slide>
        </Box>
      </Portal>
    );
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: TABLE_BORDER_RADIUS,
        border: 1,
        borderColor: alpha(accent, 0.35),
        bgcolor: isDark ? alpha(accent, 0.1) : alpha(accent, 0.05),
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: `inset 3px 0 0 ${alpha(accent, isDark ? 0.85 : 1)}`,
      }}
      role="toolbar"
      aria-label={t("table.selected", { count: selectedCount })}
    >
      {content}
    </Box>
  );
}
