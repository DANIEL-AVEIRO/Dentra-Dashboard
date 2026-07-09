import { Box, Card, Stack, Typography, alpha, useTheme } from "@mui/material";
import { glassPanelSx } from "@/constants/glassSurface";
import { TABLE_BORDER_RADIUS } from "@/constants/layout";

/** Grouped block on the Settings page */
export default function SettingsSection({
  icon: Icon,
  title,
  description,
  action,
  children,
  noPadding = false,
  highlight = false,
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "100%",
        borderRadius: TABLE_BORDER_RADIUS,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        ...glassPanelSx(theme),
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: highlight
            ? alpha(primary, theme.palette.mode === "light" ? 0.06 : 0.12)
            : alpha(primary, theme.palette.mode === "light" ? 0.03 : 0.08),
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          {Icon ? (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(primary, 0.12),
                color: primary,
                flexShrink: 0,
                boxShadow: `inset 0 1px 0 ${alpha("#fff", theme.palette.mode === "light" ? 0.5 : 0.08)}`,
              }}
            >
              <Icon sx={{ fontSize: 23 }} />
            </Box>
          ) : null}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.25 }}>
              {title}
            </Typography>
            {description ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.35, lineHeight: 1.5, maxWidth: "52ch" }}
              >
                {description}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {action ? (
          <Box sx={{ flexShrink: 0, alignSelf: { xs: "stretch", sm: "center" }, width: { xs: "100%", sm: "auto" } }}>
            {action}
          </Box>
        ) : null}
      </Box>
      <Box
        sx={{
          flex: 1,
          px: noPadding ? 0 : { xs: 2, md: 2.5 },
          py: noPadding ? 0 : { xs: 2, md: 2.5 },
        }}
      >
        {children}
      </Box>
    </Card>
  );
}
