import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";
import { transition } from "@/constants/motion";

export default function SettingsNavItem({ to, icon: Icon, title, description }) {
  return (
    <ListItemButton
      component={RouterLink}
      to={to}
      sx={(theme) => {
        const primary = theme.palette.primary.main;
        return {
          height: "100%",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          py: 1.5,
          px: 1.5,
          alignItems: "flex-start",
          transition: transition("border-color, background-color, transform, box-shadow"),
          bgcolor: theme.palette.mode === "light" ? "background.paper" : alpha("#fff", 0.02),
          "&:hover": {
            borderColor: alpha(primary, 0.4),
            bgcolor: alpha(primary, 0.05),
            boxShadow: `0 6px 16px ${alpha(primary, 0.08)}`,
          },
        };
      }}
    >
      {Icon ? (
        <ListItemIcon sx={{ minWidth: 42, mt: 0.15 }}>
          <Box
            sx={(theme) => {
              const primary = theme.palette.primary.main;
              return {
                width: 38,
                height: 38,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(primary, 0.11),
                color: primary,
              };
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>
        </ListItemIcon>
      ) : null}
      <ListItemText
        primary={title}
        secondary={description}
        primaryTypographyProps={{ variant: "body2", fontWeight: 700, lineHeight: 1.35 }}
        secondaryTypographyProps={{
          variant: "caption",
          sx: { mt: 0.35, lineHeight: 1.45, display: "block" },
        }}
        sx={{ my: 0 }}
      />
      <ChevronRightIcon
        sx={(theme) => ({
          color: theme.palette.primary.main,
          fontSize: 20,
          opacity: 0.55,
          alignSelf: "center",
          flexShrink: 0,
        })}
      />
    </ListItemButton>
  );
}

export function SettingsNavGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.25,
        width: "100%",
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
}

export function SettingsRowsPanel({ children }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.015)
            : alpha(theme.palette.primary.main, 0.05),
      }}
    >
      {children}
    </Box>
  );
}

export function SettingsInfoCallout({ children }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        border: 1,
        borderColor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.18 : 0.28),
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.05 : 0.1),
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55 }}>
        {children}
      </Typography>
    </Box>
  );
}
