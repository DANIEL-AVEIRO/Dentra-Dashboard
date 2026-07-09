import { Typography } from "@mui/material";
import { useTranslation } from "@/context/LanguageContext";
import HighlightText from "@/components/common/HighlightText";
import { summarizeAuditChanges } from "@/utils/auditDisplay";

/** Plain-language change summary for table cells */
export default function AuditChangeSummary({ changes, highlightQuery = "" }) {
  const { t, locale } = useTranslation();
  const text = summarizeAuditChanges(changes, t, locale);

  return (
    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
      <HighlightText text={text} query={highlightQuery} />
    </Typography>
  );
}
