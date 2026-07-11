import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { pageSectionHeaderSx, pageSectionPaperSx } from "@/constants/pageLayout";

export function InfoMetaRow({ icon: Icon, label, value, showDivider = false, action }) {
  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: 1.5, py: 1.25, minHeight: 52 }}
      >
        {Icon ? (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        ) : null}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            lineHeight={1.2}
            display="block"
          >
            {label}
          </Typography>
          <Box sx={{ mt: 0.15 }}>{value ?? <Typography variant="body2" fontWeight={600}>—</Typography>}</Box>
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Stack>
      {showDivider ? <Divider sx={{ mx: 1.5 }} /> : null}
    </>
  );
}

export function InfoMetaList({ items }) {
  if (!items?.length) return null;

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {items.map((item, index) => (
        <InfoMetaRow
          key={item.key || item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          action={item.action}
          showDivider={index < items.length - 1}
        />
      ))}
    </Box>
  );
}

export default function InfoDetailCard({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
  highlight = false,
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Paper elevation={0} sx={pageSectionPaperSx}>
      <Box
        sx={{
          ...pageSectionHeaderSx,
          bgcolor: highlight
            ? alpha(primary, theme.palette.mode === "light" ? 0.06 : 0.12)
            : alpha(primary, theme.palette.mode === "light" ? 0.03 : 0.08),
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
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
              }}
            >
              <Icon sx={{ fontSize: 23 }} />
            </Box>
          ) : null}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.25 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, lineHeight: 1.5 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Box>
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>{children}</Box>
    </Paper>
  );
}
