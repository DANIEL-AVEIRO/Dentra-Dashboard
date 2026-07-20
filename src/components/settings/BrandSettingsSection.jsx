import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import client from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { useBrand } from "@/context/BrandContext";
import { useTranslation } from "@/context/LanguageContext";
import { DEFAULT_BRAND } from "@/constants/brand";
import { normalizeBrandPalette } from "@/utils/brandPalette";
import ActionButton from "@/components/common/ActionButton";
import ImageField from "@/components/common/ImageField";
import SettingsSection from "@/components/settings/SettingsSection";
import { SettingsInfoCallout } from "@/components/settings/SettingsNavItem";
import { extractBrandColorsFromFile } from "@/utils/extractBrandColors";
import { toast, getErrorMessage } from "@/utils/toast";

function ColorSwatch({ label, color }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1.25,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: (t) =>
          alpha(t.palette.background.paper, t.palette.mode === "light" ? 0.9 : 0.4),
      }}
    >
      <Box
        sx={{
          height: 44,
          borderRadius: 1.5,
          bgcolor: color,
          border: 1,
          borderColor: "divider",
          boxShadow: `inset 0 1px 0 ${alpha("#fff", 0.35)}`,
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1, fontWeight: 600, letterSpacing: 0.02 }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        fontWeight={700}
        sx={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 0.02 }}
      >
        {String(color).toUpperCase()}
      </Typography>
    </Box>
  );
}

function ThemeLayoutPreview({ colors, logoSrc, title }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        border: 1,
        borderColor: alpha(colors.primary, isLight ? 0.14 : 0.28),
        boxShadow: isLight
          ? `0 12px 32px ${alpha(colors.primary, 0.1)}`
          : `0 12px 32px ${alpha("#000", 0.35)}`,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          background: `linear-gradient(135deg, ${colors.darker} 0%, ${colors.primary} 55%, ${colors.dark} 100%)`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              bgcolor: alpha("#fff", 0.12),
              border: `1px solid ${alpha("#fff", 0.2)}`,
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {logoSrc ? (
              <Box
                component="img"
                src={logoSrc}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.35 }}
              />
            ) : null}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.02 }}
          >
            {title}
          </Typography>
        </Stack>
        <Box
          sx={{
            height: 8,
            width: 56,
            borderRadius: 999,
            bgcolor: colors.secondary,
            boxShadow: `0 0 12px ${alpha(colors.secondary, 0.55)}`,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          minHeight: 118,
          background: `linear-gradient(160deg, ${alpha(colors.primary, isLight ? 0.06 : 0.18)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 48%, ${alpha(colors.secondary, isLight ? 0.05 : 0.12)} 100%)`,
        }}
      >
        <Box
          sx={{
            p: 1.25,
            borderRight: 1,
            borderColor: alpha(colors.primary, 0.1),
            background: `linear-gradient(180deg, ${alpha(colors.dark, 0.92)} 0%, ${alpha(colors.darker, 0.96)} 100%)`,
          }}
        >
          {[0.9, 0.55, 0.35].map((op, i) => (
            <Box
              key={i}
              sx={{
                height: 8,
                borderRadius: 999,
                mb: 1,
                bgcolor: alpha("#fff", op * 0.35),
                width: i === 0 ? "100%" : `${72 - i * 12}%`,
              }}
            />
          ))}
          <Box
            sx={{
              mt: 1.5,
              height: 22,
              borderRadius: 1.25,
              bgcolor: alpha(colors.secondary, 0.35),
              border: `1px solid ${alpha(colors.secondary, 0.5)}`,
            }}
          />
        </Box>

        <Box sx={{ p: 1.5 }}>
          <Box
            sx={{
              height: 10,
              width: "42%",
              borderRadius: 999,
              bgcolor: alpha(colors.primary, 0.55),
              mb: 1.25,
            }}
          />
          <Box
            sx={{
              height: 6,
              width: "68%",
              borderRadius: 999,
              bgcolor: alpha(colors.primary, 0.18),
              mb: 1.5,
            }}
          />
          <Stack direction="row" spacing={1}>
            {[colors.primary, colors.secondary, colors.dark].map((c) => (
              <Box
                key={c}
                sx={{
                  flex: 1,
                  height: 42,
                  borderRadius: 1.5,
                  bgcolor: alpha(c, isLight ? 0.14 : 0.28),
                  border: `1px solid ${alpha(c, 0.28)}`,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          height: 10,
        }}
      >
        {[colors.primary, colors.secondary, colors.dark, colors.darker].map((c) => (
          <Box key={c} sx={{ bgcolor: c }} />
        ))}
      </Box>
    </Box>
  );
}

export default function BrandSettingsSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { brand, logoUrl, refresh } = useBrand();
  const isStaff = Boolean(user?.is_staff || user?.is_superuser);

  const [logoFile, setLogoFile] = useState(null);
  const [colors, setColors] = useState({
    primary: brand.primary,
    secondary: brand.secondary,
    dark: brand.dark,
    darker: brand.darker,
  });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    setColors({
      primary: brand.primary,
      secondary: brand.secondary,
      dark: brand.dark,
      darker: brand.darker,
    });
    setLogoFile(null);
    setLocalPreview(null);
  }, [brand.primary, brand.secondary, brand.dark, brand.darker, brand.logo]);

  useEffect(() => {
    if (!logoFile) {
      setLocalPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(logoFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const previewLogo = localPreview || logoUrl;

  const dirty = useMemo(() => {
    if (logoFile) return true;
    return (
      colors.primary !== brand.primary ||
      colors.secondary !== brand.secondary ||
      colors.dark !== brand.dark ||
      colors.darker !== brand.darker
    );
  }, [brand, colors, logoFile]);

  const handleLogoChange = async (file) => {
    setLogoFile(file);
    if (!file) return;
    try {
      const extracted = await extractBrandColorsFromFile(file);
      if (extracted) setColors(normalizeBrandPalette(extracted, DEFAULT_BRAND));
    } catch {
      toast.error(t("pages.settings.brand.extractFailed"));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const palette = normalizeBrandPalette(colors, DEFAULT_BRAND);
      const fd = new FormData();
      if (logoFile) fd.append("logo", logoFile);
      fd.append("primary", palette.primary);
      fd.append("secondary", palette.secondary);
      fd.append("dark", palette.dark);
      fd.append("darker", palette.darker);
      await client.patch("/brand/", fd);
      await refresh();
      setLogoFile(null);
      toast.success(t("pages.settings.brand.saved"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("pages.settings.brand.saveFailed")));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await client.patch("/brand/", { reset: true });
      await refresh();
      setLogoFile(null);
      setColors({
        primary: DEFAULT_BRAND.primary,
        secondary: DEFAULT_BRAND.secondary,
        dark: DEFAULT_BRAND.dark,
        darker: DEFAULT_BRAND.darker,
      });
      toast.success(t("pages.settings.brand.resetDone"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("pages.settings.brand.resetFailed")));
    } finally {
      setResetting(false);
    }
  };

  if (!isStaff) return null;

  return (
    <SettingsSection
      icon={ImageOutlinedIcon}
      title={t("pages.settings.brand.title")}
      description={t("pages.settings.brand.desc")}
    >
      <Stack spacing={2.25} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <SettingsInfoCallout>{t("pages.settings.brand.hint")}</SettingsInfoCallout>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 240px) minmax(0, 1fr)",
            },
            gap: 2.25,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              border: 1,
              borderColor: alpha(colors.primary, 0.12),
              background: `linear-gradient(160deg, ${alpha(colors.primary, 0.06)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 55%, ${alpha(colors.secondary, 0.05)} 100%)`,
            }}
          >
            <ImageField
              label={t("pages.settings.brand.logoLabel")}
              value={logoFile}
              previewUrl={logoFile ? null : logoUrl}
              onChange={handleLogoChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              resizePreset="logo"
              compact
              fullWidth
            />
          </Box>

          <Stack spacing={1.75}>
            <ThemeLayoutPreview
              colors={colors}
              logoSrc={previewLogo}
              title={t("pages.settings.brand.previewTitle")}
            />

            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 1.25 }}>
                {t("pages.settings.brand.colorsTitle")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.25,
                }}
              >
                <ColorSwatch label={t("pages.settings.brand.primary")} color={colors.primary} />
                <ColorSwatch label={t("pages.settings.brand.secondary")} color={colors.secondary} />
                <ColorSwatch label={t("pages.settings.brand.dark")} color={colors.dark} />
                <ColorSwatch label={t("pages.settings.brand.darker")} color={colors.darker} />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 1.25, lineHeight: 1.5 }}
              >
                {t("pages.settings.brand.colorsHint")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="flex-end"
          sx={{
            pt: 1,
            borderTop: 1,
            borderColor: alpha(colors.primary, 0.12),
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={handleReset}
            disabled={resetting || saving}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
          >
            {resetting ? t("common.saving") : t("pages.settings.brand.reset")}
          </Button>
          <ActionButton
            onClick={handleSave}
            disabled={!dirty || saving || resetting}
            loading={saving}
          >
            {t("pages.settings.brand.save")}
          </ActionButton>
        </Stack>
      </Stack>
    </SettingsSection>
  );
}
