import AddIcon from "@mui/icons-material/Add";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ActionButton from "@/components/common/ActionButton";
import { glassPanelSx } from "@/constants/glassSurface";

/**
 * Page top banner — bordered card with title, subtitle, and actions (GJM-style).
 */
export default function PageHeader({
  title,
  subtitle,
  onAdd,
  addLabel = "Add",
  action,
  /** Alias for `action` */
  actions,
  /** @deprecated Title shows when `title` is set */
  showTitle = false,
}) {
  const toolbarAction = action ?? actions;
  const hasTitle = Boolean(title) || showTitle;
  const hasMeta = hasTitle || subtitle;
  const hasActions = Boolean(toolbarAction || onAdd);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  if (!hasMeta && !hasActions) return null;

  return (
    <Paper elevation={0} sx={glassPanelSx(theme)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          flexWrap: "wrap",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
        }}
      >
        {hasMeta ? (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {hasTitle ? (
              <>
                <Box
                  aria-hidden
                  sx={{
                    width: 48,
                    height: 4,
                    borderRadius: 999,
                    mb: 0.75,
                    background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    minWidth: 0,
                    fontSize: { xs: "0.95rem", sm: "1.1rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </Typography>
              </>
            ) : null}
            {subtitle ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  mt: hasTitle ? 0.25 : 0,
                  maxWidth: { sm: hasActions ? "min(52ch, 100%)" : "none" },
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ flex: 1, minWidth: 0, display: { xs: "none", sm: "block" } }} />
        )}

        {hasActions ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexShrink: 0,
              flexWrap: "wrap",
              alignItems: "center",
              ml: { sm: hasMeta ? "auto" : 0 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              "& > .MuiButton-root": { flex: { xs: "1 1 auto", sm: "0 0 auto" } },
            }}
          >
            {toolbarAction}
            {onAdd ? (
              <ActionButton intent="create" size="small" startIcon={<AddIcon />} onClick={onAdd}>
                {addLabel}
              </ActionButton>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
