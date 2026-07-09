import { useState } from "react";
import {
  Box,
  Checkbox,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { useClearCache } from "@/hooks/useClearCache";
import ActionButton from "@/components/common/ActionButton";
import SettingsSection from "@/components/settings/SettingsSection";
import { SettingsInfoCallout } from "@/components/settings/SettingsNavItem";

function CacheOptionCard({ icon: Icon, label, checked, onChange }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Box
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.25,
        p: 1.5,
        borderRadius: 2,
        cursor: "pointer",
        border: 1,
        borderColor: checked ? alpha(primary, 0.35) : "divider",
        bgcolor: checked ? alpha(primary, 0.07) : "background.paper",
        transition: "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: alpha(primary, 0.4),
          boxShadow: `0 6px 18px ${alpha(primary, 0.08)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          bgcolor: alpha(primary, checked ? 0.16 : 0.08),
          color: primary,
        }}
      >
        <Icon sx={{ fontSize: 19 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4, pr: 0.5 }}>
          {label}
        </Typography>
      </Box>
      <Checkbox
        size="small"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        sx={{ p: 0.25, mt: -0.25 }}
      />
    </Box>
  );
}

export default function CacheSettingsSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [preserveAuth, setPreserveAuth] = useState(true);
  const [preserveTheme, setPreserveTheme] = useState(true);
  const [clearServer, setClearServer] = useState(true);

  const isStaff = user?.is_staff || user?.is_superuser;
  const { clearCache, loading, ConfirmDialog } = useClearCache({
    preserveAuth,
    preserveTheme,
    clearServer,
  });

  const clearSummary = [
    t("pages.settings.cache.hintBase"),
    !preserveAuth && t("pages.settings.cache.hintAuth"),
    !preserveTheme && t("pages.settings.cache.hintTheme"),
    clearServer && isStaff && t("pages.settings.cache.hintServer"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <SettingsSection
        icon={CleaningServicesIcon}
        title={t("pages.settings.sections.cacheTitle")}
        description={t("pages.settings.sections.cacheDesc")}
        highlight
        action={
          <ActionButton
            intent="assign"
            size="small"
            startIcon={<CleaningServicesIcon />}
            onClick={clearCache}
            loading={loading}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {loading
              ? t("pages.settings.cache.clearing")
              : t("pages.settings.cache.clearButton")}
          </ActionButton>
        }
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: isStaff ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            <CacheOptionCard
              icon={LoginOutlinedIcon}
              label={t("pages.settings.cache.keepAuth")}
              checked={preserveAuth}
              onChange={setPreserveAuth}
            />
            <CacheOptionCard
              icon={PaletteOutlinedIcon}
              label={t("pages.settings.cache.keepTheme")}
              checked={preserveTheme}
              onChange={setPreserveTheme}
            />
            {isStaff ? (
              <CacheOptionCard
                icon={DnsOutlinedIcon}
                label={t("pages.settings.cache.clearServer")}
                checked={clearServer}
                onChange={setClearServer}
              />
            ) : null}
          </Box>

          <SettingsInfoCallout>
            <Typography
              component="span"
              variant="caption"
              fontWeight={700}
              color="text.primary"
              sx={{ display: "block", mb: 0.35 }}
            >
              {t("pages.settings.cache.whatClears")}
            </Typography>
            {clearSummary}
          </SettingsInfoCallout>
        </Stack>
      </SettingsSection>
      <ConfirmDialog />
    </>
  );
}
