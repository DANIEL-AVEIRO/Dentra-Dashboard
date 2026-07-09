import { Link } from "react-router-dom";
import { Box, Chip, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "@/context/LanguageContext";
import { useBrand } from "@/context/BrandContext";
import { transition } from "@/constants/motion";

/**
 * Sidebar header — logo mark, wordmark, and admin badge (replaces plain text block).
 */
export default function SidebarBrand({ onNavigate }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { logoUrl } = useBrand();
  const isDark = theme.palette.mode === "dark";
  const brandPrimary = theme.palette.primary.main;
  const brandSecondary = theme.palette.secondary.main;

  return (
    <Box
      component={Link}
      to="/"
      onClick={onNavigate}
      aria-label={t("brand.homeAria")}
      sx={{
        display: "block",
        mx: 1.5,
        mt: 1.5,
        mb: 1,
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        overflow: "hidden",
        transition: transition("box-shadow"),
        "&:hover": {
          "& .sidebar-brand-card": {
            boxShadow: isDark
              ? `0 8px 28px ${alpha("#000", 0.35)}`
              : `0 8px 24px ${alpha(brandPrimary, 0.14)}`,
          },
        },
        "&:focus-visible": {
          outline: `2px solid ${brandPrimary}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        className="sidebar-brand-card"
        sx={{
          position: "relative",
          px: 1.5,
          py: 1.5,
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${alpha(brandPrimary, isDark ? 0.28 : 0.14)}`,
          background: isDark
            ? `linear-gradient(145deg, ${alpha(brandPrimary, 0.22)} 0%, ${alpha("#1a1520", 0.6)} 55%, ${alpha(brandSecondary, 0.12)} 100%)`
            : `linear-gradient(145deg, ${alpha(brandPrimary, 0.1)} 0%, ${alpha("#fff", 0.95)} 50%, ${alpha(brandSecondary, 0.06)} 100%)`,
          boxShadow: isDark
            ? `inset 0 1px 0 ${alpha("#fff", 0.06)}`
            : `inset 0 1px 0 ${alpha("#fff", 0.9)}`,
          transition: transition("box-shadow"),
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -24,
            right: -24,
            width: 88,
            height: 88,
            borderRadius: "50%",
            bgcolor: alpha(brandSecondary, isDark ? 0.15 : 0.08),
            pointerEvents: "none",
          }}
        />

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: "relative" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark ? alpha("#fff", 0.08) : "#fff",
              border: `1px solid ${alpha(brandPrimary, 0.12)}`,
              boxShadow: `0 4px 14px ${alpha(brandPrimary, 0.18)}`,
            }}
          >
            <Box
              component="img"
              src={logoUrl}
              alt=""
              sx={{
                width: 36,
                height: 36,
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: isDark ? "#fff" : brandPrimary,
              }}
            >
              {t("brand.name")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontSize: "0.68rem",
                color: brandSecondary,
                lineHeight: 1.3,
                mt: 0.15,
              }}
            >
              {t("brand.product")}
            </Typography>
            <Chip
              label={t("brand.adminBadge")}
              size="small"
              sx={{
                mt: 0.75,
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                bgcolor: alpha(brandPrimary, isDark ? 0.35 : 0.1),
                color: isDark ? "#fff" : brandPrimary,
                border: `1px solid ${alpha(brandPrimary, isDark ? 0.45 : 0.2)}`,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
