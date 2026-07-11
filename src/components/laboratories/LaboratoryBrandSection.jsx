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
          height: 32,
          borderRadius: 1.5,
          bgcolor: color,
          border: 1,
          borderColor: "divider",
        }}
      />
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function LaboratoryBrandSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { brand, logoUrl, refresh } = useBrand();
  const isLabOwner = Boolean(user?.is_lab_owner);

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
      toast.error(t("pages.myLaboratory.brand.extractFailed"));
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
      toast.success(t("pages.myLaboratory.brand.saved"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("pages.myLaboratory.brand.saveFailed")));
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
      toast.success(t("pages.myLaboratory.brand.resetDone"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("pages.myLaboratory.brand.resetFailed")));
    } finally {
      setResetting(false);
    }
  };

  if (!isLabOwner) return null;

  return (
    <SettingsSection
      icon={ImageOutlinedIcon}
      title={t("pages.myLaboratory.brand.title")}
      description={t("pages.myLaboratory.brand.desc")}
      highlight
    >
      <Stack spacing={2}>
        <SettingsInfoCallout>{t("pages.myLaboratory.brand.hint")}</SettingsInfoCallout>

        <ImageField
          label={t("pages.myLaboratory.brand.logoLabel")}
          value={logoFile}
          previewUrl={logoFile ? null : logoUrl}
          onChange={handleLogoChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          resizePreset="logo"
          variant="logo"
          fullWidth
        />

        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
            {t("pages.settings.brand.colorsTitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            <ColorSwatch label={t("pages.settings.brand.primary")} color={colors.primary} />
            <ColorSwatch label={t("pages.settings.brand.secondary")} color={colors.secondary} />
            <ColorSwatch label={t("pages.settings.brand.dark")} color={colors.dark} />
            <ColorSwatch label={t("pages.settings.brand.darker")} color={colors.darker} />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {t("pages.settings.brand.colorsHint")}
          </Typography>
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
            size="small"
            startIcon={<RestartAltOutlinedIcon fontSize="small" />}
            onClick={handleReset}
            disabled={resetting || saving}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {resetting ? t("common.saving") : t("pages.myLaboratory.brand.reset")}
          </Button>
          <ActionButton
            size="small"
            onClick={handleSave}
            disabled={!dirty || saving || resetting}
            loading={saving}
            sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {t("pages.myLaboratory.brand.save")}
          </ActionButton>
        </Stack>
      </Stack>
    </SettingsSection>
  );
}
