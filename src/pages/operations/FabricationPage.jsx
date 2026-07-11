import { Box } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { useTranslation } from "@/context/LanguageContext";

export default function FabricationPage() {
  const { t } = useTranslation();

  return (
    <Box className="page-enter">
      <PageHeader
        title={t("pages.fabrication.title")}
        subtitle={t("pages.fabrication.subtitle")}
      />
    </Box>
  );
}
