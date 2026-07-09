import { Box } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import "@/styles/admin-landing.css";

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Box className="admin-landing page-enter">
      <PageHeader
        title={t("adminLanding.admin.welcome", { name: user?.username || "—" })}
        subtitle={t("adminLanding.admin.subtitle")}
      />
    </Box>
  );
}
