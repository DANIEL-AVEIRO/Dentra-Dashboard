import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "@/utils/toast";
import { useTranslation } from "@/context/LanguageContext";

export default function CopyableText({ text, children }) {
  const { t } = useTranslation();
  const value = text == null || text === "" || text === "—" ? "" : String(text);
  if (!value) return "—";

  const copy = async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("table.copied"));
    } catch {
      toast.error(t("table.copyFailed"));
    }
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, maxWidth: "100%" }}>
      <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
        {children ?? value}
      </Box>
      <Tooltip title={t("table.copyValue")}>
        <IconButton size="small" onClick={copy} sx={{ p: 0.25, flexShrink: 0 }}>
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
