import { Box } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { useTranslation } from "@/context/LanguageContext";

export default function DeliveriesPage() {
  const { t } = useTranslation();

  return (
    <Box className="page-enter">
      <PageHeader
        title={t("pages.deliveries.title")}
        subtitle={t("pages.deliveries.subtitle")}
      />
    </Box>
  );
}
