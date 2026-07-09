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
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: "100%",
          height: 36,
          borderRadius: 1.5,
          bgcolor: color,
          border: 1,
          borderColor: "divider",
        }}
      />
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={700} sx={{ fontFamily: "monospace" }}>
        {color}
      </Typography>
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

  useEffect(() => {
    setColors({
      primary: brand.primary,
      secondary: brand.secondary,
      dark: brand.dark,
      darker: brand.darker,
    });
    setLogoFile(null);
  }, [brand.primary, brand.secondary, brand.dark, brand.darker, brand.logo]);

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
      <Stack spacing={2} sx={{ p: { xs: 1.5, sm: 2 } }}>
        <SettingsInfoCallout>{t("pages.settings.brand.hint")}</SettingsInfoCallout>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 220px) minmax(0, 1fr)" },
            gap: 2,
            alignItems: "start",
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

          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
              {t("pages.settings.brand.colorsTitle")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1.25,
              }}
            >
              <ColorSwatch label={t("pages.settings.brand.primary")} color={colors.primary} />
              <ColorSwatch label={t("pages.settings.brand.secondary")} color={colors.secondary} />
              <ColorSwatch label={t("pages.settings.brand.dark")} color={colors.dark} />
              <ColorSwatch label={t("pages.settings.brand.darker")} color={colors.darker} />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.25 }}>
              {t("pages.settings.brand.colorsHint")}
            </Typography>
          </Box>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="flex-end"
          sx={{
            pt: 0.5,
            borderTop: 1,
            borderColor: alpha(theme.palette.primary.main, 0.1),
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
