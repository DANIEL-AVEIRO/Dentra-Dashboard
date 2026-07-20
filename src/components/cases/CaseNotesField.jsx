import { Box, Stack, Typography } from "@mui/material";
import { ProTextField } from "@/components/common/form";
import { useTranslation } from "@/context/LanguageContext";
import { formatDateTime } from "@/utils/format";

function NoteEntry({ note }) {
  const author = note.created_by_name || "—";
  const when = note.created_at ? formatDateTime(note.created_at) : "—";

  return (
    <Box
      sx={{
        py: 1.25,
        px: 1.5,
        borderRadius: 1.5,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
        spacing={1}
        sx={{ mb: 0.75 }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
          {author}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {when}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "text.primary" }}
      >
        {note.body}
      </Typography>
    </Box>
  );
}

export default function CaseNotesField({
  label,
  history = [],
  value = "",
  onChange,
  error,
  rows = 3,
}) {
  const { t } = useTranslation();
  const entries = Array.isArray(history) ? history : [];

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      {entries.length > 0 ? (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            {t("pages.cases.notes.historyTitle")}
          </Typography>
          <Stack spacing={1}>
            {entries.map((note) => (
              <NoteEntry key={note.id || `${note.created_at}-${note.body}`} note={note} />
            ))}
          </Stack>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t("pages.cases.notes.empty")}
        </Typography>
      )}

      <ProTextField
        id={`field-${label}`}
        label={label}
        labelPlacement="outlined"
        fullWidth
        multiline
        minRows={rows}
        placeholder={t("pages.cases.notes.addPlaceholder")}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        error={Boolean(error)}
        helperText={error}
      />
    </Stack>
  );
}
