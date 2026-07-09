import {
  Box,
  Button,
  Stack,
} from "@mui/material";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PageHeader from "@/components/common/PageHeader";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsRow from "@/components/settings/SettingsRow";
import SettingsNavItem, {
  SettingsNavGrid,
  SettingsRowsPanel,
} from "@/components/settings/SettingsNavItem";
import SettingsThemeToggle from "@/components/settings/SettingsThemeToggle";
import BrandSettingsSection from "@/components/settings/BrandSettingsSection";
import CacheSettingsSection from "@/components/settings/CacheSettingsSection";
import { useTranslation } from "@/context/LanguageContext";
import { useThemeMode } from "@/context/ThemeContext";
import { useLockScreen } from "@/context/LockScreenContext";
import { trashUrlFromContext } from "@/utils/trashNavigation";
import { useLocation } from "react-router-dom";
import { SECTION_GAP } from "@/constants/layout";
import { pageFormSx } from "@/components/common/form/formLayout";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { lock } = useLockScreen();
  const { pathname } = useLocation();

  const systemLinks = [
    {
      to: "/roles",
      icon: AdminPanelSettingsIcon,
      title: t("nav.roles"),
      description: t("pages.settings.system.rolesDesc"),
    },
    {
      to: "/audit-logs",
      icon: HistoryIcon,
      title: t("nav.auditLogs"),
      description: t("pages.settings.system.auditDesc"),
    },
    {
      to: trashUrlFromContext({ pathname }),
      icon: DeleteOutlineIcon,
      title: t("nav.trash"),
      description: t("pages.settings.system.trashDesc"),
    },
    {
      to: "/profile",
      icon: PersonOutlineIcon,
      title: t("nav.profile"),
      description: t("pages.settings.system.profileDesc"),
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1180,
        mx: "auto",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <PageHeader
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <Stack
        spacing={SECTION_GAP}
        sx={{ ...pageFormSx, mt: SECTION_GAP, minWidth: 0, width: "100%" }}
      >
        <BrandSettingsSection />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 5fr) minmax(0, 7fr)" },
            gap: 2.5,
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ minWidth: 0, width: "100%" }}>
            <SettingsSection
              icon={TuneOutlinedIcon}
              title={t("pages.settings.sections.adminTitle")}
              description={t("pages.settings.sections.adminDesc")}
            >
              <SettingsRowsPanel>
                <SettingsRow
                  icon={PaletteOutlinedIcon}
                  label={t("pages.settings.admin.appearance")}
                  description={
                    mode === "light"
                      ? t("pages.settings.admin.darkModeOff")
                      : t("pages.settings.admin.darkModeOn")
                  }
                >
                  <SettingsThemeToggle mode={mode} onToggle={toggleMode} />
                </SettingsRow>

                <SettingsRow
                  icon={LockOutlinedIcon}
                  label={t("lockScreen.lock")}
                  description={t("pages.settings.admin.lockDesc")}
                  last
                >
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<LockOutlinedIcon fontSize="small" />}
                    onClick={lock}
                    sx={{
                      fontWeight: 700,
                      borderRadius: 999,
                      px: 2,
                      textTransform: "none",
                    }}
                  >
                    {t("lockScreen.lock")}
                  </Button>
                </SettingsRow>
              </SettingsRowsPanel>
            </SettingsSection>
          </Box>

          <Box sx={{ minWidth: 0, width: "100%" }}>
            <SettingsSection
              icon={AdminPanelSettingsIcon}
              title={t("pages.settings.sections.systemTitle")}
              description={t("pages.settings.sections.systemDesc")}
            >
              <SettingsNavGrid>
                {systemLinks.map((link) => (
                  <SettingsNavItem key={link.to} {...link} />
                ))}
              </SettingsNavGrid>
            </SettingsSection>
          </Box>
        </Box>

        <CacheSettingsSection />
      </Stack>
    </Box>
  );
}
