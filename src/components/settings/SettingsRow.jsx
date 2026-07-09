import { Box, Typography, alpha, useTheme } from "@mui/material";

/** Label + control row (settings-style list item). */
export default function SettingsRow({
  label,
  description,
  children,
  icon: Icon,
  last = false,
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: { xs: 1.25, sm: 2 },
        px: { xs: 1.5, sm: 2 },
        py: 1.75,
        borderBottom: last ? 0 : 1,
        borderColor: "divider",
        transition: "background-color 0.15s ease",
        "&:hover": {
          bgcolor: alpha(primary, 0.03),
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, flex: 1, minWidth: 0 }}>
        {Icon ? (
          <Box
            sx={{
              mt: 0.15,
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              bgcolor: alpha(primary, 0.1),
              color: primary,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        ) : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
            {label}
          </Typography>
          {description ? (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 0.35, lineHeight: 1.5 }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
          pl: Icon ? { sm: 1 } : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
