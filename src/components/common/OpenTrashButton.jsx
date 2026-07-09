import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Button, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "@/context/LanguageContext";
import { transition } from "@/constants/motion";
import { trashUrlFromContext } from "@/utils/trashNavigation";

/**
 * Secondary toolbar control — navigate to trash without competing with primary "Add".
 */
export default function OpenTrashButton({ to, resourceId }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
  const { pathname } = useLocation();
  const target =
    to ?? trashUrlFromContext({ pathname, trashResourceId: resourceId });

  return (
    <Tooltip title={t("pages.settings.system.trashDesc")} arrow placement="bottom">
      <Button
        component={RouterLink}
        to={target}
        variant="outlined"
        size="small"
        aria-label={t("nav.trash")}
        sx={{
          px: 1.25,
          py: 0.5,
          minHeight: 38,
          textTransform: "none",
          fontWeight: 600,
          borderColor: alpha(primary, isDark ? 0.32 : 0.2),
          bgcolor: isDark ? alpha(primary, 0.1) : alpha(primary, 0.035),
          color: isDark ? alpha("#fff", 0.82) : "text.primary",
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, isDark ? 0.2 : 0.06)}`,
          transition: transition("border-color, background-color, box-shadow, color"),
          "&:hover": {
            borderColor: alpha(primary, 0.45),
            bgcolor: isDark ? alpha(primary, 0.18) : alpha(primary, 0.08),
            color: "primary.main",
            boxShadow: `0 3px 10px ${alpha(primary, 0.14)}`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 1.25,
              flexShrink: 0,
              color: "primary.main",
              bgcolor: alpha(primary, isDark ? 0.28 : 0.1),
              border: `1px solid ${alpha(primary, isDark ? 0.4 : 0.18)}`,
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 17 }} />
          </Box>
          <Box sx={{ textAlign: "left", minWidth: 0, pr: 0.25 }}>
            <Typography
              component="span"
              variant="body2"
              fontWeight={700}
              lineHeight={1.2}
              sx={{ display: "block" }}
            >
              {t("nav.trash")}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              lineHeight={1.2}
              sx={{
                display: { xs: "none", sm: "block" },
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t("common.openTrashHint")}
            </Typography>
          </Box>
          <ChevronRightIcon
            sx={{
              fontSize: 18,
              opacity: 0.45,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
            }}
          />
        </Box>
      </Button>
    </Tooltip>
  );
}
