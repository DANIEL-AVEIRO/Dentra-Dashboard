import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { resolveMediaUrl } from "@/utils/mediaUrl";

export default function PhotoThumbStrip({
  urls = [],
  size = 40,
  max = 5,
  gap = 0.75,
  variant = "compact",
  emptyLabel = "—",
}) {
  const resolved = urls
    .map((url) => resolveMediaUrl(url))
    .filter(Boolean)
    .slice(0, max);
  const overflow = Math.max(0, urls.length - max);

  if (!resolved.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
        {emptyLabel}
      </Typography>
    );
  }

  if (variant === "drawer") {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ mb: 1, display: "block", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Receipt photos
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.25,
          }}
        >
          {resolved.map((src, index) => (
            <Box
              key={`${src}-${index}`}
              component="a"
              href={src}
              target="_blank"
              rel="noreferrer"
              sx={{
                display: "block",
                borderRadius: 2,
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
                aspectRatio: "4 / 3",
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.04 : 0.1),
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <Box
                component="img"
                src={src}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap, flexWrap: "nowrap" }}>
      {resolved.map((src, index) => (
        <Box
          key={`${src}-${index}`}
          sx={{
            width: size,
            height: size,
            borderRadius: 1.25,
            overflow: "hidden",
            flexShrink: 0,
            border: 1,
            borderColor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.18 : 0.28),
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.04 : 0.1),
            boxShadow: (theme) =>
              `0 1px 3px ${alpha(theme.palette.common.black, theme.palette.mode === "light" ? 0.08 : 0.2)}`,
          }}
        >
          <Box
            component="img"
            src={src}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Box>
      ))}
      {overflow > 0 ? (
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: 1.25,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.08 : 0.16),
            color: "primary.main",
            border: 1,
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Typography variant="caption" fontWeight={800}>
            +{overflow}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
